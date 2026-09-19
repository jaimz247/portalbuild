import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { openApplicationModal } from '../lib/events';
import { trackPricingView } from '../lib/analytics';

interface PricingProps {
  onOpenModal?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Pricing({ onOpenModal }: PricingProps) {
  useEffect(() => {
    trackPricingView('Pricing Section Viewed');
  }, []);

  const handleCTA = (tierName?: string, e?: React.MouseEvent) => {
    trackPricingView(tierName || 'Pricing CTA Click');
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
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
        "Interactive portal preview built from your sales page URL",
        "Full 9-screen member interface configured with your branding",
        "Video walkthrough & private staging link",
        "Zero obligation — yours to review and keep"
      ],
      highlight: false,
      ctaText: "Get Free Preview"
    },
    {
      name: "Essential",
      qualifier: "One program, one cohort at a time",
      price: "$1,997",
      sub: "One-time flat build fee",
      timeline: "Live before day one",
      monthly: "Optional $297/mo hosting & support · cancel anytime",
      features: [
        "Complete 9-screen member portal & operator command center",
        "Custom domain setup (portal.yourdomain.com)",
        "Database provisioning for member progress tracking",
        "Operator telemetry alerts & inactivity notifications",
        "Responsive desktop, tablet, and mobile layout",
        "Two revision cycles included",
        "30 days of direct launch support"
      ],
      highlight: false,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Signature",
      pop: "Most Popular",
      qualifier: "One program, running back-to-back cohorts",
      price: "$3,497",
      sub: "One-time flat build fee",
      timeline: "Live before day one",
      monthly: "Optional $497/mo hosting & support · cancel anytime",
      features: [
        "Everything included in Essential",
        "Cohort rollover architecture & clean database resets",
        "Retained alumni access between cohorts",
        "Custom operator health rules and threshold flags",
        "Priority 24-hour turnaround on interface modifications",
        "Ongoing curriculum, module, and asset adjustments"
      ],
      highlight: true,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Scale",
      qualifier: "Multiple programs or concurrent cohorts",
      price: "$5,997",
      sub: "One-time flat build fee",
      timeline: "Live before day one",
      monthly: "Optional $797/mo hosting & support · cancel anytime",
      features: [
        "Everything included in Signature",
        "Multiple distinct programs under one operator view",
        "Concurrent cohort views and cross-cohort progress metrics",
        "Custom screen extensions tailored to your workflow",
        "Direct emergency channel for same-day changes"
      ],
      highlight: false,
      ctaText: "Get my free portal preview"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="pricing">
      {/* Founding Offer Note */}
      <div className="mb-10 max-w-2xl mx-auto px-4 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center text-xs font-mono text-orange-300">
        Founding Cohort: $500 reduction applied for the next five program builds.
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
          Pricing Structure
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
          Flat project fees. No open-ended hourly billing.
        </h2>
        <p className="text-slate-300/80 text-base md:text-lg">
          An upfront investment in member retention, operational clarity, and program presentation.
        </p>
      </div>

      {/* Pricing Cards Grid (4 columns) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-8"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className={`relative rounded-xl flex flex-col p-6 transition-colors duration-200 ${
              card.highlight
                ? 'bg-slate-900/80 border border-orange-500/40 shadow-xl'
                : 'bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16]'
            }`}
          >
            {card.pop && (
              <span className="absolute top-4 right-4 bg-orange-500/10 text-orange-400 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-orange-500/20 tracking-wide uppercase">
                {card.pop}
              </span>
            )}

            <div className="mb-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-400 font-mono mb-1.5">{card.name}</h3>
              {card.qualifier && (
                <p className="text-xs text-slate-300/80 mb-3 min-h-[32px] leading-snug">
                  {card.qualifier}
                </p>
              )}
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{card.price}</div>
              <p className="text-xs text-slate-400 mt-1 font-mono">{card.sub}</p>
              {card.monthly && (
                <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                  {card.monthly}
                </p>
              )}
            </div>

            <div className="text-xs font-mono text-slate-400 mb-5 pb-3 border-b border-white/[0.06]">
              <span>Timeline: {card.timeline}</span>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {card.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={(e) => handleCTA(card.name, e)}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs md:text-sm tracking-tight transition-colors cursor-pointer min-h-[44px] flex items-center justify-center ${
                card.highlight
                  ? 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
              }`}
            >
              <span>{card.ctaText}</span>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Sponsor-funded qualifier line */}
      <p className="text-center text-xs text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-mono">
        Running a sponsor-funded accelerator or fellowship? Mention it in your application for adjusted institutional pricing.
      </p>

      {/* Value Framing Box */}
      <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-xl bg-slate-900/40 border border-white/[0.08] text-center mb-12">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
          "Retaining one member covers the cost of your portal."
        </h3>
        <p className="text-slate-300/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          At standard high-ticket cohort tuition ($3,000 – $10,000), intervening before a single student checks out covers your entire build. Everything beyond that improves margin and referral reputation.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center flex flex-col items-center">
        <button
          type="button"
          onClick={(e) => handleCTA('Bottom Pricing CTA', e)}
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-8 py-4 text-base font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span>Get my free portal preview</span>
        </button>
        <p className="text-xs text-slate-400 mt-2.5 font-mono">
          Free. No credit card required. Built from your public page in 24 hours.
        </p>
      </div>
    </section>
  );
}
