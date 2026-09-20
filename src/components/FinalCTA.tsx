import { openApplicationModal } from '../lib/events';
import { Calendar } from 'lucide-react';

const CAL_URL = 'https://cal.com/morningcrest/portal-fit-call';

interface FinalCTAProps {
  onOpenModal?: () => void;
}

export default function FinalCTA({ onOpenModal }: FinalCTAProps) {
  const handleCTA = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  return (
    <section 
      id="final-cta" 
      aria-labelledby="final-cta-heading"
      className="py-20 md:py-28 px-6 bg-slate-950 border-t border-white/[0.08] relative"
    >
      <span id="preview" className="absolute -top-12 opacity-0 pointer-events-none" aria-hidden="true"></span>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Ready for your next cohort
        </p>

        <h2 
          id="final-cta-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          Ready to stop losing members you could have saved?
        </h2>

        <p className="text-base md:text-lg text-slate-300/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get a free, custom-branded portal preview built from your program page in 24 hours. No call required, no credit card, no obligation.
        </p>

        <div className="flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl">
            <button
              type="button"
              onClick={handleCTA}
              aria-label="Get my free custom portal preview built in 24 hours"
              className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold tracking-tight bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-xl border border-orange-400/30 shadow-sm transition-colors cursor-pointer min-h-[48px] w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <span>Get my free portal preview</span>
            </button>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm md:text-base font-medium tracking-tight bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-white/[0.12] hover:border-white/25 transition-all cursor-pointer min-h-[48px] w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <Calendar className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Book 20-Min Fit Call</span>
              <span className="text-slate-500 text-xs">↗</span>
            </a>
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 mt-4 font-mono">
            Free preview in 24h · No call required · Or book 20 minutes if you prefer to speak first
          </p>
        </div>
      </div>
    </section>
  );
}
