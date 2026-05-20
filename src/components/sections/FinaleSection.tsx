import { motion } from 'framer-motion'
import { PRODUCT } from '../../data/showcaseContent'
import { useColorStore } from '../../store/useColorStore'
import { CloverDecor } from '../CloverDecor'

export function FinaleSection() {
  const { color } = useColorStore()

  return (
    <section
      id="section-finale"
      className="page-section py-40 relative overflow-hidden"
      aria-label="Finale"
    >
      <div className="container mx-auto px-6 max-w-6xl relative z-10 lg:pr-[20%]">
        <div className="w-full text-left">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 inline-block relative"
          >
             <div className="absolute inset-0 blur-[60px] opacity-20" style={{ background: color }} />
             <CloverDecor className="w-32 h-32 relative z-10" color={color} />
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-7xl font-black tracking-tighter text-(--ink) mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready for your <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--grad-clover)' }}>next lucky tap?</span>
          </motion.h2>

          <motion.p 
            className="text-xl text-(--ink-muted) mb-12 max-w-2xl mr-auto ml-0 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            The Clover Series A is more than a keychain. It is a bridge between the physical and digital worlds, crafted to last a lifetime.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-start gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button className="px-10 py-5 bg-(--ink) text-white text-[0.9rem] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl">
              Buy Now — {PRODUCT.msrp}
            </button>
            <button className="px-10 py-5 bg-white border border-black/[0.05] text-(--ink) text-[0.9rem] font-black uppercase tracking-widest rounded-full hover:bg-black hover:text-white transition-all duration-300">
              View Catalogue
            </button>
          </motion.div>

          <motion.p 
            className="mt-12 text-[0.75rem] font-bold text-(--ink-muted) uppercase tracking-[0.2em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Free shipping on all Series A prototypes
          </motion.p>
        </div>
      </div>
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-(--clover-soft) rounded-full blur-[150px] opacity-20 -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-30 -z-10 -translate-x-1/2 translate-y-1/2" />
    </section>
  )
}
