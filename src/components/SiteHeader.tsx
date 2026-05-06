import { useColorStore } from '../store/useColorStore'

const NAV = [
  { label: 'Overview', id: 'section-hero' },
  { label: 'Story', id: 'section-story' },
  { label: 'Specs', id: 'section-specs' },
  { label: 'Tap demo', id: 'section-tap' },
  { label: 'FAQ', id: 'section-faq' },
] as const

export function SiteHeader() {
  const entry = useColorStore((s) => s.entry)

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#section-hero">
          <span className="site-header__mark" style={{ background: entry.hex }} aria-hidden />
          <span className="site-header__brand-text">
            <span className="site-header__wordmark">☘ Clover</span>
            <span className="site-header__sub">NFC keychain</span>
          </span>
        </a>

        <nav className="site-header__nav" aria-label="Page">
          {NAV.map((item) => (
            <a key={item.id} className="site-header__link" href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__finish" title="Active finish (updates 3D preview)">
          <span className="site-header__finish-dot" style={{ background: entry.hex }} />
          <span className="site-header__finish-label">{entry.label}</span>
        </div>
      </div>
    </header>
  )
}
