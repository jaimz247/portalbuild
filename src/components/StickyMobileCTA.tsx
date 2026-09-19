import { useState, useEffect } from 'react';
import { openApplicationModal } from '../lib/events';

interface StickyMobileCTAProps {
  onOpenModal?: () => void;
}

export default function StickyMobileCTA({ onOpenModal }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const setupObserver = () => {
      const finalCta = document.getElementById('final-cta');
      if (!finalCta) {
        return false;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          // Hide sticky CTA automatically when FinalCTA enters viewport to avoid button stacking
          setIsVisible(!entry.isIntersecting);
        },
        {
          threshold: 0,
          // Detect when FinalCTA is approaching or enters the viewport
          rootMargin: '0px 0px 40px 0px',
        }
      );

      observer.observe(finalCta);
      return true;
    };

    // Attempt immediate attachment
    const attached = setupObserver();
    if (!attached) {
      // Retry after initial DOM paint if element was still mounting
      retryTimer = setTimeout(setupObserver, 150);
    }

    return () => {
      if (observer) observer.disconnect();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  const handleClick = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  return (
    <div
      role="region"
      aria-label="Mobile quick action bar"
      aria-hidden={!isVisible}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-slate-950/95 border-t border-white/[0.08] shadow-2xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          tabIndex={isVisible ? 0 : -1}
          aria-label="Get my free custom portal preview built in 24 hours"
          className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium text-sm tracking-tight rounded-lg border border-orange-400/30 text-center transition-colors cursor-pointer min-h-[48px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span>Get my free portal preview</span>
        </button>
      </div>
    </div>
  );
}

