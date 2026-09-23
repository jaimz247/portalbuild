import { openAdminDashboard } from '../lib/events';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center md:items-end gap-6 shrink-0 max-w-6xl mx-auto w-full relative z-10">
      <div className="max-w-xl text-center md:text-left">
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
          PortalBuild // Fast software. Zero developer bureaucracy. Premium retention.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-xs text-slate-400">
          <a
            href="https://cal.com/morningcrest/portal-fit-call"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 font-mono font-medium transition-colors"
          >
            Book 20-Min Fit Call ↗
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Terms of Service
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/admin');
              window.dispatchEvent(new Event('popstate'));
              openAdminDashboard();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-orange-400 font-mono text-xs transition-all cursor-pointer"
            title="PortalBuild Admin Workspace & Control Center (/admin or Shift+A)"
          >
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Admin Portal</span>
            <kbd className="text-[10px] text-slate-400 bg-slate-950 border border-white/10 px-1 py-0.5 rounded font-mono">Shift+A</kbd>
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right font-mono">
        <p className="text-[11px] text-slate-500">
          © 2026 PortalBuild · A MorningCrest Solutions LLC business. All rights reserved.
        </p>
        <p className="text-[10px] text-slate-500/80 tracking-tight">London · New York · San Francisco · Melbourne · Serving cohort programs worldwide</p>
      </div>
    </footer>
  );
}

