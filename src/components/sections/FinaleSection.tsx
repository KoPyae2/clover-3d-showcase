import { useRef } from 'react'
import { TRUST_POINTS } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'

export function FinaleSection() {
  const { entry, color } = useColorStore()
  const boxRef = useRef<HTMLDivElement>(null)

  return (
    <section id="section-finale" className="page-section finale reveal" aria-label="Closing">
      <div className="finale__clover-box">
        <div ref={boxRef} className="finale__inner">
          <div className="finale__mark" style={{ color }} aria-hidden>
            <svg viewBox="0 0 80 80" className="finale__clover-svg">
              <g transform="translate(40,42)" fill="currentColor">
                {[0, 90, 180, 270].map((deg) => (
                  <ellipse key={deg} cx="0" cy="-14" rx="12" ry="18" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="5" />
              </g>
            </svg>
          </div>
          <h2 className="finale__title">One keychain. Six personalities. Infinite taps.</h2>
          <p className="finale__text">
            Clover NFC Keychain is a compact NFC tag you actually want on your keys — {entry.label.toLowerCase()} is
            only the beginning. Below are sample trust claims; this page is a design study, not a store.
          </p>
          <ul className="finale__chips" aria-label="Feature tags">
            <li className="finale__chip">ISO 14443-A</li>
            <li className="finale__chip">No battery</li>
            <li className="finale__chip">3D-printed</li>
            <li className="finale__chip">WebGL</li>
          </ul>
          <ul className="finale__trust">
            {TRUST_POINTS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="finale__cta-row">
            <button type="button" className="btn btn--primary" disabled title="Dummy — no checkout">
              &#x2618; Join waitlist (demo)
            </button>
            <a className="btn btn--ghost" href="#section-specs">
              &#x21bb; View specs again
            </a>
          </div>
          <p className="finale__fine">
            Keyboard: focus swatches with Tab · Enter to change finish. Drag uses primary pointer; reset NFC
            from the tap section.
          </p>
        </div>
      </div>
    </section>
  )
}
