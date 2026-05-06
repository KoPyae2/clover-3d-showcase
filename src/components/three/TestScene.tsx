import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CloverModel } from './CloverModel'

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  )
}

export function TestScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#2a2a2a',
      }}
    >
      {/* Loading overlay label */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#888',
          fontFamily: 'monospace',
          fontSize: '13px',
          letterSpacing: '0.08em',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        TestScene — OrbitControls active · clover.glb
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#a0c8ff" />

        {/* Model */}
        <Suspense
          fallback={
            <group>
              <LoadingFallback />
            </group>
          }
        >
          <CloverModel
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={2.4}
            color="#4caf82"
            swingVelocity={0}
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
        />

        {/* Grid helper for orientation reference */}
        <gridHelper args={[10, 10, '#444', '#333']} />
      </Canvas>
    </div>
  )
}
