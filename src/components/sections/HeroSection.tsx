import { ColorSwatches } from './ColorSwatches'
import { HERO_STATS, PRODUCT } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'

function CloverLeaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <g transform="translate(40,42)" fill="currentColor">
        {[0, 90, 180, 270].map((deg) => (
          <ellipse key={deg} cx="0" cy="-14" rx="11" ry="16" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="4" />
      </g>
    </svg>
  )
}

export function HeroSection() {
  const { modelX, color, entry } = useColorStore()
  const shift = -modelX * 10

  return (
    <section id="section-hero" className="page-section hero reveal" aria-label="Hero">
      <CloverLeaf className="clover-bg-leaf" style={{ top: '8%', right: '5%', width: '320px', height: '320px', color }} />
      <CloverLeaf className="clover-bg-leaf" style={{ bottom: '15%', left: '-3%', width: '200px', height: '200px', color, transform: 'rotate(45deg)' }} />

      <div className="hero__inner">
        <div className="hero__copy" style={{ transform: `translateX(${shift}px)` }}>
          <p className="hero__eyebrow" style={{ color }}>
            {PRODUCT.name} · {entry.label}
          </p>
          <h1 className="hero__title">
            Luck you can
            <span className="hero__title-accent">
              {' '}wear &amp; tap
            </span>
          </h1>
          <p className="hero__tagline">{entry.tagline}</p>
          <p className="hero__lead">
            3D-printed leaf, polished white rim, and passive NFC — wake shortcuts on phones and
            accessories with a tap. Drag the keychain in 3D, pick a finish, then scroll for story,
            specs, and the interactive phone demo.
          </p>

          <ul className="hero__stats" aria-label="Product highlights">
            {HERO_STATS.map((s) => (
              <li key={s.k} className="hero__stat">
                <span className="hero__stat-k">{s.k}</span>
                <span className="hero__stat-v">{s.v}</span>
              </li>
            ))}
          </ul>

          <div className="hero__panel">
            <div className="hero__panel-head">
              <p className="hero__swatches-label">&#x2618; Finish · live preview</p>
              <span className="hero__sku" title="Dummy SKU">
                {entry.sku}
              </span>
            </div>
            <ColorSwatches />
          </div>

          <p className="hero__hint" aria-hidden>
            Scroll to explore · Drag the Clover to move it
          </p>
        </div>
      </div>
    </section>
  )
}
