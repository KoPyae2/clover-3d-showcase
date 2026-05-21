/**
 * RopeMesh — two visual strands driven by one physics polyline.
 * Top and bottom offsets vanish so strands meet at anchor and eyelet.
 */
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import * as THREE from 'three'
// Import line classes for a lightweight rope band
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

// Detect mobile devices to reduce update frequency
const IS_MOBILE = typeof window !== 'undefined' && Math.min(screen.width, screen.height) < 768

/** Helper to darken a hex color for the rope material */
function darken(hex: string, factor = 0.68): THREE.Color {
  return new THREE.Color(hex).multiplyScalar(factor)
}

export interface RopeMeshHandle {
  /** Update rope geometry based on physics points */
  updateStrands(pts: THREE.Vector3[], color: string, ropeStroke: number): void
}

export const RopeMesh = forwardRef<RopeMeshHandle, object>(function RopeMesh(_props, ref) {
  // Line material – color and width are updated per frame
  const lineMaterial = useRef(
    new LineMaterial({
      color: new THREE.Color('#6b7280'),
      linewidth: 5, // default pixel width; will be adjusted dynamically
      // resolution must be set for correct screen‑space width handling
    })
  )

  // Geometry for the line – we reuse the same instance and update its positions
  const lineGeometry = useRef(new LineGeometry())
  // The Line2 object that combines geometry + material
  const line = useRef(new Line2(lineGeometry.current, lineMaterial.current))

  // Ensure the material knows the canvas resolution (required by LineMaterial)
  useEffect(() => {
    const setResolution = () => {
      lineMaterial.current.resolution.set(window.innerWidth, window.innerHeight)
    }
    setResolution()
    window.addEventListener('resize', setResolution)
    return () => window.removeEventListener('resize', setResolution)
  }, [])

  // Mobile: limit geometry rebuilds to every other frame to save work
  const frameCounter = useRef(0)
  // Cache last parameters to avoid redundant updates
  const prevPts = useRef<THREE.Vector3[]>([])
  const prevColor = useRef<string>('')
  const prevStroke = useRef<number>(-1)

  useImperativeHandle(ref, () => ({
    updateStrands(pts: THREE.Vector3[], color: string, ropeStroke: number) {
      if (pts.length < 2) return

      if (IS_MOBILE) {
        frameCounter.current++
        if (frameCounter.current % 2 !== 0) return // skip this frame on mobile
      }

      // Quick equality check – if nothing changed we can skip
      const same =
        pts.length === prevPts.current.length &&
        pts.every((p, i) => p.equals(prevPts.current[i])) &&
        prevColor.current === color &&
        prevStroke.current === ropeStroke

      if (same) return

      // Update caches
      prevPts.current = pts.map((p) => p.clone())
      prevColor.current = color
      prevStroke.current = ropeStroke

      // Update line material color (darkened for visual consistency)
      lineMaterial.current.color.copy(darken(color))
      // Convert ropeStroke (world units) to a reasonable pixel width
      const pixelWidth = Math.max(1, ropeStroke * 800) // scaling factor tuned for visibility
      lineMaterial.current.linewidth = pixelWidth

      // Build flat Float32Array of point positions (x, y, z for each point)
      const positions = new Float32Array(pts.length * 3)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        positions[3 * i] = p.x
        positions[3 * i + 1] = p.y
        positions[3 * i + 2] = p.z
      }
      // Update geometry – setPositions replaces the attribute data
      lineGeometry.current.setPositions(positions)
    },
  }))

  // Render the line primitive. The <primitive> wrapper lets React Three Fiber handle the object.
  return <primitive object={line.current} />
})
