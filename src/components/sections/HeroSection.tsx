import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ColorSwatches } from './ColorSwatches'
import { HERO_STATS } from '../../data/showcaseContent'
import type { HeroStat } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z" />
    </svg>
  )
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17v4" />
      <path d="M9 13v8" />
      <path d="M13 9v12" />
      <circle cx="19" cy="5" r="1" fill="currentColor" />
    </svg>
  )
}

function MouseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path d="M12 6v4" />
    </svg>
  )
}

const iconMap: Record<HeroStat['icon'], () => React.ReactElement> = {
  bolt: BoltIcon,
  palette: PaletteIcon,
  signal: SignalIcon,
}

/* ------------------------------------------------------------------ */
/*  Decorative Watermarks                                              */
/* ------------------------------------------------------------------ */

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const { t } = useTranslation()
  const { color, entry } = useColorStore()

  const gradientMap: Record<string, string> = {
    green: "linear-gradient(135deg, #2E6F40 0%, #10b981 100%)",
    blue: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
    red: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
    purple: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
    black: "linear-gradient(135deg, #0f172a 0%, #64748b 100%)",
    yellow: "linear-gradient(135deg, #ca8a04 0%, #facc15 100%)",
  }
  const activeGradient = gradientMap[entry.id] || "var(--grad-clover)"

  return (
    <section
      id="section-hero"
      className="page-section min-h-screen relative flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Decorative Blur - Full bleed and smooth transitioning */}
      <div className="absolute top-1/12 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-1000" style={{ background: color }} />
      <div className="absolute bottom-1/10 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-8 pointer-events-none transition-all duration-1000" style={{ background: 'var(--clover-mid)' }} />

      {/* Slowly rotating mega clover (right, watermark) */}
      <motion.div
        className="absolute z-0 pointer-events-none"
        style={{ top: '-12%', right: '-10%', color, opacity: 0.055 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
      >
        <CloverDecor style={{ width: '560px', height: '560px' }} color={color} />
      </motion.div>

      {/* Small accent clover bottom-left */}
      <CloverDecor
        className="absolute z-0 pointer-events-none"
        style={{
          bottom: '6%',
          left: '-3%',
          width: '200px',
          height: '200px',
          opacity: 0.04,
          transform: 'rotate(28deg)',
        }}
        color={color}
      />

      {/* Floating star sparkles */}
      <StarIcon
        className="absolute z-0"
        style={{ top: '11%', right: '27%', width: '14px', height: '14px', color, opacity: 0.22 }}
      />
      <StarIcon
        className="absolute z-0"
        style={{ top: '27%', right: '14%', width: '9px', height: '9px', color, opacity: 0.14 }}
      />
      <StarIcon
        className="absolute z-0"
        style={{ top: '61%', right: '21%', width: '12px', height: '12px', color, opacity: 0.16 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-sm border border-black/[0.05] mb-8 mr-[38%] sm:mr-[20%] lg:mr-0 max-w-[calc(100%-38%)] sm:max-w-[calc(100%-20%)] lg:max-w-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: color }} />
              <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-(--ink) truncate">
                {t('product.name')} <span className="opacity-40">/</span> {t(`colors.${entry.id}.label`)}
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-6 leading-[0.95] tracking-tight pr-[38%] sm:pr-[20%] lg:pr-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t('hero.title1')} <br className="hidden sm:inline" />
              {t('hero.title2')} <span 
                className="text-transparent bg-clip-text transition-all duration-1000" 
                style={{ backgroundImage: activeGradient }}
              >
                {t('hero.title3')}
              </span>
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg md:text-xl text-(--ink-muted) mb-10 max-w-xl font-medium leading-relaxed pr-[38%] sm:pr-[20%] lg:pr-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-(--ink) font-extrabold">{t(`colors.${entry.id}.tagline`)}</span> {t('hero.subtitle')}
            </motion.p>

            {/* Swatches in Hero */}
            <motion.div 
              className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-12 w-full max-w-[280px] sm:max-w-sm lg:max-w-fit shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-black/[0.03] mr-[38%] sm:mr-[20%] lg:mr-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-col gap-3 min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--ink-muted) block">
                    {t('hero.selectFinish')}
                  </span>
                  <span 
                    className="text-[0.88rem] sm:text-base font-extrabold tracking-tight transition-colors duration-300 block truncate" 
                    style={{ color: color }}
                    title={t(`colors.${entry.id}.label`)}
                  >
                    {t(`colors.${entry.id}.label`)}
                  </span>
                </div>
                <ColorSwatches />
              </div>
            </motion.div>

            {/* Features/Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {HERO_STATS.map((stat, i) => {
                const Icon = iconMap[stat.icon]
                const statKeys = ['latency', 'finishes', 'battery'] as const
                const key = statKeys[i]
                return (
                  <motion.div
                    key={stat.k}
                    className="flex flex-col p-4 sm:p-6 rounded-[24px] border border-black/[0.03] bg-white transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group shadow-sm hover:shadow-xl mr-[38%] sm:mr-[20%] md:mr-0"
                    style={{
                      borderColor: 'rgba(0, 0, 0, 0.03)',
                    }}
                    whileHover={{
                      borderColor: color,
                      boxShadow: `0 12px 30px -10px ${entry.glow}`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0"
                        style={{ color: color, border: `1px solid ${color}20` }}
                      >
                        <Icon />
                      </div>
                      <span className="text-[0.58rem] font-black uppercase tracking-[0.15em] text-(--ink-muted) truncate">
                        {t(`stats.${key}.k`)}
                      </span>
                    </div>
                    
                    <div className="text-[1.1rem] font-black text-(--ink) font-mono tracking-tight leading-none mb-1">
                      {t(`stats.${key}.v`)}
                    </div>
                    
                    <p className="text-[0.75rem] text-(--ink-muted) leading-snug font-medium">
                      {t(`stats.${key}.sub`)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right Space - Reserved for 3D model */}
          <div className="hidden lg:flex items-center justify-center relative min-h-[600px] lg:col-span-2">
             {/* This area is populated by the CloverOverlayScene in App.tsx */}
             <motion.div 
                className="absolute bottom-10 left-0 flex items-center gap-3 text-(--ink-muted)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
             >
                <MouseIcon />
                <span className="text-[0.65rem] font-bold uppercase tracking-widest whitespace-nowrap">{t('hero.dragToRotate')}</span>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

