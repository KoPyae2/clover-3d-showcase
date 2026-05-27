import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[80] h-[2px] pointer-events-none"
      role="progressbar"
      aria-label="Scroll progress"
    >
      <motion.div
        className="h-full origin-left bg-(--ink)"
        style={{ scaleX, opacity: 0.4 }}
      />
    </div>
  );
}
