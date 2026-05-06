/**
 * CloverOverlayScene — full-viewport canvas; rope anchors top; tail pins to eyelet world position.
 * Scan uses eyelet (ring) vs DOM tap target.
 */
import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CloverModel } from './CloverModel'
import { RopeMesh } from './RopeMesh'
import type { RopeMeshHandle } from './RopeMesh'
import { useVerletRope } from '../../hooks/useVerletRope'
import { useDrag } from '../../hooks/useDrag'
import { useColorStore } from '../../store/useColorStore'
import { pointInTapTarget } from '../../lib/tapTargetRect'
const MAX_TILT_DEG = 25

const SCAN_HOLD_FRAMES = 22
const _projScratch = new THREE.Vector3()

function worldToClient(
  wp: THREE.Vector3,
  camera: THREE.Camera,
  canvasRect: DOMRectReadOnly
): { x: number; y: number } {
  _projScratch.copy(wp).project(camera)
  const x = canvasRect.left + (_projScratch.x * 0.5 + 0.5) * canvasRect.width
  const y = canvasRect.top + (-_projScratch.y * 0.5 + 0.5) * canvasRect.height
  return { x, y }
}

function s2w(localX: number, localY: number, cam: THREE.Camera, w: number, h: number) {
  const v = new THREE.Vector3((localX / w) * 2 - 1, -(localY / h) * 2 + 1, 0.5)
  v.unproject(cam)
  const d = v.sub(cam.position).normalize()
  const t = (0 - cam.position.z) / d.z
  return cam.position.clone().add(d.multiplyScalar(t))
}

const Z_CANVAS = 140

