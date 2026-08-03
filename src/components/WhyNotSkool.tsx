import { X, Check } from 'lucide-react';

export default function WhyNotSkool() {
  const comparisons = [
    {
      category: "Skool & Circle",
      type: "Generic Community Platforms",
      cons: [
        "Social feeds dilute your core curriculum — members get distracted by random noise and off-topic posts.",
        "Your brand is buried under their platform UI, colors, and URL structure.",
        "Zero operator tracking — you have no idea who is actually consuming modules or falling behind."
      ],
      badgeClass: "border-rose-500/30 bg-rose-950/20 text-rose-400"
    },
    {
      category: "Kajabi & Teachable",
      type: "Legacy Course Lockers",
      cons: [
        "Glorified video libraries designed for $47 self-study courses, not $5,000+ cohort masterminds.",
        "Zero cohort progress mechanics, milestone pacing, or peer accountability structures.",
        "Clunky 2015-era interface that damages perception of high-ticket value."
      ],
      badgeClass: "border-amber-500/30 bg-amber-950/20 text-amber-400"
    },
    {
      category: "Your Custom Portal",
      type: "High-Ticket Member Home",
      pros: [
        "100% focused member experience — zero community feed noise, distraction-free curriculum.",
        "Your domain, your brand, your logo, and custom luxury styling.",
        "Built-in Operator Radar: Automated alerts flagging at-risk members in week 3 so you save non-renewals."
      ],
      badgeClass: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
      highlight: true
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="why-not-skool">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
          <span>Platform Comparison</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Why Not Skool, Circle, or Kajabi?
        </h2>
        <p className="text-slate-300 text-base md:text-lg">
          High-ticket cohort programs fail on low-ticket infrastructure. Here is why generic tools cost you member retention.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {comparisons.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
              item.highlight
                ? 'bg-slate-900/90 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative scale-[1.02] z-10'
                : 'bg-slate-900/50 border border-white/10'
            }`}
          >
            <div>
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${item.badgeClass}`}>
                  {item.category}
                </span>
                <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider">{item.type}</p>
              </div>

              {item.cons && (
                <ul className="space-y-4 mb-6">
                  {item.cons.map((con, cidx) => (
                    <li key={cidx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                      <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.pros && (
                <ul className="space-y-4 mb-6">
                  {item.pros.map((pro, pidx) => (
                    <li key={pidx} className="flex items-start gap-3 text-xs md:text-sm text-white font-medium leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {item.highlight && (
              <div className="pt-4 border-t border-emerald-500/20 text-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  ✓ Purpose-built for cohort retention
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
