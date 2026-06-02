import { openAdminDashboard } from '../lib/events';

export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 shrink-0 max-w-6xl mx-auto w-full relative z-10">
      <div className="max-w-sm text-center md:text-left">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
          PortalBuild | Fast software. Zero developer bureaucracy. Premium retention.
        </p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
        <button 
          onClick={openAdminDashboard}
          className="text-[10px] text-orange-500/80 hover:text-orange-400 font-mono uppercase tracking-widest flex items-center gap-1 cursor-pointer bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 px-2.5 py-1 mb-1 transition-all rounded"
        >
          🔑 Admin Dashboard
        </button>
        <p className="text-[10px] text-slate-600 font-medium">© 2026 PortalBuild. All rights reserved.</p>
        <p className="text-[10px] text-slate-700 tracking-tighter">Operating internationally across Tier-1 high-ticket markets.</p>
      </div>
    </footer>
  );
}

