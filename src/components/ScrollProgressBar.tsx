import { motion, useScroll, useSpring } from 'motion/react';

/**
 * ScrollProgressBar
 * 
 * Subtle reading progress bar pinned to the very top edge of the screen.
 * Tracks reading progress smoothly across the landing page with spring damping,
 * subtle ambient glow, and accessibility markup.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[2.5px] pointer-events-none z-[60] overflow-hidden"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Dynamic progress bar fill */}
      <motion.div
        className="h-full w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 origin-[0%] shadow-[0_0_8px_rgba(249,115,22,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
}
