import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';
import { OPEN_DEMO_MODAL_EVENT, CLOSE_MODALS_EVENT } from '../lib/events';
import { useTranslation } from '../context/LanguageContext';

export default function ExitIntentModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggered && window.innerWidth > 768) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    const handleOpenDemo = () => {
      setIsOpen(true);
      setHasTriggered(true); // Don't trigger on exit intent if already opened via click
    };

    const handleCloseEvent = () => {
      setIsOpen(false);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener(OPEN_DEMO_MODAL_EVENT, handleOpenDemo);
    window.addEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener(OPEN_DEMO_MODAL_EVENT, handleOpenDemo);
      window.removeEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);
    };
  }, [hasTriggered]);

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="exit-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.05 }}
            className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/15 p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(249,115,22,0.12)] relative z-10 text-center rounded-3xl overflow-hidden"
          >
            {/* Ambient radiant highlight */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-500/15 blur-3xl rounded-full pointer-events-none" />

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 focus-visible:ring-2 focus-visible:ring-orange-500 focus:outline-none cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto bg-orange-600/20 text-orange-500 flex items-center justify-center rounded-2xl mb-6 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
               <Play className="w-6 h-6 ml-0.5" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-3">
              {t('exit_modal_demo_title')}
            </h2>
            <p className="text-slate-300 text-sm mb-7 leading-relaxed">
              {t('exit_modal_demo_desc')}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <input 
                type="email" 
                required
                aria-label="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('exit_modal_input_placeholder')}
                className="w-full bg-slate-950/90 border border-white/15 px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl transition-all text-sm placeholder:text-slate-500"
              />
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-110 text-white font-bold py-3.5 px-6 text-sm tracking-tight rounded-xl shadow-lg shadow-orange-600/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-400 focus:outline-none cursor-pointer min-h-[48px]"
              >
                {t('exit_modal_cta')}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
