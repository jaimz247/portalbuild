import { openApplicationModal } from '../lib/events';

interface FinalCTAProps {
  onOpenModal?: () => void;
}

export default function FinalCTA({ onOpenModal }: FinalCTAProps) {
  const handleCTA = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal();
    }
  };

  return (
    <section id="final-cta" className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-white/10 relative overflow-hidden">
      <span id="preview" className="absolute -top-12 opacity-0 pointer-events-none" aria-hidden="true"></span>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-6">
          <span>Your Next Cohort Home</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Ready to stop losing members you could have saved?
        </h2>

        <p className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get a free, custom-branded portal preview built from your program page in 24 hours. No call required, no credit card, no obligation.
        </p>

        <div className="flex flex-col items-center">
          <button
            onClick={handleCTA}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold tracking-tight bg-orange-600 hover:bg-orange-500 text-white rounded-md shadow-xl shadow-orange-600/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer min-h-[52px]"
          >
            Get my free portal preview
          </button>
          
          <p className="text-xs md:text-sm text-slate-400 mt-4 font-medium">
            Free. No call required. No card. You keep the preview.
          </p>
        </div>
      </div>
    </section>
  );
}

