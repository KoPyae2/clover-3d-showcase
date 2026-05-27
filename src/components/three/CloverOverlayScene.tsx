/**
 * CloverOverlayScene — full-viewport canvas; rope anchors top; tail pins to eyelet world position.
 * Rope pins to eyelet; tap / NFC proximity uses model bbox center vs DOM tap target.
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
import { pointInTapTarget, getTapTargetRect } from '../../lib/tapTargetRect'
import { modelPosition } from '../../lib/modelPosition'

const IS_MOBILE = typeof window !== 'undefined' && Math.min(screen.width, screen.height) < 768
const MAX_TILT_DEG = 25

const SCAN_HOLD_FRAMES = 22
const _projScratch = new THREE.Vector3()
const _s2wScratch = new THREE.Vector3()
const _spawnScratch = new THREE.Vector3()
const _autoTargetW = new THREE.Vector3()
const _autoDesiredPos = new THREE.Vector3()

function worldToClient(
  wp: THREE.Vector3,
  camera: THREE.Camera,
  width: number,
  height: number
): { x: number; y: number } {
  _projScratch.copy(wp).project(camera)
  const x = (_projScratch.x * 0.5 + 0.5) * width
  const y = (-_projScratch.y * 0.5 + 0.5) * height
  return { x, y }
}

function s2w(localX: number, localY: number, cam: THREE.Camera, w: number, h: number, target: THREE.Vector3) {
  target.set((localX / w) * 2 - 1, -(localY / h) * 2 + 1, 0.5)
  target.unproject(cam)
  
  const dx = target.x - cam.position.x
  const dy = target.y - cam.position.y
  const dz = target.z - cam.position.z
  
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const nx = dx / len
  const ny = dy / len
  const nz = dz / len
  
  const t = (0 - cam.position.z) / nz
  return target.set(
    cam.position.x + nx * t,
    cam.position.y + ny * t,
    cam.position.z + nz * t
  )
}

const Z_CANVAS = 140

const ropeSettings = {
  anchorY: 32,
  anchorZ: 0,
  ropeTwinSpreadPx: 3,
  ropeStroke: IS_MOBILE ? 0.009 : 0.011,
  ropeSpan: 1.28,
  ropeNodes: IS_MOBILE ? 8 : 16,
}

const modelSettings = {
  eyeletOffsetX: -0.000,
  eyeletOffsetY: 0,
  eyeletOffsetZ: 0,
  modelScale: 12.5,
}

function Scene() {
  const { camera, size } = useThree()
  const color = useColorStore((s) => s.color)
  const scanTriggered = useColorStore((s) => s.scanTriggered)
  const setScanTriggered = useColorStore((s) => s.setScanTriggered)
  const setModelDragActive = useColorStore((s) => s.setModelDragActive)
  const isAutoScanning = useColorStore((s) => s.isAutoScanning)
  const setIsAutoScanning = useColorStore((s) => s.setIsAutoScanning)
  const time = useRef(0)
  const autoScanProgress = useRef(0)
  const autoScanStartPos = useRef(new THREE.Vector3())
  const isAutoScanningPrev = useRef(false)

  const modelRef = useRef<THREE.Group>(null)
  /** Local-space point on mesh at pointer down — keeps grab under finger while dragging (vs eyelet snap). */
  const grabAnchorLocal = useRef(new THREE.Vector3(0, 0, 0))
  const ropeSeg = ropeSettings.ropeSpan / Math.max(ropeSettings.ropeNodes - 1, 1)
  const rope = useVerletRope(ropeSeg, ropeSettings.ropeNodes)
  const drag = useDrag(0, setModelDragActive, {
    mode: 'window',
    raycastTarget: modelRef,
    onGrabWorld: (worldPoint) => {
      const g = modelRef.current
      if (!g) return
      const lc = worldPoint.clone()
      g.worldToLocal(lc)
      grabAnchorLocal.current.copy(lc)
    },
  })
  const ropeMeshRef = useRef<RopeMeshHandle>(null)

  /** Auto-detected ring point in model space (from bbox); user offsets add on top in real time. */
  const eyeletBaseLocal = useRef(new THREE.Vector3(0, 0.1, 0))
  /** Bbox centroid in Clover root local space — used as screen-space tap proximity point */
  const modelCenterLocal = useRef(new THREE.Vector3(0, 0, 0))
  const eyeletEffectiveLocal = useRef(new THREE.Vector3())
  const eyeOffWorld = useRef(new THREE.Vector3())
  /** World-space eyelet for rope tail pin while dragging */
  const eyeWorldPin = useRef(new THREE.Vector3())
  const tapPointWorld = useRef(new THREE.Vector3())
  const bbDone = useRef(false)
  const modelPos = useRef(new THREE.Vector3(0, -1.0, 0))
  const modelTilt = useRef(0)
  const wasDragging = useRef(false)
  const scanFrames = useRef(0)
  const releaseCooldown = useRef(0)

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
      const centerLocalPt = new THREE.Vector3().copy(c)
      g.worldToLocal(centerLocalPt)
      modelCenterLocal.current.copy(centerLocalPt)
      bbDone.current = true
    }
    run()
    const id = setTimeout(run, 500)
    return () => clearTimeout(id)
  }, [])

  useFrame((_state, delta) => {
    time.current += delta
    const dragging = drag.isDragging.current

    if (wasDragging.current && !dragging) {
      rope.injectTailVelocity(drag.getRelease())
    }
    wasDragging.current = dragging

    let ax: number
    // Precise alignment with the header's "Active Finish" dot
    const containerMaxWidth = 1200
    const padding = 24
    const dotCenterOffset = 20
    if (size.width > containerMaxWidth) {
      ax = (size.width / 2) + (containerMaxWidth / 2) - padding - dotCenterOffset
    } else {
      ax = size.width - padding - dotCenterOffset
    }
    const ay = ropeSettings.anchorY

    // Anchor is always at its default top-right location
    const anchor = s2w(ax, ay, camera, size.width, size.height, _s2wScratch)
    anchor.z += ropeSettings.anchorZ

    const g = modelRef.current

    const eyeLocal = eyeletEffectiveLocal.current
    eyeLocal.copy(eyeletBaseLocal.current)
    eyeLocal.x += modelSettings.eyeletOffsetX
    eyeLocal.y += modelSettings.eyeletOffsetY
    eyeLocal.z += modelSettings.eyeletOffsetZ

    let tailPin: THREE.Vector3 | undefined
    const SPAWN_DELAY = 0.15
    const isSpawning = time.current < SPAWN_DELAY

    if (isSpawning) {
      s2w(size.width / 2, ropeSettings.anchorY - 240, camera, size.width, size.height, _spawnScratch)
      tailPin = _spawnScratch
      rope.teleportRoute(anchor, tailPin)
      
      if (g) {
        const off = eyeOffWorld.current
        off.copy(eyeLocal)
        off.multiplyScalar(g.scale.x)
        off.applyQuaternion(g.quaternion)
        modelPos.current.copy(tailPin).sub(off)
        g.position.copy(modelPos.current)
      }
    }

    if (isAutoScanning && !dragging) {
      if (!isAutoScanningPrev.current) {
        isAutoScanningPrev.current = true
        autoScanProgress.current = 0
        autoScanStartPos.current.copy(modelPos.current)
      }

      autoScanProgress.current = Math.min(autoScanProgress.current + delta / 0.7, 1.2)

      const r = getTapTargetRect()
      let tx = size.width / 2
      let ty = size.height / 2
      if (r) {
        tx = r.left + r.width / 2
        ty = r.top + r.height / 2
      }

      s2w(tx, ty, camera, size.width, size.height, _autoTargetW)

      const desiredModelPos = _autoDesiredPos.copy(_autoTargetW)

      const currentProgress = Math.min(autoScanProgress.current, 1)
      const t = currentProgress < 0.5 
        ? 4 * currentProgress * currentProgress * currentProgress 
        : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2

      modelPos.current.lerpVectors(autoScanStartPos.current, desiredModelPos, t)
      if (g) {
        g.position.copy(modelPos.current)
      }

      const ew = eyeWorldPin.current
      ew.copy(eyeLocal)
      if (g) {
        ew.multiplyScalar(g.scale.x)
        ew.applyQuaternion(g.quaternion)
        ew.add(g.position)
      }
      tailPin = ew

      if (autoScanProgress.current >= 1.0 && !scanTriggered) {
        setScanTriggered(true)
      }
      if (autoScanProgress.current >= 1.2) {
        setIsAutoScanning(false)
        isAutoScanningPrev.current = false
        releaseCooldown.current = 1.0 // 1 second of high-damped elegant slide back
      }
    } else {
      isAutoScanningPrev.current = false

      if (!dragging) {
        if (g && bbDone.current) {
          const tail = rope.tail()
          const off = eyeOffWorld.current
          off.copy(eyeLocal)
          off.multiplyScalar(g.scale.x)
          off.applyQuaternion(g.quaternion)
          modelPos.current.copy(tail).sub(off)
          g.position.copy(modelPos.current)
        } else if (g) {
          const tail = rope.tail()
          modelPos.current.copy(tail)
          g.position.copy(modelPos.current)
        }
      }
    }

    if (dragging && drag.dragPos.current && g && bbDone.current) {
      const offGrab = eyeOffWorld.current
      offGrab.copy(grabAnchorLocal.current)
      offGrab.multiplyScalar(g.scale.x)
      offGrab.applyQuaternion(g.quaternion)
      modelPos.current.copy(drag.dragPos.current).sub(offGrab)
      g.position.copy(modelPos.current)

      const ew = eyeWorldPin.current
      ew.copy(eyeLocal)
      ew.multiplyScalar(g.scale.x)
      ew.applyQuaternion(g.quaternion)
      ew.add(g.position)
      tailPin = ew
    }

    if (g) {
      const angle = rope.tailAngle()
      const targetTilt = THREE.MathUtils.clamp(
        angle,
        -THREE.MathUtils.degToRad(MAX_TILT_DEG),
        THREE.MathUtils.degToRad(MAX_TILT_DEG)
      )
      modelTilt.current = THREE.MathUtils.lerp(modelTilt.current, targetTilt, 0.15)
      g.rotation.z = modelTilt.current
    }

    // Run the rope physics simulation
    if (!isSpawning) {
      let dampingOverride: number | undefined = undefined
      if (time.current < SPAWN_DELAY + 2.0) {
        const progress = (time.current - SPAWN_DELAY) / 2.0
        // Smoothly scale damping back from 0.955 to 0.990 to settle swing gracefully
        dampingOverride = THREE.MathUtils.lerp(0.955, 0.990, progress)
      } else if (releaseCooldown.current > 0) {
        releaseCooldown.current = Math.max(0, releaseCooldown.current - delta)
        const progress = 1 - releaseCooldown.current // 0 to 1
        // Smoothly lerp damping from 0.92 (thick air resistance) to 0.990 (free swing)
        dampingOverride = THREE.MathUtils.lerp(0.92, 0.990, progress)
      }
      rope.simulate(anchor, tailPin, dampingOverride)
    }

    ropeMeshRef.current?.updateStrands(rope.positions(), color, ropeSettings.ropeStroke)

    modelPosition.x = modelPos.current.x

    // Model-center → screen (tap target / PhoneMockup proximity)
    if (g && bbDone.current) {
      const tw = tapPointWorld.current
      tw.copy(modelCenterLocal.current)
      tw.multiplyScalar(g.scale.x)
      tw.applyQuaternion(g.quaternion)
      tw.add(g.position)
      
      const { x, y } = worldToClient(tw, camera, size.width, size.height)
      modelPosition.screenX = x
      modelPosition.screenY = y

      if (!scanTriggered) {
        const inZone = pointInTapTarget(x, y, 28)
        scanFrames.current = inZone ? scanFrames.current + 1 : 0
        if (scanFrames.current >= SCAN_HOLD_FRAMES) {
          scanFrames.current = 0
          setScanTriggered(true)
        }
      }
    }
  })

  return (
    <>
      {/*
        Three-point + hemisphere: defined form without harsh contrast.
        Clover uses receiveSceneShadow=false so shadow maps don’t stripe thin shells; rope still casts.
      */}
      <ambientLight intensity={0.36} color="#f4f6fa" />
      <hemisphereLight args={['#eef2ff', '#2a2d35', 0.48]} />
      {/* Key — warm, front-top-right */}
      <directionalLight
        position={[2.6, 5.2, 3.8]}
        intensity={0.92}
        color="#fff8f2"
        castShadow
        shadow-mapSize-width={IS_MOBILE ? 512 : 2048}
        shadow-mapSize-height={IS_MOBILE ? 512 : 2048}
        shadow-bias={-0.00012}
        shadow-normalBias={0.028}
      />
      {/* Fill — cool, opposite side (opens shadows) */}
      {!IS_MOBILE && <directionalLight position={[-3.2, 2.4, 1.2]} intensity={0.34} color="#d6e4ff" />}
      {/* Rim — edge read against page background */}
      {!IS_MOBILE && <directionalLight position={[-1.2, 3.5, -4]} intensity={0.2} color="#ffffff" />}
      {/* Brand kiss — subtle, near camera side */}
      <pointLight position={[2.2, 0.8, 4.2]} intensity={0.32} color={color} distance={14} decay={2} />

      <RopeMesh ref={ropeMeshRef} />

      <Suspense fallback={null}>
        <CloverModel
          ref={modelRef}
          position={[0, -1.0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={modelSettings.modelScale}
          color={color}
          receiveSceneShadow={false}
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
      shadows={IS_MOBILE ? 'basic' : true}
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5], fov: 50 }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100dvh',
        zIndex: Z_CANVAS,
        background: 'transparent',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = IS_MOBILE ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
        const el = gl.domElement
        el.style.pointerEvents = 'none'
      }}
    >
      <Scene />
    </Canvas>
  )
}

export function CloverOverlayScene() {
  return <CloverOverlayCanvas />
}
