import { ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      itemScope 
      itemType="https://schema.org/WPFooter"
      className="border-t border-white/[0.08] bg-slate-950/60 relative z-10"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Top Brand & Mission Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/[0.06]">
          {/* Logo & Corporate Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                PortalBuild
              </span>
              <p className="text-[10px] font-mono text-slate-500 tracking-tight">
                a <span itemProp="copyrightHolder">MorningCrest Solutions</span> Company
              </p>
            </div>
          </div>

          {/* Theme Quick Switcher & Value Prop Tagline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:justify-end w-full md:w-auto">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 bg-slate-900/60 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Switch to Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-orange-400" />
                  <span>Switch to Light Theme</span>
                </>
              )}
            </button>
            <p className="text-[11px] font-mono text-slate-500 tracking-wide uppercase text-left md:text-right">
              Fast software · Zero bureaucracy · Member retention
            </p>
          </div>
        </div>

        {/* Middle Legal Navigation & Alignment Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Aligned Legal & Navigation Links */}
          <nav aria-label="Legal and Administrative Navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-mono text-slate-400">
            <button
              type="button"
              onClick={() => navigate('/privacy')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Privacy Policy
            </button>
            <span className="text-slate-800 select-none">•</span>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Terms of Service
            </button>
            <span className="text-slate-800 select-none">•</span>
            <a
              href="/partners"
              onClick={(e) => {
                e.preventDefault();
                navigate('/partners');
              }}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Partner Program
            </a>
            <span className="text-slate-800 select-none">•</span>
            <a
              href="https://cal.com/morningcrest/portal-fit-call"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Book Fit Call</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Operations & Locations */}
          <div className="text-left lg:text-right font-mono space-y-1">
            <p className="text-[11px] text-slate-500">
              © 2026 PortalBuild · A MorningCrest Solutions LLC company. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600">
              Serving cohort programmes in the US, UK, Canada and Australia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

