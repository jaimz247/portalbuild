import { AlertTriangle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { openApplicationModal } from '../lib/events';

interface TransformationProps {
  onOpenModal?: () => void;
}

export default function Transformation({ onOpenModal }: TransformationProps) {
  const handleCTA = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal();
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 border-y border-white/10 bg-slate-950/60 relative" id="operator-view">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Operator Command Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            See who's falling behind. In week three, not week nine.
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            When a member stops opening modules in week three, your operator radar flags them immediately. Reach out while there's still time to turn their experience around — before they become a refund request or silent non-renewal.
          </p>
        </div>

        {/* Large Annotated Visual Box */}
        <div className="relative rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl p-6 md:p-8 overflow-hidden mb-12">
          {/* Operator Radar Optimized AVIF/WebP Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-white/10 shadow-xl bg-slate-950">
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

          {/* Top Bar of Console */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg">Cohort 8 Operator Radar</h3>
                <p className="text-xs font-mono text-slate-400">32 Total Members · 12-Week Active Sequence</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                28 On Track
              </div>
              <div className="px-3 py-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                2 At-Risk Flagged
              </div>
            </div>
          </div>

          {/* Grid Layout of Operator Dashboard */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Flagged Members Radar */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  ⚠️ Priority Intervention Queue
                </h4>
                <span className="text-xs text-rose-400 font-mono">2 Members Need Action</span>
              </div>

              {/* Member Card 1 */}
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-3 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-900/80 border border-rose-500/50 text-rose-200 flex items-center justify-center font-bold text-xs">
                      ER
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">Elena Rostova</h5>
                      <p className="text-xs text-slate-400">Mastermind Member · Joined Sep 1</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
                    6 DAYS INACTIVE
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-rose-900/30 text-xs text-slate-300 space-y-1">
                  <p className="text-rose-300 font-semibold">Flag Trigger: Stopped opening Module 3 videos in Week 3.</p>
                  <p className="text-slate-400">Last activity: Viewed 'Module 2 Wrap-up' 6 days ago. Zero submissions for Worksheet 3.1.</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">Suggested Action: Send Week 3 Check-In SMS</span>
                  <button onClick={handleCTA} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition-colors cursor-pointer">
                    Intervene Now →
                  </button>
                </div>
              </div>

              {/* Member Card 2 */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-900/80 border border-amber-500/50 text-amber-200 flex items-center justify-center font-bold text-xs">
                      DC
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">David Chen</h5>
                      <p className="text-xs text-slate-400">Cohort Member · Joined Sep 1</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                    MILESTONE LAG
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-900/30 text-xs text-slate-300 space-y-1">
                  <p className="text-amber-300 font-semibold">Flag Trigger: Skipped 3.2 Action Plan Submission.</p>
                  <p className="text-slate-400">Watched video 3.2 twice, but hasn't submitted workbook.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Annotations & Metrics */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                📊 Retention Intelligence
              </h4>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Forecasted Cohort Completion</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">92% Target</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[92%]"></div>
                </div>
                <p className="text-xs text-slate-400">
                  Early interventions in weeks 2-4 directly lift final completion by an average of 34%.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Automated Health Rules</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Set custom thresholds: Flag members if inactive for 4+ days, or if 2 consecutive worksheets are missed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Zero Extra Operator Hours</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your portal tracks progress in the background so you never have to manually check spreadsheets or ping members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA #2 Button */}
        <div className="text-center">
          <button
            onClick={handleCTA}
            className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 text-base md:text-lg font-bold tracking-tight rounded-md shadow-lg shadow-orange-600/25 transition-all duration-300 cursor-pointer min-h-[48px]"
          >
            Get my free portal preview
          </button>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Free preview built from your sales page in 24 hours. No obligation.
          </p>
        </div>
      </div>
    </section>
  );
}

