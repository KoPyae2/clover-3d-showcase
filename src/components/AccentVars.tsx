import { useEffect } from 'react'
import { useColorStore } from '../store/useColorStore'

export function AccentVars() {
  const entry = useColorStore((s) => s.entry)

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--accent', entry.hex)
    r.style.setProperty('--accent-glow', entry.glow)
  }, [entry.hex, entry.glow])

  return null
}
