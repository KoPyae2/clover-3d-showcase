import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useColorStore } from '../../store/useColorStore'
import { PhoneMockup } from '../PhoneMockup'

const stepAnim = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function TapMockupSection() {
  const { t } = useTranslation()
  const { scanTriggered, resetScan, color, isAutoScanning, setIsAutoScanning } = useColorStore()

  return (
    <section
      id="section-tap"
      className="page-section py-24 md:py-32 overflow-hidden"
      aria-label="Interactive Demo"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-16 items-center">

          {/* Left: Phone Mockup */}
          <div className="relative flex items-center justify-center min-h-[520px] md:min-h-[600px] order-2 lg:order-1 lg:col-span-4 lg:col-start-1">
            {/* Decorative background glow */}
            <motion.div
              className="absolute w-[380px] h-[380px] md:w-[400px] md:h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none hidden md:block"
              animate={{
                scale: scanTriggered ? 1.2 : 1,
                opacity: scanTriggered ? 0.35 : 0.15,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: color }}
            />

            <div className="relative z-10 w-60 mx-auto flex flex-col items-center">
              <PhoneMockup />

              {/* Scan Button + Hint */}
              <AnimatePresence>
                {!scanTriggered && (
                  <motion.div
                    className="mt-6 flex flex-col items-center gap-2 w-full text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setIsAutoScanning(true)}
                      disabled={isAutoScanning}
                      className="px-4 py-2 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-sm text-[0.68rem] font-black uppercase tracking-widest text-(--ink-muted) hover:text-black hover:border-black/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: isAutoScanning ? color : '#10b981' }}
                      />
                      {isAutoScanning ? t('tapDemo.scanning') : t('tapDemo.tapToScan')}
                    </button>
                    <p className="text-[0.58rem] font-bold text-(--ink-muted)/60 uppercase tracking-widest pointer-events-none mt-1 whitespace-nowrap">
                      {t('tapDemo.hint')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Content */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-5 lg:col-start-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={{ hidden: {}, visible: {} }}>
              <motion.h2
                variants={stepAnim}
                custom={0}
                className="text-[0.65rem] sm:text-[0.7rem] font-black uppercase tracking-[0.25em] text-(--clover) mb-6"
              >
                {t('tapDemo.subtitle')}
              </motion.h2>

              <motion.h3
                variants={stepAnim}
                custom={0}
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-(--ink) mb-8"
              >
                {t('tapDemo.titleLine1')}{' '}
                {t('tapDemo.titleLine2')}
              </motion.h3>

              <motion.p
                variants={stepAnim}
                custom={1}
                className="text-base sm:text-lg text-(--ink-muted) leading-relaxed mb-10 max-w-lg"
              >
                {t('tapDemo.description')}
              </motion.p>

              <div className="space-y-6 md:space-y-8">
                {[0, 1, 2].map((idx) => (
                  <motion.div key={idx} className="flex gap-5 md:gap-6" variants={stepAnim} custom={2 + idx}>
                    <div
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-black/[0.03] font-black text-sm transition-all duration-300 hover:scale-105"
                      style={{ color: 'var(--clover)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="text-[0.95rem] font-black text-(--ink) mb-1">
                        {t(`tapDemo.steps.step${idx + 1}Title`)}
                      </h4>
                      <p className="text-[0.82rem] text-(--ink-muted) leading-relaxed">
                        {t(`tapDemo.steps.step${idx + 1}Desc`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reset Button */}
              <motion.div variants={stepAnim} custom={5} className="mt-10 md:mt-12">
                <button
                  onClick={resetScan}
                  className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink-muted) hover:text-(--ink) transition-colors flex items-center gap-2 group active:scale-95"
                >
                  <motion.svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    className="group-hover:rotate-180 transition-transform duration-500"
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </motion.svg>
                  {t('tapDemo.reset')}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
