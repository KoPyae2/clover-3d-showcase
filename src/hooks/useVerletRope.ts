import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Frame-based Verlet (gravity/damping are per-frame constants, not dt-scaled)
const GRAVITY = 0.0045
const DAMPING = 0.994
/** Fewer iterations = slightly less rigid rope overall */
const ITERS = 10
/** Softer constraint correction on segments closer to the tail (when tail is not pinned). */
const TAIL_CONSTRAINT_SOFT = 0.62
/** Extra damping near free tail so attachment zone settles calmly */
const TAIL_EXTRA_DAMP = 0.024

interface Node {
  pos: THREE.Vector3
  prev: THREE.Vector3
}

export function useVerletRope(segLen = 0.13, count = 18) {
  const nodes = useRef<Node[]>([])
  const ready = useRef(false)

  const _edgeDelta = useRef(new THREE.Vector3())

  useEffect(() => {
    ready.current = false
  }, [segLen, count])

  function init(anchor: THREE.Vector3) {
    nodes.current = Array.from({ length: count }, (_, i) => {
      const p = anchor.clone().add(new THREE.Vector3(0, -i * segLen, 0))
      return { pos: p.clone(), prev: p.clone() }
    })
    ready.current = true
  }

  function simulate(anchor: THREE.Vector3, pinnedTail?: THREE.Vector3) {
    if (!ready.current) {
      init(anchor)
      return
    }
    const ns = nodes.current

    const denomTail = Math.max(count - 2, 1)

    for (let i = 1; i < count; i++) {
      if (pinnedTail && i === count - 1) continue
      const n = ns[i]
      const tailProx = (count - 1 - i) / denomTail
      const damp = DAMPING - tailProx * tailProx * TAIL_EXTRA_DAMP

      const vel = _edgeDelta.current.copy(n.pos).sub(n.prev).multiplyScalar(damp)
      n.prev.copy(n.pos)
      n.pos.add(vel)
      n.pos.y -= GRAVITY
    }

    for (let iter = 0; iter < ITERS; iter++) {
      ns[0].pos.copy(anchor)
      ns[0].prev.copy(anchor)
      if (pinnedTail) {
        ns[count - 1].pos.copy(pinnedTail)
        ns[count - 1].prev.copy(pinnedTail)
      }

      for (let i = 0; i < count - 1; i++) {
        const a = ns[i]
        const b = ns[i + 1]
        const d = _edgeDelta.current.copy(b.pos).sub(a.pos)
        const len = d.length()
        if (len < 1e-5) continue

        const diff = (len - segLen) / len
        const pinA = i === 0
        const pinB = !!pinnedTail && i + 1 === count - 1

        const tailness = Math.max(i, i + 1) / Math.max(count - 1, 1)
        const slackMul =
          pinnedTail ? 1 : 1 - TAIL_CONSTRAINT_SOFT * tailness * tailness

        if (!pinA && !pinB) {
          const h = 0.5 * diff * slackMul
          a.pos.addScaledVector(d, h)
          b.pos.addScaledVector(d, -h)
        } else if (pinA) {
          const k = diff * (pinnedTail ? 1 : Math.max(slackMul, 0.82))
          b.pos.addScaledVector(d, -k)
        } else if (pinB) {
          const k = diff * (pinnedTail ? 1 : Math.max(slackMul, 0.82))
          a.pos.addScaledVector(d, k)
        }
      }
    }
  }

  function injectTailVelocity(vel: THREE.Vector3) {
    if (!ready.current) return
    const n = nodes.current[count - 1]
    n.prev.copy(n.pos).sub(vel)
  }

  function positions(): THREE.Vector3[] {
    return nodes.current.map((n) => n.pos.clone())
  }

  function tail(): THREE.Vector3 {
    return ready.current ? nodes.current[count - 1].pos.clone() : new THREE.Vector3()
  }

  function reset() {
    ready.current = false
  }

  return { simulate, positions, tail, injectTailVelocity, reset }
}
