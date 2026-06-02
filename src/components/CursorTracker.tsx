import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CursorTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring physics for the magnetic effect
  const smoothX = useSpring(cursorX, { stiffness: 400, damping: 25, mass: 0.5 });
  const smoothY = useSpring(cursorY, { stiffness: 400, damping: 25, mass: 0.5 });

  useEffect(() => {
    // Check if it's a touch device, if so, don't show the cursor tracker
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.tagName.toLowerCase() === 'select' ||
        target.closest('a, button, input, textarea, select')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: isVisible ? 1 : 0
      }}
      animate={
        isHovering ? {
          scale: [1.2, 1.4, 1.2],
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: '#f97316',
        } : {
          scale: 1,
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderColor: 'rgba(249, 115, 22, 0.5)'
        }
      }
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        scale: isHovering ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : { type: 'spring' },
        borderColor: { duration: 0.3 }
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] backdrop-blur-[2px] hidden md:block mix-blend-screen"
    />
  );
}
