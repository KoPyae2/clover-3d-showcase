/**
 * High-frequency model position values stored outside React/Zustand
 * to avoid triggering re-renders at 60fps.
 * Consumers read directly; the WebGL scene writes directly.
 */
export const modelPosition = {
  x: 0,
  screenX: 0,
  screenY: 0,
}
