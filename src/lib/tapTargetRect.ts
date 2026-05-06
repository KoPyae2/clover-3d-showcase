/** Viewport client rect for the NFC tap target (updated from DOM; read in R3F useFrame). */

export type TapTargetRect = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

let current: TapTargetRect | null = null

export function setTapTargetRect(r: TapTargetRect | null): void {
  current = r
}

export function getTapTargetRect(): TapTargetRect | null {
  return current
}

/** Hit test in client / viewport space with optional padding (px). */
export function pointInTapTarget(
  clientX: number,
  clientY: number,
  pad = 20
): boolean {
  const r = current
  if (!r || r.width < 4 || r.height < 4) return false
  return (
    clientX >= r.left - pad &&
    clientX <= r.right + pad &&
    clientY >= r.top - pad &&
    clientY <= r.bottom + pad
  )
}
