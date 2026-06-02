import { openApplicationModal } from '../lib/events';

export default function Sprint() {
  const steps = [
    {
      step: "01",
      title: "Submit the 5-Minute Application",
      desc: "Tell us about your business, your current workflow, and what feels messy or manual. We review it and confirm your application within 24 hours."
    },
    {
      step: "02",
      title: "15-Minute Fit Call",
      desc: "A short, zero-pitch scoping conversation to understand your client journey, resources, and specific expectations."
    },
    {
      step: "03",
      title: "The 72-Hour Custom Build",
      desc: "We build a real, clickable prototype matching your visual identity. Your logo, your colors, and your actual client data structure—not a generic template."
    },
    {
      step: "04",
      title: "You See It. You Decide.",
      desc: "We walk you through the portal layout via a short screen-share. If it solves your problem, we talk about the full deployment. If it doesn't, you walk away with zero obligations."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto relative" id="sprint">
      <div className="text-center mb-16">
        <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block">How it works</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
          A working client portal in 3 days. Not 3 months.
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Most businesses spend months evaluating complex enterprise software, waiting on expensive developer quotes, or settling for generic tools that almost fit. There is a faster path. We translate your existing, repeatable delivery process into a clean, professional, branded home for your clients—and let you see it live before you spend a single dollar.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-16">
        {steps.map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start text-left hover:border-orange-500/50 transition-colors">
            <div className="text-[10px] text-orange-500 font-mono mb-6 uppercase tracking-widest border-b border-orange-500/20 pb-2 w-full">
              Step {item.step}
            </div>
            <h3 className="text-slate-200 font-bold tracking-tight text-lg mb-3">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center">
         <button onClick={openApplicationModal} className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 font-bold text-sm tracking-tight transition-all duration-300 hover:bg-orange-700 hover:scale-[1.02]">
           Apply for Your Free Prototype →
         </button>
      </div>
    </section>
  );
}
