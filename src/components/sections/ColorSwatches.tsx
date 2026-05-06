import { useId } from 'react'
import { COLOR_PALETTE, useColorStore } from '../../store/useColorStore'

export function ColorSwatches() {
  const { activeId, setColor } = useColorStore()
  const gid = useId()

  return (
    <div className="color-swatches" role="group" aria-labelledby={`${gid}-label`}>
      <span id={`${gid}-label`} className="sr-only">
        Choose a finish for your Clover — updates the 3D model and story
      </span>
      {COLOR_PALETTE.map((c) => {
        const active = c.id === activeId
        return (
          <button
            key={c.id}
            type="button"
            className={`color-swatches__btn${active ? ' color-swatches__btn--active' : ''}`}
            aria-pressed={active}
            aria-label={`${c.label} finish`}
            title={c.label}
            onClick={() => setColor(c.id)}
          >
            <span className="color-swatches__dot" style={{ background: c.hex }} />
            <span className="color-swatches__name">{c.label.split(' ')[0]}</span>
          </button>
        )
      })}
    </div>
  )
}
