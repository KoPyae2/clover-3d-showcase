/*
 * CloverModel — loads public/clover.glb (gltfjsx: Curve003 / Curve003_1 / Curve003_2)
 * Curve003 → leaf (3DPrint_Green_Leaf.001), tinted by `color`
 * Curve003_1 → frame (3DPrint_White_Frame.001), fixed white
 * Curve003_2 → leaf (Material.002), tinted by `color`
 * Invisible eyelet torus (skipBBox) improves grab hit near the ring.
 */

import * as THREE from 'three'
import React, { useRef, useEffect, useLayoutEffect, useMemo, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'

type GLTFResult = ReturnType<typeof useGLTF> & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.Material>
}

export interface CloverModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  swingVelocity?: number
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void
  windSwayX?: number
  windSwayY?: number
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
    swingVelocity = 0,
    onPointerDown,
    windSwayX = 0,
    windSwayY = 0,
  },
  ref
) {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/clover.glb') as GLTFResult
  const [eyePos, setEyePos] = React.useState<[number, number, number]>([0, 0.1, 0])
  const windTime = useRef(0)

  const torusGeo = useMemo(() => new THREE.TorusGeometry(0.018, 0.0042, 12, 40), [])

  const setRef = (node: THREE.Group | null) => {
    ;(groupRef as React.MutableRefObject<THREE.Group | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<THREE.Group | null>).current = node
  }

  const leafMaterialNames = useMemo(
    () => ['3DPrint_Green_Leaf.001', 'Material.002'] as const,
    []
  )

  useEffect(() => {
    leafMaterialNames.forEach((name) => {
      const mat = materials[name]
      if (mat && 'color' in mat) {
        ;(mat as THREE.MeshStandardMaterial).color.set(color)
      }
    })
    const frameMat = materials['3DPrint_White_Frame.001']
    if (frameMat && 'color' in frameMat) {
      ;(frameMat as THREE.MeshStandardMaterial).color.set('#ffffff')
    }
  }, [color, materials, leafMaterialNames])

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
  }, [nodes, scale])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const targetZ = (Array.isArray(rotation) ? rotation[2] : 0) + swingVelocity * 0.15
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetZ, 0.08)

    windTime.current += 0.016
    const swayX = Math.sin(windTime.current * 0.4) * windSwayX
    const swayY = Math.cos(windTime.current * 0.3) * windSwayY
    g.rotation.x = (Array.isArray(rotation) ? rotation[0] : Math.PI / 2) + swayX
    g.rotation.y = (Array.isArray(rotation) ? rotation[1] : 0) + swayY
  })

  const n0 = nodes.Curve003
  const n1 = nodes.Curve003_1
  const n2 = nodes.Curve003_2

  return (
    <group
      ref={setRef}
      position={position}
      rotation={rotation as [number, number, number]}
      scale={scaleArr}
      dispose={null}
    >
      <group position={INNER_POS} rotation={INNER_ROT}>
        {n0 && (
          <mesh
            geometry={n0.geometry}
            material={materials['3DPrint_Green_Leaf.001']}
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
          />
        )}
        {n1 && (
          <mesh
            geometry={n1.geometry}
            material={materials['3DPrint_White_Frame.001']}
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
          />
        )}
        {n2 && (
          <mesh
            geometry={n2.geometry}
            material={materials['Material.002']}
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
          />
        )}
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
    </group>
  )
})

useGLTF.preload('/clover.glb')
