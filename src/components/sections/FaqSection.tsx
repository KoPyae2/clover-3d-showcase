import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FAQ_ITEMS } from '../../data/showcaseContent'

export function FaqSection() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="section-faq"
      className="page-section py-24 md:py-32"
      aria-label="Frequently Asked Questions"
    >
      <div className="container mx-auto pl-6 pr-[20%] max-w-6xl lg:px-6 lg:pr-[20%]">
        <div className="w-full">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 text-left mb-8 md:mb-0"
            >
              <h2 className="text-[0.65rem] sm:text-[0.7rem] font-black uppercase tracking-[0.25em] text-(--clover) mb-6">
                {t('faq.subtitle')}
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-(--ink) leading-[1.1] [text-wrap:balance]">
                {t('faq.title')}
              </h3>

              {/* CTA moved to left column for desktop */}
              <motion.div
                className="hidden lg:block mt-12 text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-[0.9rem] font-medium text-(--ink-muted) mb-6">Still have questions?</p>
                <a
                  href="mailto:support@clover.labs"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-black/[0.05] rounded-full text-[0.85rem] font-bold text-(--ink) hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  Contact Support
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>

            {/* FAQ Items */}
            <div className="lg:col-span-7 space-y-3 md:space-y-4">
              {FAQ_ITEMS.map((_, i) => {
              const isOpen = openIndex === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-[24px] border transition-all duration-500 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-black/[0.08] shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06)]'
                      : 'bg-white/60 backdrop-blur-md border-black/[0.04] hover:bg-white/90 hover:border-black/[0.08] shadow-sm hover:shadow-md'
                  }`}
                >
                  <button
                    className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left cursor-pointer group"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[1rem] md:text-[1.05rem] font-bold text-(--ink) pr-4">
                      {t(`faq.q${i + 1}`)}
                    </span>
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen ? 'bg-(--clover) text-white' : 'bg-black/[0.03] text-(--ink) group-hover:bg-black/[0.06]'
                      }`}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 text-[0.9rem] md:text-[0.95rem] text-(--ink-muted) leading-relaxed">
                          {t(`faq.a${i + 1}`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
            </div>
          </div>

          {/* Mobile CTA */}
          <motion.div
            className="lg:hidden mt-16 md:mt-20 text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-[0.9rem] font-medium text-(--ink-muted) mb-6">Still have questions?</p>
            <a
              href="mailto:support@clover.labs"
              className="inline-flex items-center gap-3 px-7 py-3.5 md:px-8 md:py-4 bg-white border border-black/[0.05] rounded-full text-[0.85rem] font-bold text-(--ink) hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              Contact Support
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
