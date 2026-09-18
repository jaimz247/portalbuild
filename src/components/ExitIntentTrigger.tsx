import { useEffect, useRef } from 'react';
import {
  openApplicationModal,
  hasInteractedWithPrimaryCTA,
  hasExitIntentTriggered,
  markExitIntentTriggered,
} from '../lib/events';

/**
 * ExitIntentTrigger component
 * 
 * Detects when a visitor is about to leave the site and displays the
 * 'Get free preview' modal if they haven't already interacted with the primary CTA.
 * Uses a simple event listener on the window mouseleave event and ensures it
 * only triggers once per session.
 */
export default function ExitIntentTrigger() {
  const triggeredRef = useRef(false);

  useEffect(() => {
    // If visitor has already interacted with the primary CTA or triggered exit-intent this session, skip
    if (hasExitIntentTriggered() || hasInteractedWithPrimaryCTA()) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Guard against multiple firings
      if (triggeredRef.current) return;
      if (hasExitIntentTriggered() || hasInteractedWithPrimaryCTA()) return;

      // Detect cursor leaving the top boundary of the window (toward address bar/tabs/close button)
      // or leaving the active document viewport
      if (e.clientY <= 25 || e.relatedTarget === null) {
        triggeredRef.current = true;
        markExitIntentTriggered();
        openApplicationModal();
      }
    };

    // Use a simple event listener on the window mouse leave event as required
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return null;
}
