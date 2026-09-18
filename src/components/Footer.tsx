export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 shrink-0 max-w-6xl mx-auto w-full relative z-10">
      <div className="max-w-sm text-center md:text-left">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
          PortalBuild | Fast software. Zero developer bureaucracy. Premium retention.
        </p>
        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-xs font-medium text-slate-400">
          <a
            href="/logos"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/logos');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors cursor-pointer"
          >
            Brand &amp; Logo Kit
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="hover:text-orange-400 transition-colors cursor-pointer"
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
            className="hover:text-orange-400 transition-colors cursor-pointer"
          >
            Terms of Service
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
        <p className="text-[10px] text-slate-500 font-medium">© 2026 PortalBuild. All rights reserved.</p>
        <p className="text-[10px] text-slate-400 tracking-normal">London · New York · San Francisco · Melbourne · Serving cohort programs worldwide</p>
      </div>
    </footer>
  );
}

