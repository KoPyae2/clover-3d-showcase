/*
 * CloverModel — original GLB geometry (gltfjsx: Curve003 / Curve003_1 / Curve003_2).
 * GLTF materials often ship base/normal/roughness maps that bake in 3D-print “layer lines”.
 * We strip those maps once and tint leaf base colors — rest stays PBR‑like without hatch patterns.
 */

import * as THREE from 'three'
import React, { useRef, useEffect, useLayoutEffect, useMemo, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'

type GLTFResult = ReturnType<typeof useGLTF> & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.Material>
}

const MATERIAL_NAMES = [
  '3DPrint_Green_Leaf.001',
  '3DPrint_White_Frame.001',
  'Material.002',
] as const

/** Remove textures that recreate print-line / hatch appearance in the GLB */
function stripBakedLineMaps(mat: THREE.Material) {
  if (!(mat instanceof THREE.MeshStandardMaterial)) return
  mat.map = null
  mat.normalMap = null
  mat.bumpMap = null
  mat.displacementMap = null
  mat.roughnessMap = null
  mat.metalnessMap = null
  mat.aoMap = null
  mat.emissiveMap = null
  mat.lightMap = null
  mat.alphaMap = null
  mat.envMap = null
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoatMap = null
    mat.clearcoatNormalMap = null
    mat.sheenColorMap = null
    mat.sheenRoughnessMap = null
    mat.transmissionMap = null
    mat.thicknessMap = null
    mat.specularIntensityMap = null
    mat.specularColorMap = null
    mat.iridescenceMap = null
    mat.iridescenceThicknessMap = null
    mat.anisotropyMap = null
  }
  mat.flatShading = false
  mat.needsUpdate = true
}

export interface CloverModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string

  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void
  /** Sample shadow maps on surfaces — off by default so curved shells avoid shadow‑map stripe artifacts. */
  receiveSceneShadow?: boolean
}

const colliderMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.001,
  depthWrite: false,
})

/** Inner offset from Blender export (gltfjsx). */
const INNER_POS: [number, number, number] = [0, 0, 0.001]
const INNER_ROT: [number, number, number] = [0, -0.076, 0]

