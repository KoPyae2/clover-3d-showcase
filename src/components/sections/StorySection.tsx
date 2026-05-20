import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { COLOR_PALETTE, useColorStore } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

export function StorySection() {
  const { t } = useTranslation()
  const { activeId, setColor } = useColorStore()
  
  // Find current active finish details
  const activeEntry = COLOR_PALETTE.find((item) => item.id === activeId) ?? COLOR_PALETTE[0]

  // Animations configuration
  const tabContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  }

  const tabItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 180,
        damping: 20,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.97, 
      y: -10,
      transition: { duration: 0.3, ease: "easeInOut" as const } 
    }
  }

  const textContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  }

  const textItemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 200, damping: 22 } }
  }

  const highlightVariants = {
    hidden: { opacity: 0, x: -15 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 220,
        damping: 20,
        delay: 0.3 + i * 0.08
      }
    })
  }

  return (
    <section
      id="section-story"
      className="page-section relative py-32 overflow-hidden"
      aria-label="Story"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-left mb-20 pr-[20%] lg:pr-0 lg:max-w-[80%]"
        >
          <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-(--clover) mb-6">{t('storySection.subtitle')}</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-(--ink) leading-[1.05]">
            {t('storySection.titleLine1')} <br />
            <span className="text-black/30">{t('storySection.titleLine2')}</span>
          </h3>
        </motion.div>

        {/* Mobile Swatch Selector (Shown only on mobile to fit screen cleanly without scrolling) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:hidden flex flex-col gap-3 items-start justify-start w-full mb-8 pr-[20%]"
        >
          <span className="text-[0.62rem] sm:text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--ink-muted) mb-1 text-left block">
            {t('storySection.selectColor')}: <span className="font-black ml-1 block sm:inline transition-colors duration-300" style={{ color: activeEntry.hex }}>{t(`colors.${activeEntry.id}.label`)}</span>
          </span>
          <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3.5 w-full">
            {COLOR_PALETTE.map((item) => {
              const isActive = item.id === activeId
              return (
                <button
                  key={item.id}
                  onClick={() => setColor(item.id)}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer focus:outline-none transition-transform active:scale-95 select-none animate-none"
                  style={{
                    border: isActive ? `2px solid ${item.hex}` : '2px solid transparent',
                    padding: '2px'
                  }}
                  aria-label={`Select ${item.label}`}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: item.hex,
                      boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2)'
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeStorySwatchRing"
                      className="absolute -inset-[4px] rounded-full border border-black/15"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Master Selector and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-start">
          
          {/* Left Column: Interactive Finish List (Desktop only) */}
          <motion.div 
            variants={tabContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="hidden lg:flex lg:col-span-3 flex-col gap-3 w-full"
          >
            {COLOR_PALETTE.map((item) => {
              const isActive = item.id === activeId
              return (
                <motion.button
                  key={item.id}
                  variants={tabItemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setColor(item.id)}
                  className={`flex items-center gap-4 text-left p-4 rounded-2xl cursor-pointer transition-all duration-300 w-64 min-w-[250px] lg:w-full relative overflow-hidden group select-none border border-transparent ${
                    isActive 
                      ? 'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]' 
                      : 'hover:border-black/[0.04]'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`View ${t(`colors.${item.id}.label`)} design story`}
                >
                  {/* Dynamic Color indicator */}
                  <div className="relative flex items-center justify-center shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                    <div 
                      className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: item.hex,
                        boxShadow: `inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 6px ${item.hex}33`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Sku & Labels */}
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-(--ink) text-base block truncate transition-colors duration-300">
                      {t(`colors.${item.id}.label`)}
                    </span>
                  </div>

                  {/* Floating active marker */}
                  {isActive && (
                    <motion.div
                      layoutId="activeStoryTabBg"
                      className="absolute inset-0 bg-white border border-black/[0.03] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeStoryTabIndicator"
                      className="absolute left-0 top-[20%] bottom-[20%] w-1 rounded-r-md"
                      style={{ backgroundColor: item.hex }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Right Column: Premium Active Story Card Showcase */}
          <div className="lg:col-span-5 relative min-h-[500px] lg:min-h-[550px] w-full flex items-stretch">
            
            {/* Dynamic ambient color background glow behind the card */}
            <div className="absolute inset-0 -z-20 flex items-center justify-center pointer-events-none">
              <motion.div 
                key={`glow-${activeId}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.18, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="w-[450px] h-[450px] rounded-full blur-[100px]" 
                style={{ backgroundColor: activeEntry.hex }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-auto mr-[20%] md:mr-0 md:w-full grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-black/[0.03] p-5 md:p-10 relative items-center"
              >
                
                {/* 2.1 Card Visual Part: SVG Clover (Hidden on mobile to let the 3D dangling model be the hero visual, avoiding clutter) */}
                <div className="hidden md:flex md:col-span-5 items-center justify-center p-4 min-h-[280px] relative rounded-[24px] overflow-hidden bg-[#FDFBF7] border border-black/[0.03]">
                  {/* Rotating breathing layer in background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                      className="w-48 h-48 rounded-full blur-3xl opacity-20"
                      style={{ background: activeEntry.hex }}
                    />
                  </div>

                  {/* High fidelity spinning Blooming clover */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <motion.div
                      className="w-40 h-40 relative z-20 drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                      initial={{ scale: 0.7, rotate: -60, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    >
                      <CloverDecor className="w-full h-full" color={activeEntry.hex} />
                    </motion.div>
                  </motion.div>
                </div>

                {/* 2.2 Card Story details Block */}
                <motion.div 
                  variants={textContainerVariants}
                  className="md:col-span-7 flex flex-col justify-center"
                >
                  <motion.h4 
                    variants={textItemVariants}
                    className="text-2xl md:text-3xl font-black text-(--ink) mb-4 tracking-tight"
                  >
                    {t(`colors.${activeEntry.id}.storyTitle`)}
                  </motion.h4>
                  
                  <motion.p 
                    variants={textItemVariants}
                    className="text-base text-(--ink-muted) leading-relaxed mb-6"
                  >
                    {t(`colors.${activeEntry.id}.storyBody`)}
                  </motion.p>
                  
                  {/* Highlights checklist */}
                  <ul className="space-y-3.5 mb-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.li 
                        key={i}
                        custom={i}
                        variants={highlightVariants}
                        className="flex items-center gap-3 text-[0.8rem] font-bold text-(--ink-muted)"
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500/15 text-emerald-600 shrink-0 shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="opacity-90">{t(`colors.${activeEntry.id}.highlight${i + 1}`)}</span>
                      </motion.li>
                    ))}
                  </ul>

                </motion.div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      {/* Absolute layout Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-(--clover-soft) rounded-full blur-[140px] opacity-25 -z-10 pointer-events-none" />
    </section>
  )
}
