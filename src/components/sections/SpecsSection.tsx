import { GLOBAL_SPECS, PRODUCT, TRUST_POINTS } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

export function SpecsSection() {
  const { entry, color } = useColorStore()

  return (
    <section id="section-specs" className="page-section specs reveal" aria-labelledby="specs-heading">
      <CloverDecor className="clover-bg-leaf" style={{ top: '8%', right: '5%', width: '160px', height: '160px', color: '#22c55e' }} />
      <CloverDecor className="clover-bg-leaf" style={{ bottom: '15%', left: '2%', width: '140px', height: '140px', color: '#22c55e' }} />
      <div className="specs__head">
        <p className="specs__eyebrow" style={{ color }}>
          &#x2618; Technical sheet
        </p>
        <h2 id="specs-heading" className="specs__title">
          Engineered for taps, not for landfill.
        </h2>
        <p className="specs__lead">
          {PRODUCT.name} · {PRODUCT.edition}. Below is <strong>illustrative dummy data</strong> for this
          showcase — not a compliance sheet.
        </p>
      </div>

      <div className="specs__grid">
        <div className="specs__card specs__card--hero">
          <p className="specs__sku">SKU · {entry.sku}</p>
          <p className="specs__price">{PRODUCT.msrp}</p>
          <p className="specs__price-note">{PRODUCT.msrpNote}</p>
          <p className="specs__stock">{PRODUCT.inStock}</p>
          <div className="specs__rating" aria-label={`Rated ${PRODUCT.rating} of 5, dummy`}>
            <span className="specs__stars" aria-hidden>
              {'&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;'}
            </span>
            <span>
              {PRODUCT.rating} <span className="specs__muted">/ 5 · {PRODUCT.reviewCount} reviews (demo)</span>
            </span>
          </div>
          <p className="specs__badge">{PRODUCT.badge}</p>
        </div>

        <ul className="specs__list">
          {GLOBAL_SPECS.map((row) => (
            <li key={row.label} className="specs__row">
              <span className="specs__k">{row.label}</span>
              <span className="specs__v">{row.value}</span>
            </li>
          ))}
        </ul>

        <ul className="specs__trust">
          {TRUST_POINTS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
