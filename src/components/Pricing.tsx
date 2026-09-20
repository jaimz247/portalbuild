import { useEffect } from 'react';
import { Check, Calendar } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { openApplicationModal } from '../lib/events';
import { trackPricingView } from '../lib/analytics';

const CAL_URL = 'https://cal.com/morningcrest/portal-fit-call';

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
      qualifier: "For one program running one cohort at a time",
      price: "$1,997",
      sub: "one-time",
      timeline: "Live before day one",
      monthly: "$297/mo · 3-month minimum, then cancel anytime",
      features: [
        "Complete 9-screen member portal and operator dashboard",
        "Your branding, your modules, your dates, your domain",
        "Member welcome sequence written for your first cohort",
        "Two revision rounds and a full handover walkthrough",
        "Member progress and attendance refreshed fortnightly",
        "At-risk members flagged against thresholds you set",
        "One change request per month, 72-hour response"
      ],
      highlight: false,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Signature",
      pop: "Most Popular",
      qualifier: "For one program running cohorts back to back",
      price: "$3,497",
      sub: "one-time",
      timeline: "Live before day one",
      monthly: "$497/mo · 3-month minimum, then cancel anytime",
      features: [
        "Everything in Essential, plus:",
        "Alumni access retained between cohorts",
        "Cohort rollover configured from day one",
        "Custom operator health rules and flag thresholds",
        "Progress refreshed weekly, plus a Monday note naming anyone who's gone quiet — with the check-in already drafted",
        "Every new cohort set up for you. No setup fee, ever.",
        "Module, asset and curriculum updates included",
        "Three change requests per month, 48-hour response"
      ],
      highlight: true,
      ctaText: "Get my free portal preview"
    },
    {
      name: "Scale",
      qualifier: "For multiple programs, or cohorts running concurrently",
      price: "$5,997",
      sub: "one-time",
      timeline: "Live before day one",
      monthly: "$797/mo · 3-month minimum, then cancel anytime",
      features: [
        "Everything in Signature, plus:",
        "Up to three distinct programs on one portal",
        "Multi-cohort operator view with cross-cohort comparison",
        "Custom screens beyond the standard nine",
        "Priority build slot",
        "Progress refreshed weekly across every active cohort",
        "Five change requests per month, 24-hour response",
        "A quarterly review call"
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl">
          <button
            type="button"
            onClick={(e) => handleCTA('Bottom Pricing CTA', e)}
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-8 py-4 text-base font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors cursor-pointer min-h-[48px] w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
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
        <p className="text-xs text-slate-400 mt-3 font-mono">
          Free preview in 24h · No credit card required · Or book 20 minutes to discuss your custom setup
        </p>
      </div>
    </section>
  );
}
