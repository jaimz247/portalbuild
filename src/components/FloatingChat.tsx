import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function FloatingChat() {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's already clicked, we still let the link action happen
    // We just want to trigger the animation temporarily
    if (!isClicked) {
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 2000);
    }
  };

  return (
    <a
      href="mailto:hello@example.com?subject=Quick%20question"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full pr-1.5 pl-4 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
    >
      <span className="text-[11px] font-bold text-slate-300 tracking-wider whitespace-nowrap group-hover:text-white transition-colors relative z-10 w-[110px] text-center">
        <AnimatePresence mode="wait">
          {isClicked ? (
            <motion.span
              key="success-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-orange-400 block"
            >
              {t('chat_opening')}
            </motion.span>
          ) : (
            <motion.span
              key="default-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="block"
            >
              {t('chat_widget_label')}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg relative z-10 transition-colors duration-300 ${isClicked ? 'bg-orange-500 border border-orange-500 text-white' : 'bg-orange-600/20 border border-orange-500/30'}`}>
        <AnimatePresence mode="wait">
           {isClicked ? (
             <motion.div
               key="success-icon"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0 }}
             >
               <Check className="w-5 h-5 text-white" />
             </motion.div>
           ) : (
             <motion.div
               key="chat-icon"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0 }}
             >
               💬
             </motion.div>
           )}
        </AnimatePresence>
      </div>
      
      {/* Ripple Effect */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute right-6 w-10 h-10 bg-orange-500 rounded-full z-0"
          />
        )}
      </AnimatePresence>
    </a>
  );
}
