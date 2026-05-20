import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useColorStore } from "../store/useColorStore";
import { CloverDecor } from "./CloverDecor";

const NAV = [
  { label: "Overview", id: "section-hero" },
  { label: "Story", id: "section-story" },
  { label: "Specs", id: "section-specs" },
  { label: "Tap demo", id: "section-tap" },
  { label: "FAQ", id: "section-faq" },
] as const;

const getNavLabelKey = (id: string) => {
  if (id === 'section-hero') return 'overview';
  if (id === 'section-story') return 'story';
  if (id === 'section-specs') return 'specs';
  if (id === 'section-tap') return 'tapDemo';
  if (id === 'section-faq') return 'faq';
  return '';
};

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const entry = useColorStore((s) => s.entry);
  const setLanguage = useColorStore((s) => s.setLanguage);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("section-hero");
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  useEffect(() => {
    const handleScroll = () => {
      let active = "section-hero";
      const scrollPosition = window.scrollY + 160; // Offset for header height and scroll threshold

      for (const item of NAV) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            active = item.id;
          }
        }
      }
      setActiveSection(active);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);

    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 64; // offset for the sticky header height
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[100] h-(--header-h) flex justify-center transition-all duration-500"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        backdropFilter: scrolled ? "blur(var(--glass-blur))" : "none",
        WebkitBackdropFilter: scrolled ? "blur(var(--glass-blur))" : "none",
        background: scrolled ? "var(--glass-bg-strong)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1200px] w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#section-hero"
          onClick={(e) => handleNavClick(e, "section-hero")}
          className="group flex items-center gap-3 no-underline"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
             <motion.div 
               className="absolute inset-0 rounded-lg"
               style={{ backgroundColor: entry.hex, opacity: 0.15 }}
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             />
             <CloverDecor className="w-6 h-6 relative z-10" color={entry.hex} />
          </div>
          <span className="text-[0.95rem] font-bold tracking-tight text-(--ink) group-hover:opacity-60 transition-opacity">
            Clover
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center p-1 bg-black/[0.03] rounded-full border border-black/[0.03]">
          {NAV.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-4 py-1.5 text-[0.78rem] font-bold transition-all duration-300 rounded-full ${
                  isActive ? "text-(--ink)" : "text-(--ink-muted) hover:text-(--ink)"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="header-pill"
                    className="absolute inset-0 bg-white shadow-sm rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t(`nav.${getNavLabelKey(item.id)}`)}</span>
              </a>
            );
          })}
        </nav>

        {/* Finish Selector Status */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.04] text-[0.7rem] font-bold text-(--ink) hover:bg-black/[0.06] transition-colors cursor-pointer"
              aria-label="Switch language"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{i18n.language.toUpperCase()}</span>
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-24 bg-white/90 backdrop-blur-md border border-black/[0.05] rounded-xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] py-1 z-50 flex flex-col">
                  {["en", "my", "zh"].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLanguage(l);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 text-left text-[0.7rem] font-bold transition-colors hover:bg-black/[0.04] cursor-pointer ${
                        i18n.language === l ? "text-(--ink)" : "text-(--ink-muted)"
                      }`}
                    >
                      {l === "en" && "English"}
                      {l === "my" && "Myanmar"}
                      {l === "zh" && "Chinese"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-(--ink-muted) leading-none mb-1">
              {t("nav.activeFinish")}
            </span>
            <span className="text-[0.75rem] font-bold text-(--ink) leading-none">
              {t(`colors.${entry.id}.label`)}
            </span>
          </div>
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-black/[0.05] bg-white shadow-sm"
            animate={{ borderColor: entry.hex }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="w-4 h-4 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
              style={{ background: entry.hex }}
            />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
