import { useState, useEffect } from 'react';
import { openApplicationModal } from '../lib/events';

interface StickyMobileCTAProps {
  onOpenModal?: () => void;
}

export default function StickyMobileCTA({ onOpenModal }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const finalCta = document.getElementById('final-cta');
    if (!finalCta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Hide sticky bar when Section 11 (#final-cta) is in view
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-slate-950/95 backdrop-blur-md border-t border-white/15 shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-sm tracking-tight rounded-lg shadow-lg shadow-orange-600/30 text-center transition-colors cursor-pointer min-h-[44px]"
        >
          Get my free portal preview
        </button>
      </div>
    </div>
  );
}
