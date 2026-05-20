import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useColorStore } from '../../store/useColorStore'
import { PhoneMockup } from '../PhoneMockup'

export function TapMockupSection() {
  const { t } = useTranslation()
  const { scanTriggered, resetScan, color, isAutoScanning, setIsAutoScanning } = useColorStore()

  return (
    <section
      id="section-tap"
      className="page-section py-32 overflow-hidden"
      aria-label="Interactive Demo"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-4 lg:col-start-5 pr-[20%] lg:pr-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-(--clover) mb-6">{t('tapDemo.subtitle')}</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-(--ink) mb-8">{t('tapDemo.titleLine1')} <br />{t('tapDemo.titleLine2')}</h3>
            
            <p className="text-lg text-(--ink-muted) leading-relaxed mb-10 max-w-lg">
              {t('tapDemo.description')}
            </p>

            <div className="space-y-8">
               <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-(--clover) shrink-0 border border-black/[0.03] font-black text-sm">
                     01
                  </div>
                  <div>
                     <h4 className="text-[0.95rem] font-black text-(--ink) mb-1">{t('tapDemo.steps.step1Title')}</h4>
                     <p className="text-[0.82rem] text-(--ink-muted) leading-relaxed">{t('tapDemo.steps.step1Desc')}</p>
                  </div>
               </div>

               <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-(--clover) shrink-0 border border-black/[0.03] font-black text-sm">
                     02
                  </div>
                  <div>
                     <h4 className="text-[0.95rem] font-black text-(--ink) mb-1">{t('tapDemo.steps.step2Title')}</h4>
                     <p className="text-[0.82rem] text-(--ink-muted) leading-relaxed">{t('tapDemo.steps.step2Desc')}</p>
                  </div>
               </div>

               <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-(--clover) shrink-0 border border-black/[0.03] font-black text-sm">
                     03
                  </div>
                  <div>
                     <h4 className="text-[0.95rem] font-black text-(--ink) mb-1">{t('tapDemo.steps.step3Title')}</h4>
                     <p className="text-[0.82rem] text-(--ink-muted) leading-relaxed">{t('tapDemo.steps.step3Desc')}</p>
                  </div>
               </div>
            </div>

            <div className="mt-12">
               <button 
                 onClick={resetScan}
                 className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink-muted) hover:text-(--ink) transition-colors flex items-center gap-2"
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M23 4v6h-6" />
                     <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  {t('tapDemo.reset')}
               </button>
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex items-center justify-center min-h-[600px] order-2 lg:order-1 lg:col-span-4 lg:col-start-1">
             {/* Decorative background glow */}
             <motion.div 
               className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none"
               animate={{ 
                 scale: scanTriggered ? 1.2 : 1,
                 opacity: scanTriggered ? 0.4 : 0.2
               }}
               style={{ background: color }}
             />

             <div className="relative z-10 w-60 mx-auto flex flex-col items-center">
                <PhoneMockup />
                

                {/* Instructions hint */}
                {!scanTriggered && (
                  <motion.div 
                    className="mt-6 flex flex-col items-center gap-2 w-full text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button 
                      onClick={() => setIsAutoScanning(true)}
                      disabled={isAutoScanning}
                      className="px-4 py-2 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-sm text-[0.68rem] font-black uppercase tracking-widest text-(--ink-muted) hover:text-black hover:border-black/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isAutoScanning ? t('tapDemo.scanning') : t('tapDemo.tapToScan')}
                    </button>
                    <p className="text-[0.58rem] font-bold text-(--ink-muted)/60 uppercase tracking-widest pointer-events-none mt-1 whitespace-nowrap">
                      {t('tapDemo.hint')}
                    </p>
                  </motion.div>
                )}
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
