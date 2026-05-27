import { useTranslation } from 'react-i18next'
import { FOOTER_LINKS } from '../data/showcaseContent'
import { CloverDecor } from './CloverDecor'

export function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="relative mt-20 border-t border-black/[0.05] bg-white/50 backdrop-blur-sm" aria-label="Site footer">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <CloverDecor className="w-8 h-8" color="var(--clover)" />
              <span className="text-xl font-black tracking-tight text-(--ink)">Clover</span>
            </div>
            <p className="text-[0.95rem] text-(--ink-muted) leading-relaxed max-w-sm mb-8">
              {t('footer.description')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink) mb-6">{t('footer.product')}</h4>
            <ul className="space-y-4">
              <li><a href="#section-hero" className="text-[0.85rem] text-(--ink-muted) hover:text-(--clover) transition-colors font-medium">{t('nav.overview')}</a></li>
              <li><a href="#section-story" className="text-[0.85rem] text-(--ink-muted) hover:text-(--clover) transition-colors font-medium">{t('nav.story')}</a></li>
              <li><a href="#section-specs" className="text-[0.85rem] text-(--ink-muted) hover:text-(--clover) transition-colors font-medium">{t('nav.specs')}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink) mb-6">{t('footer.resources')}</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.map((l, i) => {
                const keys = ['privacy', 'terms', 'support'] as const;
                return (
                  <li key={l.label}>
                    <a href={l.href} className="text-[0.85rem] text-(--ink-muted) hover:text-(--clover) transition-colors font-medium">
                      {t(`footer.${keys[i]}`)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-black/[0.05] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[0.8rem] text-(--ink-muted) font-medium">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[0.7rem] font-bold text-(--ink-muted) px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.03]">
              {t('product.edition')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-(--clover) via-(--clover-mid) to-emerald-400" />
    </footer>
  )
}
