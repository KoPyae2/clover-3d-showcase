import { useRef, useEffect, useCallback, useLayoutEffect, type RefObject } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** DOM targets that must keep pointer events (never start clover drag on top of these). */
const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], [role="tab"], [role="link"], [role="switch"], [role="slider"], [contenteditable="true"]'

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest(INTERACTIVE_SELECTOR))
}

export type UseDragOptions = {
  /**
   * `mesh` — R3F mesh `onPointerDown` only (canvas must be above HTML).
   * `window` — capture-phase `pointerdown` on `window` + raycast; HTML can sit above the canvas.
   */
  mode?: 'mesh' | 'window'
  /** Required when mode is `window`: object to intersect (e.g. clover group ref). */
  raycastTarget?: RefObject<THREE.Object3D | null>
  /** Window mode: world-space point on mesh where the drag started (for grab offset vs eyelet). */
  onGrabWorld?: (worldPoint: THREE.Vector3) => void
}

/** Canvas-local NDC ray → world point on plane z = targetZ */
function canvasToWorld(
  localX: number,
  localY: number,
  width: number,
  height: number,
  z: number,
  cam: THREE.Camera
): THREE.Vector3 {
  const v = new THREE.Vector3((localX / width) * 2 - 1, -(localY / height) * 2 + 1, 0.5)
  v.unproject(cam)
  const d = v.sub(cam.position).normalize()
  const t = (z - cam.position.z) / d.z
  return cam.position.clone().add(d.multiplyScalar(t))
}

const DRAG_THRESHOLD = 8

