import { useRef, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useColorStore } from '../store/useColorStore'
import { setTapTargetRect } from '../lib/tapTargetRect'

type ProximityLevel = 'far' | 'near' | 'inside'

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left: `${35 + (i * 4) % 25}%`,
  top: `${30 + (i * 5) % 35}%`,
  color: ['#863bff', '#c8922a', '#00D8FF', '#ffffff'][i % 4],
  tx: `${(Math.random() - 0.5) * 120}px`,
  ty: `${(Math.random() - 0.5) * 120 - 40}px`,
  delay: `${i * 40}ms`,
  duration: `${600 + Math.random() * 400}ms`,
}))

export function PhoneMockup() {
  const { t } = useTranslation()
  const scanZoneRef = useRef<HTMLDivElement>(null)
  const {
    cloverScreenX,
    cloverScreenY,
    scanTriggered,
    entry,
    setScanTriggered,
    resetScan,
    isAutoScanning,
    setIsAutoScanning
  } = useColorStore()
  const [proximityLevel, setProximityLevel] = useState<ProximityLevel>('far')
  const [isRippling, setIsRippling] = useState(false)

  const islandGlowStyle = useMemo(() => {
    const h = entry.hex
    if (scanTriggered) {
      return { boxShadow: `0 0 0 2px ${hexToRgba(h, 0.7)}, 0 0 20px ${hexToRgba(h, 0.4)}` }
    }
    if (proximityLevel === 'near') {
      return { boxShadow: `0 0 0 1.5px ${hexToRgba(h, 0.5)}, 0 0 12px ${hexToRgba(h, 0.2)}` }
    }
    return undefined
  }, [entry.hex, scanTriggered, proximityLevel])

  const labelText = scanTriggered
    ? t('phone.read')
    : proximityLevel === 'near'
      ? t('phone.closer')
      : t('phone.nfc')

  useEffect(() => {
    if (!scanZoneRef.current || scanTriggered) return
    const rect = scanZoneRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.hypot(cloverScreenX - cx, cloverScreenY - cy)

    if (dist > 120) {
      setProximityLevel('far')
    } else if (dist > 40) {
      setProximityLevel('near')
    } else {
      setProximityLevel('inside')
      if (!scanTriggered) {
        setScanTriggered(true)
        setIsRippling(true)
        setTimeout(() => setIsRippling(false), 1200)
      }
    }
  }, [cloverScreenX, cloverScreenY, scanTriggered, setScanTriggered])

  // Track the notch client rect in the viewport to let R3F coordinate helper map it to 3D world space
  useEffect(() => {
    const updateRect = () => {
      if (scanZoneRef.current) {
        const rect = scanZoneRef.current.getBoundingClientRect()
        setTapTargetRect({
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Settle timeout to ensure browser layout is complete
    const t = setTimeout(updateRect, 100)

    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
      setTapTargetRect(null)
    }
  }, [])

  // Play NFC chime sound and trigger haptic vibration on successful scan
  useEffect(() => {
    if (scanTriggered) {
      // 1. Trigger haptic vibration on mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(60) // Short 60ms click vibration
        } catch (e) {
          console.warn('Vibration failed', e)
        }
      }
      
      // 2. Play synthesized premium NFC chime sound
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          const ctx = new AudioContextClass()
          
          // First note (A5, 880Hz)
          const osc1 = ctx.createOscillator()
          const gain1 = ctx.createGain()
          osc1.connect(gain1)
          gain1.connect(ctx.destination)
          
          osc1.type = 'sine'
          osc1.frequency.setValueAtTime(880, ctx.currentTime)
          gain1.gain.setValueAtTime(0, ctx.currentTime)
          gain1.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02)
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
          
          osc1.start(ctx.currentTime)
          osc1.stop(ctx.currentTime + 0.15)
          
          // Second note (D6, 1174.66Hz) - starts slightly later for a gorgeous double beep
          const osc2 = ctx.createOscillator()
          const gain2 = ctx.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx.destination)
          
          osc2.type = 'sine'
          osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.08)
          gain2.gain.setValueAtTime(0, ctx.currentTime + 0.08)
          gain2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.10)
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
          
          osc2.start(ctx.currentTime + 0.08)
          osc2.stop(ctx.currentTime + 0.3)
        }
      } catch (e) {
        console.warn('Web Audio synthesis failed', e)
      }
    }
  }, [scanTriggered])


  return (
    <motion.div
      className="relative w-60 aspect-[393/852] bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ec] border border-black/[0.08] rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col items-center p-[6px]"
      aria-label="iPhone mockup"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Side buttons */}
      <div className="absolute w-[3px] h-8 bg-[#d4d4d8] rounded-full -left-[3px] top-[100px]" aria-hidden />
      <div className="absolute w-[3px] h-8 bg-[#d4d4d8] rounded-full -left-[3px] top-[144px]" aria-hidden />
      <div className="absolute w-[3px] h-10 bg-[#d4d4d8] rounded-full -right-[3px] top-[118px]" aria-hidden />

      {/* === FLOATING "Tap here" TOOLTIP (outside screen, above phone) === */}
      <motion.div
        className="absolute -top-[38px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative bg-[#1a1a1a] text-white text-xs font-semibold py-1.5 px-4 rounded-full shadow-lg whitespace-nowrap">
            Tap here
            {/* Down arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #1a1a1a',
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Screen */}
      <div className="relative w-full h-full bg-[#fafafc] rounded-[34px] overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-5 pt-1 z-30 text-[11px] font-medium text-(--ink-muted) pointer-events-none" aria-hidden>
          <span>Clover</span>
          <span>100%</span>
        </div>

        {/* Dynamic Island / NFC zone */}
        <motion.div
          ref={scanZoneRef}
          onClick={() => {
            if (!scanTriggered && !isAutoScanning) {
              setIsAutoScanning(true)
            }
          }}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-[72px] h-6 bg-[#1a1a1a] rounded-full z-20 cursor-pointer"
          style={islandGlowStyle}
          animate={scanTriggered ? { scale: [1, 1.05, 1] } : proximityLevel === 'near' ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={scanTriggered || proximityLevel === 'near' ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
          aria-label="NFC scan zone"
        />

        {/* WAVE EFFECTS around notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[72px] h-6 pointer-events-none z-15">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-black/10 animate-[tap-wave_2s_ease-out_infinite]"
              style={{ animationDelay: `${i * 600}ms` }}
            />
          ))}
        </div>

        {/* Label below island */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-[0.12em] uppercase text-(--ink-muted) whitespace-nowrap z-20 transition-opacity duration-300">
          {labelText}
        </div>

        {/* Ripple on scan */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[72px] h-6 pointer-events-none z-10">
          {isRippling &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-[1.5px] border-solid opacity-0 animate-[nfc-ripple_900ms_ease-out_forwards]"
                style={{ borderColor: entry.hex, animationDelay: `${i * 200}ms` }}
              />
            ))}
        </div>

        {/* Background gradient container */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${hexToRgba(entry.hex, 0.16)} 0%, #fafafc 75%)`
          }}
        />

        {/* Lockscreen Clock */}
        <div className="absolute top-16 left-0 right-0 flex flex-col items-center pointer-events-none select-none z-10 text-center">
          <span className="text-[2.6rem] font-light text-(--ink) tracking-tight leading-none">9:41</span>
          <span className="text-[0.62rem] font-bold text-(--ink-muted) uppercase tracking-widest mt-1.5">Wednesday, May 20</span>
        </div>

        {/* Lockscreen Breathing prompt */}
        <AnimatePresence>
          {!scanTriggered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 left-0 right-0 flex flex-col items-center pointer-events-none select-none z-10 text-center"
            >
              <motion.div
                className="w-2 h-2 rounded-full mb-2"
                style={{ backgroundColor: entry.hex }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-(--ink-muted)">Ready to scan</span>
              <span className="text-[0.55rem] text-(--ink-muted)/60 mt-0.5">Hold Clover near top</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulated iOS Scan Result Card */}
        <AnimatePresence>
          {scanTriggered && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-28 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-black/[0.04] text-left cursor-pointer hover:bg-white transition-colors"
              onClick={() => {
                resetScan()
              }}
            >
              {/* Confetti effect inside the screen */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    className="absolute w-1 h-1 rounded-full opacity-0 animate-[confetti-burst_var(--duration)_ease-out_forwards]"
                    style={{
                      left: c.left,
                      top: c.top,
                      backgroundColor: c.color,
                      '--tx': c.tx,
                      '--ty': c.ty,
                      animationDelay: c.delay,
                      animationDuration: c.duration,
                    } as React.CSSProperties}
                  />
                ))}
              </div>

              <div className="relative z-10 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-wider text-sky-500 leading-none mb-0.5">{t('phone.detected')}</p>
                  <p className="text-[0.55rem] font-bold text-(--ink-muted) leading-none">{t('phone.tagLabel')}{t(`colors.${entry.id}.label`)}</p>
                </div>
              </div>

              <div className="relative z-10 mt-3.5">
                <p className="text-[0.8rem] font-extrabold tracking-tight text-emerald-600 break-all underline decoration-2 decoration-emerald-500/20 underline-offset-2">
                  https://clover.ly/{entry.id}
                </p>
                <p className="text-[0.58rem] font-bold text-black/35 mt-2 flex items-center gap-1.5">
                  {t('phone.dismiss')}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home indicator */}
        <div className="w-24 h-1 rounded-full bg-(--ink) absolute bottom-2 left-1/2 -translate-x-1/2 z-30" aria-hidden />
      </div>
    </motion.div>
  )
}
