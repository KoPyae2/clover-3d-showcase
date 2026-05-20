import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FAQ_ITEMS } from '../../data/showcaseContent'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="section-faq"
      className="page-section py-32"
      aria-label="Frequently Asked Questions"
    >
      <div className="container mx-auto px-6 max-w-6xl lg:pr-[20%]">
        <div className="w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-(--clover) mb-6">Support</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-(--ink) leading-[1.1]">Common Questions.</h3>
          </motion.div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-[24px] border transition-all duration-500 overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-black/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]' 
                      : 'bg-white/60 backdrop-blur-md border-black/[0.04] hover:bg-white/90 hover:border-black/[0.08]'
                  }`}
                >
                  <button
                    className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="text-[1.05rem] font-bold text-(--ink)">{item.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-(--clover) text-white rotate-45' : 'bg-black/[0.03] text-(--ink)'}`}>
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                       </svg>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 text-[0.95rem] text-(--ink-muted) leading-relaxed">
                           {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <motion.div 
            className="mt-20 text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-[0.9rem] font-medium text-(--ink-muted) mb-6">Still have questions?</p>
            <a 
              href="mailto:support@clover.labs" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-black/[0.05] rounded-full text-[0.85rem] font-bold text-(--ink) hover:bg-black hover:text-white transition-all duration-300"
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
