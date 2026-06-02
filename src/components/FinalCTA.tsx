import { openApplicationModal } from '../lib/events';

export default function FinalCTA() {
  return (
    <section className="py-12 md:py-16 px-6 flex justify-center">
      <div className="max-w-4xl mx-auto text-center w-full">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
          Ready to give your clients a true high-ticket experience?
        </h2>
        <p className="text-lg md:text-xl text-slate-400 mb-12 flex flex-col md:inline-block max-w-2xl mx-auto leading-relaxed">
          Your clients shouldn't have to search through messy messages, email threads, and spreadsheets to find your work. Give them a single, stunning, professional destination.
        </p>
        <div>
          <button onClick={openApplicationModal} className="inline-flex items-center justify-center px-8 py-5 font-bold text-sm tracking-tight bg-orange-600 text-white transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02] mb-8">
            Apply for Your Free Prototype →
          </button>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-md mx-auto block leading-relaxed font-mono">
          Free slots are highly competitive and reserved for serious providers with active operations.
        </p>
      </div>
    </section>
  );
}
