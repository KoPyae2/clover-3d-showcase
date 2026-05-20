import { useColorStore } from '../../store/useColorStore'

const FINISHES = [
  { id: 'green', name: 'Signature Green', hex: '#0c3823' },
  { id: 'black', name: 'Obsidian Black', hex: '#1c1c1e' },
  { id: 'yellow', name: 'Honey Yellow', hex: '#eab308' },
  { id: 'red', name: 'Crimson Red', hex: '#991b1b' },
  { id: 'blue', name: 'Cobalt Blue', hex: '#1e3a8a' },
  { id: 'silver', name: 'Quartz Silver', hex: '#6b7280' },
]

export function EndingLineupSection() {
  const { activeId, setColor } = useColorStore()

  return (
    <section className="py-24 border-t border-black/[0.04] bg-white relative overflow-hidden">
      {/* Editorial gridlines background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-y-0 left-1/4 w-[1px] bg-black/[0.03]" />
        <div className="absolute inset-y-0 left-2/4 w-[1px] bg-black/[0.03]" />
        <div className="absolute inset-y-0 left-3/4 w-[1px] bg-black/[0.03]" />
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/[0.03]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          {/* Product Lineup details */}
          <div>
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-(--clover) mb-3">Lineup</h4>
            <h3 className="text-3xl font-black tracking-tight text-(--ink) mb-4">Choose your finish.</h3>
            <p className="text-[0.88rem] text-(--ink-muted) leading-relaxed max-w-md">
              Clover Series A is milled from a single block of aerospace-grade titanium and hand-finished in six premium colors. Complete with matching Kevlar cord.
            </p>

            {/* Color Swatch Lineup */}
            <div className="flex flex-wrap gap-2.5 mt-6">
              {FINISHES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setColor(f.id)}
                  className={`px-3 py-1.5 rounded-full border text-[0.68rem] font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeId === f.id
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-(--ink-muted) border-black/10 hover:border-black/25'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: f.hex }}
                  />
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Elegant Price & Checkout block */}
          <div className="w-full md:w-auto shrink-0 p-8 rounded-2xl bg-[#fafafc] border border-black/[0.03] shadow-sm flex flex-col items-center md:items-start text-center md:text-left min-w-[280px]">
            <span className="text-[0.62rem] font-black uppercase tracking-widest text-(--ink-muted) mb-1">Clover Series A</span>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-black text-(--ink)">$34</span>
              <span className="text-[0.7rem] font-bold text-(--ink-muted)">USD</span>
            </div>
            
            <button
              onClick={() => alert('Checkout simulation: Finish selected - ' + FINISHES.find(f => f.id === activeId)?.name)}
              className="w-full py-3 bg-(--ink) hover:bg-(--ink)/90 active:scale-[0.98] text-white text-[0.7rem] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-black/10 cursor-pointer text-center"
            >
              Order Now
            </button>
            <span className="text-[0.55rem] font-bold text-(--ink-muted)/60 uppercase tracking-widest text-center w-full mt-3">
              Free global shipping
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
