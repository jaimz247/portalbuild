import { useState } from 'react';
import { openApplicationModal } from '../lib/events';
import { Menu, X, Sun, Moon, Globe, Calendar } from 'lucide-react';
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

  const navigateToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', `/#${sectionId}`);
      window.dispatchEvent(new Event('popstate'));
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToPage = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className="w-full px-6 py-3 flex flex-row justify-between items-center sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.08]"
      >
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center justify-start">
          <button 
            type="button"
            aria-label="PortalBuild Home — a MorningCrest Solutions Company"
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group flex items-center gap-2.5 text-left cursor-pointer select-none relative z-50 bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg transition-all"
          >
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 group-hover:border-orange-500/40 flex items-center justify-center shrink-0 shadow-sm transition-colors">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 group-hover:scale-110 transition-transform" />
            </div>

            {/* Brand Title & Single Subtle Subtitle */}
            <div className="flex flex-col justify-center">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors leading-tight">
                PortalBuild
              </span>
              <span className="text-[9px] font-mono tracking-tight text-slate-500 -mt-0.5">
                a MorningCrest Solutions Company
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button 
            type="button" 
            onClick={() => navigateToSection('live-demo')} 
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Sample Portals
          </button>
          <button 
            type="button" 
            onClick={() => navigateToSection('operator-view')} 
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Operator Radar
          </button>
          <button 
            type="button" 
            onClick={() => navigateToSection('screens')} 
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            9 Screens
          </button>
          <button 
            type="button" 
            onClick={() => navigateToSection('pricing')} 
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Pricing
          </button>
          <button 
            type="button" 
            onClick={() => navigateToPage('/partners')} 
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Partners
          </button>
        </div>

        {/* Zone 3: Actions & Controls — Clean, Balanced, Unified */}
        <div className="hidden md:flex items-center gap-3">
          {/* Subtle Book Call Text Link (No bulky box) */}
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1.5 group"
            aria-label="Book a 20-minute portal fit call"
          >
            <span>Book Call</span>
            <span className="text-slate-500 text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>

          {/* Unified Utility Capsule: Language & Theme */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-slate-900/60 p-0.5 backdrop-blur-sm shadow-inner">
            <button 
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400 hover:text-white rounded-md hover:bg-white/[0.04] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
              aria-label={`Switch interface language to ${language === 'en' ? 'Spanish' : 'English'}`}
              title={`Switch interface language to ${language === 'en' ? 'Spanish' : 'English'}`}
            >
              <Globe className="w-3 h-3 text-slate-400" aria-hidden="true" />
              <span>{language.toUpperCase()}</span>
            </button>
            <div className="w-px h-3 bg-white/[0.08]" aria-hidden="true" />
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/[0.04] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
              aria-label={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
              title={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" aria-hidden="true" /> : <Sun className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />}
            </button>
          </div>

          {/* Premium Primary CTA */}
          <button 
            type="button"
            onClick={(e) => openApplicationModal(e)} 
            aria-label="Apply for free custom-branded portal preview"
            className="group relative inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 active:from-orange-600 active:to-orange-700 text-white font-semibold py-1.5 px-3.5 text-xs tracking-tight rounded-lg shadow-sm hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.35)] ring-1 ring-inset ring-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <span>{language === 'es' ? 'Obtener Vista Previa' : 'Get Free Preview'}</span>
            <span className="text-orange-200 group-hover:translate-x-0.5 transition-transform">→</span>
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
            {/* Mobile Brand Identity */}
            <div className="flex flex-col items-center justify-center gap-1 mb-4 pb-4 border-b border-white/[0.08] w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                </div>
                <span className="font-bold text-lg text-white">PortalBuild</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                a MorningCrest Solutions Company
              </span>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col items-center gap-3.5 mb-6 text-sm font-medium text-slate-200">
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  navigateToSection('live-demo');
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer py-1"
              >
                Sample Portals
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  navigateToSection('operator-view');
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer py-1"
              >
                Operator Radar
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  navigateToSection('screens');
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer py-1"
              >
                9 Screens
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  navigateToSection('pricing');
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer py-1"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  navigateToPage('/partners');
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer py-1"
              >
                Partner Program
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mb-6 text-center">
              <span>{t('nav_slots')}</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