function Scene() {
  const { camera, size, gl } = useThree()
  const color = useColorStore((s) => s.color)
  const scanTriggered = useColorStore((s) => s.scanTriggered)
  const setModelX = useColorStore((s) => s.setModelX)
  const setScanTriggered = useColorStore((s) => s.setScanTriggered)
  const setModelDragActive = useColorStore((s) => s.setModelDragActive)
  const ropeSettings = useColorStore((s) => s.ropeSettings)
  const modelSettings = useColorStore((s) => s.modelSettings)

  const modelRef = useRef<THREE.Group>(null)
  const ropeSeg = ropeSettings.ropeSpan / Math.max(ropeSettings.ropeNodes - 1, 1)
  const rope = useVerletRope(ropeSeg, ropeSettings.ropeNodes, ropeSettings.windStrength, ropeSettings.windFreq)
  const drag = useDrag(0, setModelDragActive, { mode: 'window', raycastTarget: modelRef })
  const ropeMeshRef = useRef<RopeMeshHandle>(null)

  /** Auto-detected ring point in model space (from bbox); user offsets add on top in real time. */
  const eyeletBaseLocal = useRef(new THREE.Vector3(0, 0.1, 0))
  const eyeletEffectiveLocal = useRef(new THREE.Vector3())
  const eyeOffWorld = useRef(new THREE.Vector3())
  const eyeWorld = useRef(new THREE.Vector3())
  const bbDone = useRef(false)
  const modelPos = useRef(new THREE.Vector3(0, -1.0, 0))
  const modelTilt = useRef(0)
  const prevX = useRef(0)
  const wasDragging = useRef(false)
  const scanFrames = useRef(0)

  useEffect(() => {
    bbDone.current = false
    const run = () => {
      const g = modelRef.current
      if (bbDone.current || !g) return
      const box = new THREE.Box3().makeEmpty()
      g.updateWorldMatrix(true, true)
      g.traverse((o) => {
        if (o instanceof THREE.Mesh && !o.userData.skipBBox) {
          box.expandByObject(o)
        }
      })
      if (box.isEmpty()) return
      const c = new THREE.Vector3()
      box.getCenter(c)
      const topW = new THREE.Vector3(c.x, box.max.y - 0.014, c.z)
      g.worldToLocal(topW)
      eyeletBaseLocal.current.copy(topW)
      bbDone.current = true
    }
    run()
    const id = setTimeout(run, 500)
    return () => clearTimeout(id)
  }, [modelSettings.modelScale])

  useFrame(() => {
    const dragging = drag.isDragging.current
    let tailPin: THREE.Vector3 | undefined
    if (dragging && drag.dragPos.current) {
      tailPin = drag.dragPos.current.clone()
    }

    if (wasDragging.current && !dragging) {
      rope.injectTailVelocity(drag.getRelease())
    }
    wasDragging.current = dragging

    const ax = size.width * ropeSettings.anchorX
    const ay = ropeSettings.anchorY
    const anchor = s2w(ax, ay, camera, size.width, size.height)
    anchor.z += ropeSettings.anchorZ

    rope.simulate(anchor, tailPin)
    ropeMeshRef.current?.updateStrands(rope.positions(), color, ropeSettings.ropeStroke)

    const tail = rope.tail()
    const g = modelRef.current

    const eyeLocal = eyeletEffectiveLocal.current
    eyeLocal.copy(eyeletBaseLocal.current)
    eyeLocal.x += modelSettings.eyeletOffsetX
    eyeLocal.y += modelSettings.eyeletOffsetY
    eyeLocal.z += modelSettings.eyeletOffsetZ

    if (g && bbDone.current) {
      const off = eyeOffWorld.current
      off.copy(eyeLocal)
      off.multiplyScalar(g.scale.x)
      off.applyQuaternion(g.quaternion)
      modelPos.current.copy(tail).sub(off)
      g.position.copy(modelPos.current)
    } else if (g) {
      modelPos.current.set(tail.x, tail.y, tail.z)
      g.position.copy(modelPos.current)
    }

    const dx = modelPos.current.x - prevX.current
    prevX.current = modelPos.current.x
    const targetTilt = THREE.MathUtils.clamp(
      -dx * 60,
      -THREE.MathUtils.degToRad(MAX_TILT_DEG),
      THREE.MathUtils.degToRad(MAX_TILT_DEG)
    )
    modelTilt.current = THREE.MathUtils.lerp(modelTilt.current, targetTilt, 0.06)

    if (g) {
      g.rotation.z = modelTilt.current
    }

    setModelX(THREE.MathUtils.lerp(0, modelPos.current.x, 1))

    if (!scanTriggered && g && bbDone.current) {
      const ew = eyeWorld.current
      ew.copy(eyeLocal)
      ew.multiplyScalar(g.scale.x)
      ew.applyQuaternion(g.quaternion)
      ew.add(g.position)
      const rect = gl.domElement.getBoundingClientRect()
      const { x, y } = worldToClient(ew, camera, rect)
      const inZone = pointInTapTarget(x, y, 28)
      scanFrames.current = inZone ? scanFrames.current + 1 : 0
      if (scanFrames.current >= SCAN_HOLD_FRAMES) {
        scanFrames.current = 0
        setScanTriggered(true)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-1, -1, 1]} intensity={0.3} color="#c8d8ff" />
      <pointLight position={[0, -3, 2]} intensity={1.0} color={color} distance={8} />

      <RopeMesh ref={ropeMeshRef} />

      <Suspense fallback={null}>
        <CloverModel
          ref={modelRef}
          position={[0, -1.0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={modelSettings.modelScale}
          color={color}
          windSwayX={modelSettings.windSwayX}
          windSwayY={modelSettings.windSwayY}
        />
      </Suspense>
    </>
  )
}

function CloverOverlayCanvas() {
  const modelDragActive = useColorStore((s) => s.modelDragActive)

  useEffect(() => {
    document.documentElement.classList.toggle('clover-model-dragging', modelDragActive)
    return () => document.documentElement.classList.remove('clover-model-dragging')
  }, [modelDragActive])

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.5, 5], fov: 50 }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: Z_CANVAS,
        background: 'transparent',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
      }}
      onCreated={({ gl }) => {
        const el = gl.domElement
        el.style.pointerEvents = 'none'
        el.style.touchAction = 'none'
      }}
    >
      <Scene />
    </Canvas>
  )
}

export function CloverOverlayScene() {
  return <CloverOverlayCanvas />
}
