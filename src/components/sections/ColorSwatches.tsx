import { motion } from 'framer-motion'
import { COLOR_PALETTE, useColorStore } from '../../store/useColorStore'

export function ColorSwatches() {
  const { activeId, setColor } = useColorStore()

  return (
    <div 
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-1" 
      role="radiogroup" 
      aria-label="Finish colour"
    >
      {COLOR_PALETTE.map((paletteEntry) => {
        const isActive = activeId === paletteEntry.id
        return (
          <div key={paletteEntry.id} className="relative group shrink-0">
            <motion.button
              type="button"
              className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'shadow-md scale-115 ring-2 ring-black/[0.08]'
                  : 'hover:scale-105 bg-white shadow-sm border border-black/[0.05]'
              }`}
              style={{
                backgroundColor: isActive ? paletteEntry.hex : 'white',
              }}
              onClick={() => setColor(paletteEntry.id)}
              role="radio"
              aria-checked={isActive}
              aria-label={paletteEntry.label}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-transform duration-300 ${
                  isActive ? 'bg-white scale-110' : 'scale-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]'
                }`}
                style={{
                  backgroundColor: isActive ? 'white' : paletteEntry.hex,
                }}
              />
              
              {isActive && (
                <motion.div
                  layoutId="swatch-glow"
                  className="absolute -inset-1 rounded-[14px] sm:rounded-[20px] blur-md opacity-45 z-[-1]"
                  style={{ backgroundColor: paletteEntry.hex }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
            
            {/* Tooltip-like label on hover */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[0.6rem] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
              {paletteEntry.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