export function useDrag(
  targetZ = 0,
  onDragChange?: (dragging: boolean) => void,
  opts?: UseDragOptions
) {
  const { camera, gl } = useThree()
  const mode = opts?.mode ?? 'mesh'
  const raycastTarget = opts?.raycastTarget

  const onDragChangeRef = useRef(onDragChange)
  useLayoutEffect(() => {
    onDragChangeRef.current = onDragChange
  }, [onDragChange])

  const isDragging = useRef(false)
  const dragPos = useRef<THREE.Vector3 | null>(null)
  const prevDragPos = useRef(new THREE.Vector3())
  const dragVelocity = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())
  const ndc = useRef(new THREE.Vector2())
  const pendingPointer = useRef<{ x: number; y: number; pointerId: number } | null>(null)
  const touchActionRestore = useRef('')
  const touchActionSaved = useRef(false)

  const getRelease = useCallback((): THREE.Vector3 => {
    return dragVelocity.current.clone().multiplyScalar(0.8)
  }, [])

  const toWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect()
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      const lx = THREE.MathUtils.clamp(clientX - rect.left, 0, w)
      const ly = THREE.MathUtils.clamp(clientY - rect.top, 0, h)
      return canvasToWorld(lx, ly, w, h, targetZ, camera)
    },
    [camera, gl, targetZ]
  )

  const beginDrag = useCallback(
    (clientX: number, clientY: number, pointerId: number, captureEl: Element) => {
      try {
        captureEl.setPointerCapture(pointerId)
      } catch {
        /* ignore */
      }
      if (!touchActionSaved.current) {
        touchActionRestore.current = document.documentElement.style.touchAction || ''
        touchActionSaved.current = true
      }
      document.documentElement.style.touchAction = 'none'
      isDragging.current = true
      onDragChangeRef.current?.(true)
      const p = toWorld(clientX, clientY)
      dragPos.current = p
      prevDragPos.current.copy(p)
      dragVelocity.current.set(0, 0, 0)
    },
    [toWorld]
  )

  const endDrag = useCallback(() => {
    if (touchActionSaved.current) {
      document.documentElement.style.touchAction = touchActionRestore.current
      touchActionRestore.current = ''
      touchActionSaved.current = false
    }
  }, [])

  const moveRoot = mode === 'window' ? window : gl.domElement
  const captureEl = mode === 'window' ? document.body : gl.domElement

  useEffect(() => {
    const onMove = (e: Event) => {
      const pe = e as PointerEvent
      const pending = pendingPointer.current
      if (pending && (pe.pointerId === pending.pointerId || (pending.pointerId === -1 && pe.pointerType === 'touch'))) {
        if (isDragging.current) {
          pendingPointer.current = null
          return
        }
        const dx = pe.clientX - pending.x
        const dy = pe.clientY - pending.y
        if (Math.abs(dx) + Math.abs(dy) <= DRAG_THRESHOLD) return
        pendingPointer.current = null
        beginDrag(pending.x, pending.y, pe.pointerId, captureEl)
        const p = toWorld(pe.clientX, pe.clientY)
        dragVelocity.current.copy(p).sub(prevDragPos.current)
        prevDragPos.current.copy(p)
        dragPos.current = p
        return
      }
      if (!isDragging.current) return
      const p = toWorld(pe.clientX, pe.clientY)
      dragVelocity.current.copy(p).sub(prevDragPos.current)
      prevDragPos.current.copy(p)
      dragPos.current = p
    }

    const onUp = (e: Event) => {
      const pe = e as PointerEvent
      if (pendingPointer.current) {
        pendingPointer.current = null
        if (touchActionSaved.current) {
          document.documentElement.style.touchAction = touchActionRestore.current
          touchActionRestore.current = ''
          touchActionSaved.current = false
        }
        return
      }
      if (!isDragging.current) return
      isDragging.current = false
      onDragChangeRef.current?.(false)
      endDrag()
      try {
        captureEl.releasePointerCapture(pe.pointerId)
      } catch {
        /* not captured */
      }
    }

    const passiveOpts = mode === 'window' ? { passive: false } as AddEventListenerOptions : undefined
    moveRoot.addEventListener('pointermove', onMove, passiveOpts)
    moveRoot.addEventListener('pointerup', onUp, passiveOpts)
    moveRoot.addEventListener('pointercancel', onUp, passiveOpts)
    return () => {
      moveRoot.removeEventListener('pointermove', onMove, passiveOpts)
      moveRoot.removeEventListener('pointerup', onUp, passiveOpts)
      moveRoot.removeEventListener('pointercancel', onUp, passiveOpts)
      pendingPointer.current = null
      if (touchActionSaved.current) {
        document.documentElement.style.touchAction = touchActionRestore.current
        touchActionRestore.current = ''
        touchActionSaved.current = false
      }
      if (isDragging.current) {
        isDragging.current = false
        onDragChangeRef.current?.(false)
        endDrag()
      }
    }
  }, [moveRoot, captureEl, toWorld])

  const onGrabWorldRef = useRef(opts?.onGrabWorld)
  useLayoutEffect(() => {
    onGrabWorldRef.current = opts?.onGrabWorld
  }, [opts?.onGrabWorld])

  useEffect(() => {
    if (mode !== 'window') return

    const onTouchStartCapture = (e: Event) => {
      const te = e as TouchEvent
      if (te.touches.length !== 1) return
      const t = te.touches[0]
      if (isInteractiveTarget(te.target)) return

      const root = raycastTarget?.current
      if (!root) return

      const rect = gl.domElement.getBoundingClientRect()
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      ndc.current.x = ((t.clientX - rect.left) / w) * 2 - 1
      ndc.current.y = -((t.clientY - rect.top) / h) * 2 + 1
      raycaster.current.setFromCamera(ndc.current, camera)
      const hits = raycaster.current.intersectObject(root, true)
      if (!hits.length) return

      const usable = hits.find(
        (h) => !(h.object instanceof THREE.Mesh && h.object.userData?.skipBBox)
      ) ?? hits[0]

      te.preventDefault()

      if (!touchActionSaved.current) {
        touchActionRestore.current = document.documentElement.style.touchAction || ''
        touchActionSaved.current = true
      }
      document.documentElement.style.touchAction = 'none'

      onGrabWorldRef.current?.(usable.point.clone())
      pendingPointer.current = { x: t.clientX, y: t.clientY, pointerId: -1 }
    }

    const onDownCapture = (e: Event) => {
      const pe = e as PointerEvent
      if (pe.pointerType === 'touch') return
      if (pe.button !== 0) return
      if (isDragging.current) return
      if (isInteractiveTarget(pe.target)) return

      const root = raycastTarget?.current
      if (!root) return

      const rect = gl.domElement.getBoundingClientRect()
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      ndc.current.x = ((pe.clientX - rect.left) / w) * 2 - 1
      ndc.current.y = -((pe.clientY - rect.top) / h) * 2 + 1
      raycaster.current.setFromCamera(ndc.current, camera)
      const hits = raycaster.current.intersectObject(root, true)
      if (!hits.length) return

      const usable =
        hits.find(
          (h) => !(h.object instanceof THREE.Mesh && h.object.userData?.skipBBox)
        ) ?? hits[0]

      onGrabWorldRef.current?.(usable.point.clone())
      pendingPointer.current = { x: pe.clientX, y: pe.clientY, pointerId: pe.pointerId }

      if (!touchActionSaved.current) {
        touchActionRestore.current = document.documentElement.style.touchAction || ''
        touchActionSaved.current = true
      }
      document.documentElement.style.touchAction = 'none'
    }

    window.addEventListener('pointerdown', onDownCapture, true)
    window.addEventListener('touchstart', onTouchStartCapture, { capture: true, passive: false })
    return () => {
      window.removeEventListener('pointerdown', onDownCapture, true)
      window.removeEventListener('touchstart', onTouchStartCapture, { capture: true })
    }
  }, [mode, raycastTarget, gl, camera, beginDrag, captureEl])

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (mode === 'window') return
      e.stopPropagation()
      const native = e.nativeEvent
      beginDrag(native.clientX, native.clientY, native.pointerId, gl.domElement)
    },
    [mode, gl, beginDrag]
  )

  return { isDragging, dragPos, dragVelocity, getRelease, onPointerDown }
}
