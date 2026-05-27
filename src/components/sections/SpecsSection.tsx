import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GLOBAL_SPECS } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'

export function SpecsSection() {
  const { t } = useTranslation()
  const { color } = useColorStore()

  return (
    <section
      id="section-specs"
      className="page-section py-24 md:py-32"
      aria-label="Specifications"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="px-6 lg:pr-[20%]">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 md:mb-16"
          >
            <h2 className="text-[0.65rem] sm:text-[0.7rem] font-black uppercase tracking-[0.25em] text-(--clover) mb-6">
              {t('specs.subtitle')}
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-(--ink) leading-[1.05] [text-wrap:balance]">
              {t('specs.titleLine1')}{' '}
              {t('specs.titleLine2')}
            </h3>
          </motion.div>

          {/* Spec Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0">
            {GLOBAL_SPECS.map((spec, i) => {
              const specKeys = ['manufacturing', 'nfc_ic', 'wireless', 'read_range', 'dimensions', 'cord', 'weight', 'ingress', 'warranty', 'certifications'] as const
              const key = specKeys[i]
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`group py-5 border-b border-black/[0.05] transition-all duration-300 hover:bg-black/[0.01] ${
                    isEven ? 'md:pr-12 md:border-r md:border-black/[0.05]' : 'md:pl-12'
                  }`}
                >
                  {/* Mobile layout */}
                  <div className="flex flex-col gap-1 md:hidden">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-(--ink-muted) group-hover:text-(--clover) transition-colors duration-200">
                      {t(`specs.labels.${key}`)}
                    </span>
                    <span className="text-[0.88rem] font-bold text-(--ink) group-hover:translate-x-1 transition-transform duration-300 inline-block tabular-nums">
                      {t(`specs.values.${key}`)}
                    </span>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0"
                        style={{ backgroundColor: color }} />
                      <span className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink-muted) group-hover:text-(--ink) transition-colors duration-200">
                        {t(`specs.labels.${key}`)}
                      </span>
                    </div>
                    <span className="text-[0.95rem] font-bold text-(--ink) text-right ml-4 group-hover:text-(--clover) transition-colors duration-200 tabular-nums">
                      {t(`specs.values.${key}`)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Durability Standard Card */}
          <motion.div
            className="mt-16 md:mt-20 p-5 md:p-8 rounded-[24px] bg-white border border-black/[0.04] shadow-sm flex items-start md:items-center gap-5 md:gap-6 group hover:shadow-md hover:border-black/[0.08] transition-all duration-300"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.03] flex items-center justify-center text-(--clover) shrink-0 group-hover:scale-105 transition-transform duration-300"
              style={{ borderColor: `${color}20` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </motion.div>
            <div>
              <h4 className="text-[0.95rem] font-black text-(--ink) mb-1">{t('specs.standardTitle')}</h4>
              <p className="text-[0.8rem] font-medium text-(--ink-muted)">{t('specs.standardText')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
