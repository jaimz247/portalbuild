import { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { openApplicationModal } from '../lib/events';
import { trackPricingView } from '../lib/analytics';

interface PricingProps {
  onOpenModal?: () => void;
}

export default function Pricing({ onOpenModal }: PricingProps) {
  useEffect(() => {
    trackPricingView('Pricing Section Viewed');
  }, []);

  const handleCTA = (tierName?: string) => {
    trackPricingView(tierName || 'Pricing CTA Click');
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal();
    }
  };

  const cards = [
    {
      name: "Free Preview",
      qualifier: "Explore your custom interface",
      price: "$0",
      sub: "No credit card required",
      timeline: "Delivered in 24 hours",
      monthly: null,
      features: [
        "High-fidelity portal preview built from your sales page URL",
        "Sample 9-screen member interface layout with your logo & colors",
        "Interactive walk-through recording & live staging link",
        "Zero obligation — you keep the preview regardless"
      ],
      highlight: false,
      ctaText: "Get Free Preview"
    },
    {
      name: "Essential",
      qualifier: "One program, one cohort at a time",
      price: "$1,997",
      sub: "One-time flat project fee",
      timeline: "Live before your next cohort starts",
      monthly: "Then $297/month · optional, cancel or pause anytime",
      features: [
        "Complete 9-screen member home & operator command dashboard",
        "Custom domain configuration (portal.yourdomain.com)",
        "Database setup for member progress & deliverable submissions",
        "Automated operator inactivity alerts & at-risk flags",
        "Full mobile-responsive optimization across all screens",
        "2 revision rounds included",
        "30 days of post-launch technical support"
      ],
      highlight: false,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Signature",
      pop: "Most Popular",
      qualifier: "One program, running cohorts back to back",
      price: "$3,497",
      sub: "One-time flat project fee",
      timeline: "Live before your next cohort starts",
      monthly: "Then $497/month · optional, cancel or pause anytime",
      features: [
        "Everything in Essential",
        "New cohort rollover setup & member database resets",
        "Alumni access retained between cohorts",
        "Custom operator health rules and thresholds",
        "Priority 24-hour turnaround on interface modifications",
        "Module updates, asset additions & curriculum shifts included"
      ],
      highlight: true,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Scale",
      qualifier: "Multiple programs, or concurrent cohorts",
      price: "$5,997",
      sub: "One-time flat project fee",
      timeline: "Live before your next cohort starts",
      monthly: "Then $797/month · optional, cancel or pause anytime",
      features: [
        "Everything in Signature",
        "Multiple programs under one operator dashboard",
        "Concurrent cohort views with cross-cohort comparison",
        "Custom screens beyond the standard nine",
        "Direct line for same-day changes during live cohorts"
      ],
      highlight: false,
      ctaText: "Get my free portal preview"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="pricing">
      {/* Promotional Banner */}
      <div className="mb-12 max-w-3xl mx-auto p-4 rounded-xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-orange-950/80 border border-orange-500/40 text-center shadow-lg flex items-center justify-center gap-3">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 animate-pulse" />
        <p className="text-sm md:text-base font-bold text-white tracking-wide">
          Founding rate: <span className="text-orange-400">$500 off your build, for the next five clients.</span>
        </p>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
          <span>Transparent Pricing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Flat fees. No open-ended hourly logs.
        </h2>
        <p className="text-slate-300 text-base md:text-lg">
          You are investing in member retention, luxury presentation, and an operator asset.
        </p>
      </div>

      {/* Pricing Cards Grid (4 columns) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl flex flex-col p-6 transition-all duration-300 ${
              card.highlight
                ? 'bg-slate-900/90 border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.18)] z-10 lg:scale-[1.02]'
                : 'bg-slate-900/50 border border-white/10 hover:border-white/20'
            }`}
          >
            {card.pop && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-md whitespace-nowrap">
                {card.pop}
              </span>
            )}

            <div className="mb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 font-mono mb-1.5">{card.name}</h3>
              {card.qualifier && (
                <p className="text-xs italic text-slate-300 font-medium mb-3 min-h-[32px] leading-snug">
                  {card.qualifier}
                </p>
              )}
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{card.price}</div>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              {card.monthly && (
                <p className="text-xs font-semibold text-orange-400/90 mt-1.5 leading-snug">
                  {card.monthly}
                </p>
              )}
            </div>

            <div className="text-xs font-semibold text-orange-400 mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
              <span>⚡ {card.timeline}</span>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {card.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCTA(card.name)}
              className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs md:text-sm tracking-tight transition-all duration-300 cursor-pointer min-h-[44px] ${
                card.highlight
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {card.ctaText}
            </button>
          </div>
        ))}
      </div>

      {/* Sponsor-funded qualifier line */}
      <p className="text-center text-xs md:text-sm text-slate-400 italic max-w-3xl mx-auto mb-12 leading-relaxed">
        Running a sponsor-funded accelerator or fellowship? Pricing works differently for programs with no per-member fee — mention it when you request your preview.
      </p>

      {/* Value Framing Box */}
      <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center mb-12">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          "Save one member from dropping out and your portal has paid for itself."
        </h3>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          At a $3,000 – $10,000 cohort ticket size, retaining just a single member who would have quietly checked out in week three covers the entire cost of your portal. Everything after that is pure margin and improved program reputation.
        </p>
      </div>

      {/* CTA #3 */}
      <div className="text-center">
        <button
          onClick={() => handleCTA('Bottom Pricing CTA')}
          className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 text-base md:text-lg font-bold tracking-tight rounded-md shadow-lg shadow-orange-600/25 transition-all duration-300 cursor-pointer min-h-[48px]"
        >
          Get my free portal preview
        </button>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Free. No credit card required. Built from your public page in 24 hours.
        </p>
      </div>
    </section>
  );
}


