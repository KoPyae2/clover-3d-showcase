import { motion } from 'framer-motion'
import { GLOBAL_SPECS } from '../../data/showcaseContent'

export function SpecsSection() {
  return (
    <section
      id="section-specs"
      className="page-section py-32"
      aria-label="Specifications"
    >
      <div className="container mx-auto px-6 max-w-6xl lg:pr-[20%]">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-(--clover) mb-6">Technical Data</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-(--ink) leading-[1.05]">Engineered to <br />be effortless.</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0">
            {GLOBAL_SPECS.map((spec, i) => {
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`group py-6 border-b border-black/[0.05] flex items-baseline justify-between ${
                    isEven ? 'md:pr-12 md:border-r md:border-black/[0.05]' : 'md:pl-12'
                  }`}
                >
                  <span className="text-[0.7rem] font-black uppercase tracking-widest text-(--ink-muted) group-hover:text-(--clover) transition-colors">
                    {spec.label}
                  </span>
                  <span className="text-[0.95rem] font-bold text-(--ink) text-right">
                    {spec.value}
                  </span>
                </motion.div>
              )
            })}
          </div>
          
          <motion.div 
            className="mt-20 p-6 md:p-8 rounded-[24px] bg-white border border-black/[0.04] shadow-sm flex items-center gap-6"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.03] flex items-center justify-center text-(--clover) shrink-0">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
               </svg>
            </div>
            <div>
               <h4 className="text-[0.95rem] font-black text-(--ink)">Durability Standard</h4>
               <p className="text-[0.8rem] font-medium text-(--ink-muted)">Tested for 100,000+ tap cycles (theoretical).</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
