import { X, Check } from 'lucide-react';

export default function Transformation() {
    const befores = [
      "Clients dig through chaotic WhatsApp threads and emails.",
      "Data is outdated because files must be updated manually.",
      "Rows and rows of spreadsheets with zero visual context.",
      "Sending repetitive reminders and repeating instructions.",
      "Looks like a basic shared folder, lowering your perceived value."
    ];

  const afters = [
    "One secure dashboard accessible on any device, anywhere.",
    "Live data and workflows integrated from your tools automatically.",
    "Clean visual KPI cards, task trackers, and onboarding steps.",
    "Built-in progress tracking and clear, automated direction.",
    "Custom domain, colors, and logo that feel like your software."
  ];

  return (
    <section className="py-12 md:py-16 px-6 border-y border-white/5 relative flex justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block">The Difference</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            High-Contrast Visibility: Before vs. After
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-20">
          {/* Before */}
          <div className="bg-red-950/20 border border-red-900/30 text-slate-400 p-10 md:p-12 relative flex flex-col h-full hover:border-red-900/50 transition-colors">
            <h3 className="text-[12px] font-bold text-red-500 mb-10 flex items-center gap-3 uppercase tracking-widest font-mono">
              <span className="flex items-center justify-center w-5 h-5 bg-red-900/30 text-red-500"><X className="w-3.5 h-3.5" /></span>
              Current State ❌
            </h3>
            <ul className="space-y-6">
              {befores.map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start text-slate-400">
                  <span className="text-red-900/50 mt-0.5 select-none font-mono">--</span>
                  <span className="leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-slate-900/60 border border-white/10 text-white p-10 md:p-12 relative flex flex-col h-full z-10 hover:border-white/30 transition-colors">
            <h3 className="text-[12px] font-bold text-white mb-10 flex items-center gap-3 uppercase tracking-widest font-mono">
              <span className="flex items-center justify-center w-5 h-5 bg-orange-500/20 text-orange-500"><Check className="w-3.5 h-3.5" /></span>
              With Your Portal ✅
            </h3>
            <ul className="space-y-6">
              {afters.map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start text-white">
                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <blockquote className="border-l border-orange-500/50 pl-8 py-2 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-slate-300 font-medium tracking-tight leading-relaxed">
            "The Real Bottom Line: Your business operations feel mature and organized, your clients feel flawlessly guided, and your offer commands a higher premium."
          </p>
        </blockquote>
      </div>
    </section>
  );
}
