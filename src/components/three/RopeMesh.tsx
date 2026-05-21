/**
 * RopeMesh — two visual strands driven by one physics polyline.
 * Top and bottom offsets vanish so strands meet at anchor and eyelet.
 */
import { useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

const IS_MOBILE = typeof window !== 'undefined' && Math.min(screen.width, screen.height) < 768
const TUBE_SEGS_R = IS_MOBILE ? 4 : 6
/** Max lateral half-separation between strands (world units), strongest mid-span */
const MAX_SPREAD = 0.013

function darken(hex: string, factor = 0.68): THREE.Color {
  return new THREE.Color(hex).multiplyScalar(factor)
}

/** Per-sample lateral offset: 0 at top & bottom, sine braid mid-span (strand A/B π apart). */
function strandLateralOffsets(n: number, strand: 0 | 1): number[] {
  const phase = strand * Math.PI
  return Array.from({ length: n }, (_, i) => {
    const t = i / Math.max(n - 1, 1)
    const mergeTop = Math.min(1, t / 0.1)
    const mergeBot = t > 0.72 ? 1 - (t - 0.72) / 0.28 : 1
    const envelope = mergeTop * mergeBot
    return Math.sin(Math.PI * t + phase) * MAX_SPREAD * envelope
  })
}

function buildTubeFromPts(
  pts: THREE.Vector3[],
  tubeRadius: number,
  lateralOffsets: number[]
): THREE.TubeGeometry {
  const shifted = pts.map((p, i) => {
    const u = lateralOffsets[i] ?? 0
    return p.clone().add(new THREE.Vector3(u, 0, 0))
  })
  const curve = new THREE.CatmullRomCurve3(shifted, false, 'catmullrom', 0.38)
  const segs = Math.max(pts.length - 1, 1)
  const tubular = IS_MOBILE
    ? Math.max(16, segs * 4)   // ~24 on mobile (vs 108 desktop)
    : Math.max(52, segs * 12)
  const r = Math.max(0.001, tubeRadius)
  return new THREE.TubeGeometry(curve, tubular, r, TUBE_SEGS_R, false)
}

function ptsMatch(a: THREE.Vector3[], b: THREE.Vector3[]) {
  if (a.length !== b.length) return false
  return !a.some((p, i) => !p.equals(b[i]))
}

export interface RopeMeshHandle {
  /** Single physics backbone; two tubes branch visually mid-rope only */
  updateStrands(pts: THREE.Vector3[], color: string, ropeStroke: number): void
}

export const RopeMesh = forwardRef<RopeMeshHandle, object>(function RopeMesh(_props, ref) {
  const mat = useRef(
    new THREE.MeshStandardMaterial({
      roughness: 0.68,
      metalness: 0.22,
      color: new THREE.Color('#6b7280'),
    })
  )

  const meshA = useRef(new THREE.Mesh(new THREE.BufferGeometry(), mat.current))
  const meshB = useRef(new THREE.Mesh(new THREE.BufferGeometry(), mat.current))

  meshA.current.castShadow = !IS_MOBILE
  meshB.current.castShadow = !IS_MOBILE

  const frameCounter = useRef(0)

  const prevPts = useRef<THREE.Vector3[]>([])
  const prevColorHex = useRef<string>('')
  const prevStroke = useRef<number>(-1)

  useImperativeHandle(ref, () => ({
    updateStrands(pts: THREE.Vector3[], color: string, ropeStroke: number) {
      if (pts.length < 2) return

      // On mobile, only rebuild geometry every 2nd frame
      if (IS_MOBILE) {
        frameCounter.current++
        if (frameCounter.current % 2 !== 0) return
      }

      const geomSame =
        ptsMatch(pts, prevPts.current) && prevColorHex.current === color && prevStroke.current === ropeStroke
      if (geomSame) return

      prevPts.current = pts.map((p) => p.clone())
      if (prevColorHex.current !== color) {
        prevColorHex.current = color
        const c = darken(color)
        mat.current.color.copy(c)
      }
      prevStroke.current = ropeStroke

      mat.current.roughness = 0.66
      mat.current.metalness = 0.24

      const offsA = strandLateralOffsets(pts.length, 0)
      const offsB = strandLateralOffsets(pts.length, 1)

      const oldGeoms = [meshA.current.geometry, meshB.current.geometry]
      meshA.current.geometry = buildTubeFromPts(pts, ropeStroke, offsA)
      meshB.current.geometry = buildTubeFromPts(pts, ropeStroke, offsB)
      oldGeoms.forEach((g) => {
        if (g && g !== meshA.current.geometry && g !== meshB.current.geometry) g.dispose()
      })
    },
  }))

  return (
    <>
      <primitive object={meshA.current} />
      <primitive object={meshB.current} />
    </>
  )
})
