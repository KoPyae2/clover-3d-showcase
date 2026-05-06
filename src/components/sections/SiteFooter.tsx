import { FOOTER_LINKS, PRODUCT } from '../../data/showcaseContent'

export function SiteFooter() {
  return (
    <footer className="site-footer reveal" aria-label="Site footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">&#x2618; {PRODUCT.name}</p>
          <p className="site-footer__fine">
            Interactive 3D showcase · {PRODUCT.edition}. No storefront — dummy data only.
          </p>
        </div>
        <ul className="site-footer__links">
          {FOOTER_LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <p className="site-footer__copy">&#169; {new Date().getFullYear()} Clover Labs (fictional) · React &amp; Three.js</p>
    </footer>
  )
}
