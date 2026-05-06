import { FAQ_ITEMS } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

export function FaqSection() {
  const color = useColorStore((s) => s.entry.hex)

  return (
    <section id="section-faq" className="page-section faq reveal" aria-labelledby="faq-heading">
      <CloverDecor className="clover-bg-leaf" style={{ top: '5%', left: '3%', width: '130px', height: '130px', color: '#22c55e' }} />
      <CloverDecor className="clover-bg-leaf" style={{ bottom: '10%', right: '5%', width: '170px', height: '170px', color: '#22c55e' }} />
      <div className="faq__inner">
        <p className="faq__eyebrow" style={{ color }}>
          &#x2618; Questions
        </p>
        <h2 id="faq-heading" className="faq__title">
          Everything you might ask before the first tap.
        </h2>
        <div className="faq__list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="faq__item">
              <summary className="faq__q">{item.q}</summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
