import { COLOR_PALETTE } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.4
}

export function StorySection() {
  return (
    <section id="section-story" className="page-section story reveal" aria-labelledby="story-heading">
      <CloverDecor className="clover-bg-leaf" style={{ top: '5%', left: '2%', width: '180px', height: '180px', color: '#22c55e' }} />
      <CloverDecor className="clover-bg-leaf" style={{ bottom: '10%', right: '3%', width: '150px', height: '150px', color: '#22c55e' }} />
      <div className="story__header">
        <p className="story__eyebrow">
          &#x2618; Every finish tells a story
        </p>
        <h2 id="story-heading" className="story__title">
          Choose your personality
        </h2>
        <p className="story__lead">
          Six unique finishes, six distinct vibes. Pick the one that matches your style — the 3D keychain above updates live.
        </p>
      </div>

      <div className="story__grid">
        {COLOR_PALETTE.map((entry) => (
          <div
            key={entry.id}
            className={`story__card${isDarkColor(entry.hex) ? ' story__card--dark' : ''}`}
          >
            <div
              className="story__card-rail"
              style={{ background: `linear-gradient(180deg, ${entry.hex}, transparent)` }}
              aria-hidden
            />
            <div className="story__card-content">
              <span
                className="story__card-dot"
                style={{ background: entry.hex }}
                aria-hidden
              />
              <h3 className="story__card-title" style={{ color: entry.hex }}>
                {entry.story.title}
              </h3>
              <p className="story__card-body">{entry.story.body}</p>

              <ul className="story__highlights">
                {entry.highlights.map((line) => (
                  <li key={line} className="story__highlight">
                    <span className="story__bullet" style={{ background: entry.hex }} aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
