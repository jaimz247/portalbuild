import { CheckCircle, Clock, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { openApplicationModal } from '../lib/events';
import { useTheme } from '../context/ThemeContext';

interface TransformationProps {
  onOpenModal?: () => void;
}

export default function Transformation({ onOpenModal }: TransformationProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleCTA = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  const radarImageSrc = isLight ? '/images/operator-radar-light.webp' : '/images/operator-radar-dark.webp';
  const radarImageSrc2x = isLight ? '/images/operator-radar-light-2x.webp' : '/images/operator-radar-dark-2x.webp';

  return (
    <section
      className={`py-16 md:py-24 px-6 border-y relative transition-colors duration-300 ${
        isLight
          ? 'border-slate-200/80 bg-slate-50/70'
          : 'border-white/[0.08] bg-slate-950/60'
      }`}
      id="operator-view"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-3 font-semibold">
            Operator Radar
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            See who's falling behind. In week three, not week nine.
          </h2>
          <p className={`text-base md:text-lg leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300/80'
          }`}>
            When a member stops opening modules, missing sessions or skipping submissions, your weekly update flags them, with a check-in already drafted, so you step in while there's still time to protect their outcome.
          </p>
        </div>

        {/* Visual Console */}
        <div className={`relative rounded-2xl border p-5 md:p-8 overflow-hidden mb-12 transition-all duration-300 ${
          isLight
            ? 'border-slate-200/90 bg-white shadow-[0_24px_50px_-12px_rgba(15,23,42,0.08)]'
            : 'border-white/[0.08] bg-slate-900/40 shadow-2xl backdrop-blur-xl'
        }`}>
          {/* Top Bar of Console */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 mb-8 text-xs font-mono ${
            isLight ? 'border-slate-100' : 'border-white/[0.06]'
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className={`font-semibold text-sm md:text-base tracking-tight font-sans ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Cohort Operator Radar · Live Intervention Command Deck
                </h3>
                <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Harbourline, Aldermoor &amp; Northline Cohorts · 66 Active Members Telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : 'bg-slate-800/80 border-white/10 text-slate-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>64 On Track</span>
              </div>
              <div className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                isLight
                  ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                  : 'bg-rose-950/40 border-rose-500/20 text-rose-300'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>2 Inactive Flagged</span>
              </div>
            </div>
          </div>

          {/* Operator Radar Optimized High-Resolution Graphic with Interactive Overlay */}
          <div className={`mb-8 rounded-xl overflow-hidden border relative group shadow-md transition-all duration-300 ${
            isLight ? 'border-slate-200/90 bg-slate-50' : 'border-white/[0.06] bg-slate-950/80'
          }`}>
            {/* Corner Badge */}
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white/95 text-slate-800 border border-slate-200'
                  : 'bg-slate-950/90 text-slate-200 border border-white/10'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Telemetry Televiewer</span>
              </div>
            </div>

            <img
              key={radarImageSrc}
              src={radarImageSrc}
              srcSet={`${radarImageSrc} 1x, ${radarImageSrc2x} 2x`}
              width={1600}
              height={1000}
              alt="PortalBuild Operator Radar Member Health & Retention Dashboard"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.008]"
            />
          </div>

          {/* Grid Layout of Operator Dashboard */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Flagged Members */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`text-xs font-mono uppercase tracking-wider ${
                  isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'
                }`}>
                  Priority Action List (Week 3 Retention Threshold)
                </h4>
                <span className="text-[11px] text-rose-500 font-mono font-semibold">2 Interventions Needed</span>
              </div>

              {/* Member Card 1 */}
              <div className={`p-4 rounded-xl border transition-all duration-300 space-y-3 ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-sm'
                  : 'bg-slate-950/60 border-white/[0.08] hover:border-white/[0.16]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs font-mono ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-800 border-white/10 text-slate-200'
                    }`}>
                      MT
                    </div>
                    <div>
                      <h5 className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Marcus Thorne</h5>
                      <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Harbourline Institute · VP Product</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-[10px] font-semibold">
                    5 Days Inactive
                  </span>
                </div>

                <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                  isLight
                    ? 'bg-white border-slate-200/70 text-slate-700'
                    : 'bg-slate-900/60 border-white/[0.06] text-slate-300'
                }`}>
                  <p className="text-rose-600 font-semibold">Trigger: Missed 360 Stakeholder Upload for 5 days.</p>
                  <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>Last activity: Viewed 'Strategic Prioritization'. Zero submissions for Milestone 3.1.</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recommended: 1-Click WhatsApp Check-in</span>
                  <button 
                    type="button"
                    onClick={(e) => handleCTA(e)} 
                    className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    Draft Message ↗
                  </button>
                </div>
              </div>

              {/* Member Card 2 */}
              <div className={`p-4 rounded-xl border transition-all duration-300 space-y-3 ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-sm'
                  : 'bg-slate-950/60 border-white/[0.08] hover:border-white/[0.16]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs font-mono ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-800 border-white/10 text-slate-200'
                    }`}>
                      ER
                    </div>
                    <div>
                      <h5 className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Elena Rostova</h5>
                      <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Aldermoor Coaching · Dir. People</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 font-mono text-[10px] font-semibold">
                    Milestone Lag
                  </span>
                </div>

                <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                  isLight
                    ? 'bg-white border-slate-200/70 text-slate-700'
                    : 'bg-slate-900/60 border-white/[0.06] text-slate-300'
                }`}>
                  <p className="text-amber-600 font-semibold">Trigger: Missed Office Hours &amp; Practice Log #14.</p>
                  <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>Opened Module 3 video twice without submitting required coaching practicum notes.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className={`text-xs font-mono uppercase tracking-wider ${
                isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'
              }`}>
                Cohort Retention Analytics
              </h4>

              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200/80 shadow-sm'
                  : 'bg-slate-950/60 border-white/[0.08]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>Forecasted Completion Rate</span>
                  <span className="text-xs font-bold text-emerald-500 font-mono">94.2% Health</span>
                </div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  <div className="bg-emerald-500 h-2 rounded-full w-[94%] transition-all duration-500" />
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Intervening in weeks 2–4 prevents drop-offs and preserves tuition and referral retention through cohort graduation.
                </p>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200/80 shadow-sm'
                  : 'bg-slate-950/60 border-white/[0.08]'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-orange-500' : 'text-slate-300'}`} />
                  <div>
                    <h5 className={`text-sm font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Configurable Risk Thresholds</h5>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Set custom criteria: flag members after 4 days of LMS dormancy, or when 2 action milestones in a row are unsubmitted.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200/80 shadow-sm'
                  : 'bg-slate-950/60 border-white/[0.08]'
              }`}>
                <div className="flex items-start gap-3">
                  <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-orange-500' : 'text-slate-300'}`} />
                  <div>
                    <h5 className={`text-sm font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Weekly Automated Health Digest</h5>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Progress and attendance refreshed from real member interactions. No more cross-referencing messy Google Sheets or guessing who's falling behind.
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
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-8 py-4 text-base font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-md transition-all cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <span>Get my free portal preview</span>
          </button>
          <p className={`text-xs mt-2.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Free preview built from your sales page in 24 hours. No obligation.
          </p>
        </div>
      </div>
    </section>
  );
}