export const CloverModel = forwardRef<THREE.Group, CloverModelProps>(function CloverModel(
  {
    position = [0, 0, 0],
    rotation = [Math.PI / 2, 0, 0],
    scale = 2.4,
    color = '#4caf82',
    onPointerDown,
    receiveSceneShadow = false,
  },
  ref
) {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/clover.glb') as GLTFResult
  const [eyePos, setEyePos] = React.useState<[number, number, number]>([0, 0.1, 0])
  const [colliderCenter, setColliderCenter] = React.useState<[number, number, number]>([0, 0, 0])
  const [colliderRadius, setColliderRadius] = React.useState(0.15)

  const torusGeo = useMemo(() => new THREE.TorusGeometry(0.018, 0.0042, 12, 40), [])
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), [])

  const setRef = (node: THREE.Group | null) => {
    ;(groupRef as React.MutableRefObject<THREE.Group | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<THREE.Group | null>).current = node
  }

  useLayoutEffect(() => {
    for (const name of MATERIAL_NAMES) {
      const m = materials[name]
      if (m) stripBakedLineMaps(m)
    }

    // Static PBR configuration for leaf and frame materials
    const leafNames = ['3DPrint_Green_Leaf.001', 'Material.002'] as const
    for (const name of leafNames) {
      const mat = materials[name]
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.roughness = 1
        mat.metalness = 0
        mat.envMapIntensity = 0
        mat.needsUpdate = true
      }
    }
    const frame = materials['3DPrint_White_Frame.001']
    if (frame instanceof THREE.MeshStandardMaterial) {
      frame.roughness = 0.45
      frame.metalness = 0.05
      frame.envMapIntensity = 0
      frame.needsUpdate = true
    }
  }, [materials])

  const targetColorRef = useRef(new THREE.Color(color))
  const initialColorAppliedRef = useRef(false)
  const scaleBounceRef = useRef(1.0)

  const shakeAngleRef = useRef(0)
  const shakeVelocityRef = useRef(0)
  const shakeGroupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    targetColorRef.current.set(color)
    if (!initialColorAppliedRef.current) {
      const leafNames = ['3DPrint_Green_Leaf.001', 'Material.002'] as const
      for (const name of leafNames) {
        const mat = materials[name]
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color.set(color)
        }
      }
      initialColorAppliedRef.current = true
    } else {
      // Trigger a subtle, elegant scale pop on color change
      scaleBounceRef.current = 1.06
      // Trigger a subtle high-frequency rotational shake — ±2.2 rad/s gives ~9° max with k=220
      shakeVelocityRef.current = Math.random() > 0.5 ? 2.2 : -2.2
    }
  }, [color, materials])

  const scaleArr: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale

  useLayoutEffect(() => {
    const g = groupRef.current
    if (!g) return
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
    setEyePos([topW.x, topW.y, topW.z])

    const size = new THREE.Vector3()
    box.getSize(size)
    const s = typeof scale === 'number' ? scale : Math.max(scale[0], scale[1], scale[2])
    const r = (Math.max(size.x, size.y, size.z) * 1.15) / (2 * Math.max(s, 0.001))
    const centerLocal = c.clone()
    g.worldToLocal(centerLocal)
    setColliderCenter([centerLocal.x, centerLocal.y, centerLocal.z])
    setColliderRadius(r)
  }, [nodes, scale])

  useFrame((_state, delta) => {
    const g = groupRef.current
    if (!g) return

    // Cap delta to avoid huge jumps after tab-switching
    const dt = Math.min(delta, 0.06)

    // Smoothly decay scale bounce back to 1.0
    scaleBounceRef.current = THREE.MathUtils.lerp(scaleBounceRef.current, 1.0, 0.12)
    const s = typeof scale === 'number' ? scale : scale[0]
    g.scale.set(s * scaleBounceRef.current, s * scaleBounceRef.current, s * scaleBounceRef.current)

    // Lock x/y axes — z rotation is owned by CloverOverlayScene (rope tilt), don't override it here
    g.rotation.x = Array.isArray(rotation) ? rotation[0] : Math.PI / 2
    g.rotation.y = Array.isArray(rotation) ? rotation[1] : 0

    // ── Inner shake group spring-damper ──────────────────────────────────
    // k=220 (stiff/snappy), d=14 (slightly underdamped), settles in ~0.3s
    const k = 220
    const d = 14
    const force = -k * shakeAngleRef.current - d * shakeVelocityRef.current
    shakeVelocityRef.current += force * dt
    shakeAngleRef.current  += shakeVelocityRef.current * dt
    if (shakeGroupRef.current) {
      shakeGroupRef.current.rotation.z = shakeAngleRef.current
    }

    // Smoothly animate leaf material color changes
    const leafNames = ['3DPrint_Green_Leaf.001', 'Material.002'] as const
    for (const name of leafNames) {
      const mat = materials[name]
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.color.lerp(targetColorRef.current, 0.08)
      }
    }
  })

  return (
    <group
      ref={setRef}
      position={position}
      rotation={rotation as [number, number, number]}
      scale={scaleArr}
      dispose={null}
    >
      <group position={INNER_POS} rotation={INNER_ROT}>
        {/* shakeGroupRef receives the spring-damper jiggle on color change */}
        <group ref={shakeGroupRef}>
          {nodes.Curve003 && (
            <mesh
              geometry={nodes.Curve003.geometry}
              material={materials['3DPrint_Green_Leaf.001']}
              castShadow
              receiveShadow={receiveSceneShadow}
              onPointerDown={onPointerDown}
            />
          )}
          {nodes.Curve003_1 && (
            <mesh
              geometry={nodes.Curve003_1.geometry}
              material={materials['3DPrint_White_Frame.001']}
              castShadow
              receiveShadow={receiveSceneShadow}
              onPointerDown={onPointerDown}
            />
          )}
          {nodes.Curve003_2 && (
            <mesh
              geometry={nodes.Curve003_2.geometry}
              material={materials['Material.002']}
              castShadow
              receiveShadow={receiveSceneShadow}
              onPointerDown={onPointerDown}
            />
          )}
        </group>
      </group>

      <mesh
        position={eyePos}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={torusGeo}
        material={colliderMat}
        userData={{ skipBBox: true }}
        castShadow={false}
        receiveShadow={false}
      />
      <mesh
        position={colliderCenter}
        scale={colliderRadius}
        geometry={sphereGeo}
        material={colliderMat}
        userData={{ skipBBox: true }}
        castShadow={false}
        receiveShadow={false}
      />
    </group>
  )
})

useGLTF.preload('/clover.glb')