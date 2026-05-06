import React from 'react'

export function CloverDecor({ className, style, color }: { className?: string; style?: React.CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <g transform="translate(40,42)" fill={color || "currentColor"}>
        {[0, 90, 180, 270].map((deg) => (
          <ellipse key={deg} cx="0" cy="-14" rx="11" ry="16" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="4" />
      </g>
    </svg>
  )
}

export function FloatingClovers() {
  return (
    <div className="floating-clovers" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="floating-clover">
          <svg width="30" height="30" viewBox="0 0 80 80">
            <g transform="translate(40,42)" fill="#22c55e">
              {[0, 90, 180, 270].map((deg) => (
                <ellipse key={deg} cx="0" cy="-14" rx="11" ry="16" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="4" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  )
}
