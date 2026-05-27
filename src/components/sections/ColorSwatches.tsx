import { motion } from 'framer-motion'
import { COLOR_PALETTE, useColorStore } from '../../store/useColorStore'

export function ColorSwatches() {
  const { activeId, setColor } = useColorStore()

  return (
    <div
      className="flex flex-nowrap items-center justify-center gap-2.5 sm:gap-3 py-1"
      role="radiogroup"
      aria-label="Finish colour"
    >
      {COLOR_PALETTE.map((paletteEntry) => {
        const isActive = activeId === paletteEntry.id
        return (
          <motion.div key={paletteEntry.id} className="relative group shrink-0">
            <motion.button
              type="button"
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'shadow-md scale-110'
                  : 'hover:scale-105 bg-white shadow-sm border border-black/[0.05] active:scale-95'
              }`}
              style={{
                backgroundColor: isActive ? paletteEntry.hex : 'white',
              }}
              onClick={() => setColor(paletteEntry.id)}
              role="radio"
              aria-checked={isActive}
              aria-label={paletteEntry.label}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: isActive ? 1.1 : 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Inner color dot */}
              <div
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-transform duration-300 ${
                  isActive ? 'bg-white scale-110' : 'scale-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]'
                }`}
                style={{
                  backgroundColor: isActive ? 'white' : paletteEntry.hex,
                }}
              />

              {/* Active ring glow */}
              {isActive && (
                <motion.div
                  layoutId="swatch-glow"
                  className="absolute -inset-[3px] rounded-[18px] sm:rounded-[20px] blur-md opacity-45 z-[-1]"
                  style={{ backgroundColor: paletteEntry.hex }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Active ring */}
              {isActive && (
                <motion.div
                  layoutId="swatch-ring"
                  className="absolute -inset-1 rounded-[16px] sm:rounded-[18px] ring-2 ring-black/[0.08]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>

            {/* Hover tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black text-white text-[0.6rem] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none uppercase tracking-widest z-50">
              {paletteEntry.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
