import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CloverDecor } from './CloverDecor'
import { useColorStore } from '../store/useColorStore'

export function LoadingScreen() {
  const { t } = useTranslation()
  const { active, progress } = useProgress()
  const color = useColorStore((s) => s.color)

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafafc]"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center">
            {/* Logo pulse */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloverDecor className="w-16 h-16 drop-shadow-sm mb-6" color={color} />
            </motion.div>

            {/* Progress text */}
            <div className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--ink-muted) mb-3">
              {t('loading.showcase')}
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-black/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="text-[0.55rem] font-bold text-black/30 mt-2 tracking-widest">
              {Math.round(progress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
