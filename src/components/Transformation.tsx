import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { openApplicationModal } from '../lib/events';

interface TransformationProps {
  onOpenModal?: () => void;
}

export default function Transformation({ onOpenModal }: TransformationProps) {
  const handleCTA = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 border-y border-white/[0.08] bg-slate-950/60 relative" id="operator-view">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
            Operator Radar
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            See who's falling behind. In week three, not week nine.
          </h2>
          <p className="text-slate-300/80 text-base md:text-lg leading-relaxed">
            When a member stops opening modules in week three, your operator radar flags them immediately. Intervene while there is still time to protect their outcome, before they turn into a silent non-renewal or refund request.
          </p>
        </div>

        {/* Visual Console */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-slate-900/40 p-5 md:p-8 overflow-hidden mb-12 shadow-2xl">
          {/* Top Bar of Console */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5 mb-8 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base tracking-tight font-sans">
                  Cohort 8 Operator Radar
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">32 Total Members · Active 12-Week Sequence</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded bg-slate-800/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>28 On Track</span>
              </div>
              <div className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/20 text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>2 Inactive Flagged</span>
              </div>
            </div>
          </div>

          {/* Operator Radar Optimized AVIF/WebP Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-white/[0.06] bg-slate-950/80 shadow-md">
            <picture>
              <source
                type="image/avif"
                srcSet="/images/operator-radar.avif 1x, /images/operator-radar-2x.avif 2x"
              />
              <source
                type="image/webp"
                srcSet="/images/operator-radar.webp 1x, /images/operator-radar-2x.webp 2x"
              />
              <img
                src="/images/operator-radar.webp"
                width={800}
                height={500}
                alt="PortalBuild Operator Radar Member Health Dashboard"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover rounded-xl"
              />
            </picture>
          </div>

          {/* Grid Layout of Operator Dashboard */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Flagged Members */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Priority Action List
                </h4>
                <span className="text-[11px] text-rose-400 font-mono">2 Interventions Needed</span>
              </div>

              {/* Member Card 1 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] hover:border-white/[0.16] transition-colors space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 border border-white/10 text-slate-200 flex items-center justify-center font-bold text-xs font-mono">
                      ER
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm">Elena Rostova</h5>
                      <p className="text-[11px] text-slate-400 font-mono">Mastermind Cohort · Joined Sep 1</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[10px]">
                    6 Days Inactive
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-white/[0.06] text-xs text-slate-300 space-y-1">
                  <p className="text-rose-300 font-medium">Trigger: Inactive on Module 3 for 6 days.</p>
                  <p className="text-slate-400">Last activity: Viewed 'Module 2 Wrap-up'. Zero submissions for Milestone 3.1.</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">Recommended: Week 3 Check-In SMS</span>
                  <button 
                    type="button"
                    onClick={(e) => handleCTA(e)} 
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition-colors border border-white/10"
                  >
                    Send Check-In
                  </button>
                </div>
              </div>

              {/* Member Card 2 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] hover:border-white/[0.16] transition-colors space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 border border-white/10 text-slate-200 flex items-center justify-center font-bold text-xs font-mono">
                      DC
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm">David Chen</h5>
                      <p className="text-[11px] text-slate-400 font-mono">Cohort Member · Joined Sep 1</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px]">
                    Milestone Lag
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-white/[0.06] text-xs text-slate-300 space-y-1">
                  <p className="text-amber-300 font-medium">Trigger: Skipped 3.2 Action Plan Submission.</p>
                  <p className="text-slate-400">Watched lesson twice without submitting the corresponding action plan.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Cohort Analytics
              </h4>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Forecasted Completion</span>
                  <span className="text-xs font-medium text-emerald-400 font-mono">92% Target</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[92%]"></div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Intervening in weeks 2-4 prevents drop-offs and preserves retention through program completion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white tracking-tight">Automated Rules</h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Define custom criteria: Flag members after 4 days of inactivity, or when 2 consecutive milestones are unsubmitted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white tracking-tight">Continuous Tracking</h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Activity is logged continuously. Stop cross-referencing messy Google Sheets or guessing who is falling behind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section CTA */}
        <div className="text-center flex flex-col items-center">
          <button
            type="button"
            onClick={(e) => handleCTA(e)}
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-8 py-4 text-base font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <span>Get my free portal preview</span>
          </button>
          <p className="text-xs text-slate-400 mt-2.5 font-mono">
            Free preview built from your sales page in 24 hours. No obligation.
          </p>
        </div>
      </div>
    </section>
  );
}
