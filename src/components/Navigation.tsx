import { useState } from 'react';
import { openApplicationModal, openAdminDashboard } from '../lib/events';
import { Menu, X, Sun, Moon, Globe, Calendar, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../context/LanguageContext';

const CAL_URL = 'https://cal.com/morningcrest/portal-fit-call';

interface NavigationProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export default function Navigation({ theme = 'dark', toggleTheme }: NavigationProps) {
  const { language, setLanguage, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className="w-full px-6 py-3.5 flex flex-row justify-between items-center sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.08]"
      >
        <div className="flex-1 flex items-center justify-start">
          <button 
            type="button"
            aria-label="PortalBuild Home — Scroll to top of page"
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-white cursor-pointer select-none relative z-50 bg-transparent border-0 p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            </div>
            <span className="font-bold tracking-tight text-white">
              PortalBuild
            </span>
          </button>
        </div>
        <div className="flex-1 hidden md:flex justify-center flex-wrap items-center gap-6 text-[11px] font-mono tracking-wider uppercase text-slate-400">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400/80"></span>
            <span>{t('nav_slots')}</span>
          </span>
        </div>
        <div className="flex-1 hidden md:flex justify-end items-center gap-3">
          {/* L10n Switcher */}
          <button 
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/20 bg-slate-900/40 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label={`Switch interface language to ${language === 'en' ? 'Spanish' : 'English'}`}
            title={`Switch interface language to ${language === 'en' ? 'Spanish' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/20 bg-slate-900/40 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
            title={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900" aria-hidden="true" /> : <Sun className="w-4 h-4 text-orange-400" aria-hidden="true" />}
          </button>

          {/* Admin Dashboard Quick Access Button */}
          <button
            type="button"
            onClick={(e) => openAdminDashboard(e)}
            className="p-2 text-slate-400 hover:text-orange-400 border border-white/[0.06] hover:border-orange-500/30 bg-slate-900/40 hover:bg-orange-500/10 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Admin Control Center (Shift+A or /admin)"
            title="Admin Control Center (Shift+A or /admin)"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Book 20-Min Fit Call Link */}
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-slate-900/50 hover:bg-slate-800/80 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
            <span>Book Call</span>
            <span className="text-slate-500 text-[10px]">↗</span>
          </a>

          <button 
            type="button"
            onClick={(e) => openApplicationModal(e)} 
            aria-label="Apply for free custom-branded portal preview"
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium py-2 px-4 text-xs tracking-tight rounded-lg shadow-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <span>{t('nav_apply')}</span>
          </button>
        </div>
        
        {/* Mobile Hamburger Icon */}
        <div className="flex md:hidden justify-end flex-1 relative z-50">
          <button 
            type="button"
            onClick={toggleMobileMenu} 
            className="p-2 text-slate-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            role="region"
            aria-label="Mobile Navigation Menu"
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
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                aria-label={`Switch interface language to ${language === 'en' ? 'Spanish' : 'English'}`}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Globe className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>{language === 'en' ? 'English' : 'Español'}</span>
              </button>

              {/* Theme */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-orange-400" aria-hidden="true" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
            
            <button 
              type="button"
              onClick={(e) => {
                toggleMobileMenu();
                openApplicationModal(e);
              }} 
              aria-label="Open application form for free custom portal preview"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 text-sm uppercase tracking-widest transition-all duration-300 w-full rounded-xl shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              {t('nav_apply')}
            </button>

            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={toggleMobileMenu}
              className="mt-4 flex items-center justify-center gap-2 py-3 px-6 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors w-full cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Prefer to talk first? Book 20-Min Call ↗</span>
            </a>

            <button
              type="button"
              onClick={(e) => {
                toggleMobileMenu();
                openAdminDashboard(e);
              }}
              className="mt-3 flex items-center justify-center gap-2 py-2.5 px-6 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-orange-400 border border-white/5 hover:border-white/15 bg-slate-900/50 rounded-xl transition-colors w-full cursor-pointer"
            >
              <Shield className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Admin Portal Access (Shift+A)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
