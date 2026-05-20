import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GLOBAL_SPECS } from '../../data/showcaseContent'

export function SpecsSection() {
  const { t } = useTranslation()

  return (
    <section
      id="section-specs"
      className="page-section py-32"
      aria-label="Specifications"
    >
      <div className="container mx-auto max-w-6xl">
        {/*
          Mobile layout: left column takes ~60% width, right 40% is empty
          space reserved for the hanging 3D model.
          On lg+ screens the existing lg:pr-[20%] approach is used.
        */}
        <div className="px-6 lg:pr-[20%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 pr-[38%] sm:pr-[30%] lg:pr-0"
          >
            <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-(--clover) mb-6">{t('specs.subtitle')}</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-(--ink) leading-[1.05]">{t('specs.titleLine1')} <br />{t('specs.titleLine2')}</h3>
          </motion.div>

          {/* Spec rows */}
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
                  transition={{ delay: i * 0.05 }}
                  className={`group py-5 border-b border-black/[0.05] ${
                    isEven ? 'md:pr-12 md:border-r md:border-black/[0.05]' : 'md:pl-12'
                  }`}
                >
                  {/* Mobile: label on top, value below — avoids clipping under model */}
                  <div className="flex flex-col gap-1 md:hidden pr-[38%] sm:pr-[30%]">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-(--ink-muted) group-hover:text-(--clover) transition-colors">
                      {t(`specs.labels.${key}`)}
                    </span>
                    <span className="text-[0.88rem] font-bold text-(--ink)">
                      {t(`specs.values.${key}`)}
                    </span>
                  </div>

                  {/* Desktop: label left, value right — original layout */}
                  <div className="hidden md:flex items-baseline justify-between">
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink-muted) group-hover:text-(--clover) transition-colors">
                      {t(`specs.labels.${key}`)}
                    </span>
                    <span className="text-[0.95rem] font-bold text-(--ink) text-right ml-4">
                      {t(`specs.values.${key}`)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Durability Standard card — on mobile reserve right space too */}
          <motion.div
            className="mt-20 p-6 md:p-8 rounded-[24px] bg-white border border-black/[0.04] shadow-sm flex items-center gap-6 mr-[38%] sm:mr-[30%] md:mr-0"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.03] flex items-center justify-center text-(--clover) shrink-0">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
               </svg>
            </div>
            <div>
               <h4 className="text-[0.95rem] font-black text-(--ink)">{t('specs.standardTitle')}</h4>
               <p className="text-[0.8rem] font-medium text-(--ink-muted)">{t('specs.standardText')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
