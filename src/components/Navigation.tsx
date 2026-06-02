import { useState } from 'react';
import { openApplicationModal } from '../lib/events';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../context/LanguageContext';

interface NavigationProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navigation({ theme, toggleTheme }: NavigationProps) {
  const { language, setLanguage, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/5">
        <div className="flex-1 flex items-center justify-start">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-4 text-white cursor-pointer group select-none relative z-50">
            <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl group-hover:bg-orange-500/40 group-hover:blur-2xl transition-all duration-700 ease-out"></div>
              
              <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-xl group-hover:rotate-90 group-hover:border-orange-500/30 transition-all duration-700 ease-in-out bg-slate-900/50 backdrop-blur-sm z-10"></div>
              
              <div className="absolute inset-[4px] border-t-2 border-r-2 border-orange-500 rounded-[6px] group-hover:-rotate-90 transition-transform duration-700 ease-out z-20"></div>
              
              <div className="absolute inset-[4px] border-b-2 border-l-2 border-orange-500/30 rounded-[6px] group-hover:-rotate-90 transition-transform duration-700 ease-out z-20"></div>
              
              <div className="relative w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-orange-400 group-hover:shadow-[0_0_8px_rgba(249,115,22,1)] transition-all duration-500 z-30"></div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-colors duration-500 tracking-tight">PortalBuild</span>
          </div>
        </div>
        <div className="flex-1 hidden md:flex justify-center flex-wrap items-center gap-6 text-[11px] font-medium tracking-[0.1em] uppercase text-slate-400">
          <span className="flex items-center gap-2">🟠 {t('nav_slots')}</span>
        </div>
        <div className="flex-1 hidden md:flex justify-end items-center gap-4">
          {/* L10n Switcher */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-transparent hover:border-white/10 rounded transition-all cursor-pointer"
            aria-label="Switch Language"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white border border-transparent hover:border-white/10 rounded transition-all cursor-pointer"
            aria-label="Toggle Theme"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900" /> : <Sun className="w-4 h-4 text-orange-400" />}
          </button>

          <button onClick={openApplicationModal} className="bg-orange-600 text-white font-bold py-2.5 px-6 text-xs uppercase tracking-widest transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02]">
            {t('nav_apply')}
          </button>
        </div>
        
        {/* Mobile Hamburger Icon */}
        <div className="flex md:hidden justify-end flex-1 relative z-50">
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[73px] bg-slate-950/95 backdrop-blur-xl border-b border-white/10 z-40 md:hidden flex flex-col items-center justify-start p-8 shadow-2xl"
          >
            <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-slate-400 mb-6 text-center flex flex-col gap-2">
              <span className="text-orange-500 font-bold">🟠 {t('nav_slots_claimed')}</span>
              <span>{t('nav_slots_remaining')}</span>
            </div>

            {/* Mobile Controls Suite */}
            <div className="flex items-center justify-center gap-6 mb-8 w-full border-y border-white/10 py-4">
              {/* L10n */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 rounded transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{language === 'en' ? 'English' : 'Español'}</span>
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 rounded transition-all cursor-pointer"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-slate-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-orange-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
            
            <button 
              onClick={(e) => {
                toggleMobileMenu();
                openApplicationModal(e);
              }} 
              className="bg-orange-600 text-white font-bold py-4 px-8 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-orange-700 w-full"
            >
              {t('nav_apply')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
