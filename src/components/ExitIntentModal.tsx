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
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-lg bg-slate-900 border border-white/10 p-8 md:p-10 shadow-2xl relative z-10 text-center"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-orange-500 focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto bg-orange-600/20 text-orange-500 flex items-center justify-center rounded-full mb-6 border border-orange-500/30">
               <Play className="w-6 h-6 ml-1" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-4">
              {t('exit_modal_demo_title')}
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {t('exit_modal_demo_desc')}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="email" 
                required
                aria-label="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('exit_modal_input_placeholder')}
                className="w-full bg-slate-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg transition-colors text-sm"
              />
              <button 
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-4 text-sm tracking-tight rounded-lg transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-orange-400 focus:outline-none cursor-pointer"
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
