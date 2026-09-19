import { 
  Home, 
  Users, 
  Map, 
  Calendar, 
  PlayCircle, 
  FolderArchive, 
  BarChart3, 
  Video, 
  Megaphone,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';

export default function Features() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto relative" id="screens">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
          Member Experience Architecture
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
          The 9 Screens Built For Your Cohort
        </h2>
        <p className="text-slate-300/80 text-base md:text-lg">
          Every screen is custom-branded with your typography, identity, and domain to deliver a coherent high-ticket experience.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">

        {/* 1. Welcome / Home (Wide Feature: lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 md:p-7 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 01
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    Welcome & Active Week
                  </h3>
                </div>
              </div>

              <span className="text-[11px] font-mono text-emerald-400">
                Live Status Active
              </span>
            </div>

            <p className="text-slate-300/80 text-sm leading-relaxed mb-6">
              Personalized member dashboard displaying active week status, current deliverables, and the countdown to the next live session.
            </p>
          </div>

          {/* Active Week Status Bar */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span className="font-mono text-slate-300">Week 03: Strategic GTM Validation</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Next Call: Today at 2:00 PM EST</span>
            </div>
          </div>
        </div>

        {/* 2. My Progress (Bento Column: lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 md:p-7 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 07
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    My Progress
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Individual member tracking showing submitted assignments, operator feedback, and personal completion milestones.
            </p>
          </div>

          {/* Metric Artifact */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Milestone Pace</span>
              <span className="text-emerald-400 font-medium">88% (On Track)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[88%]"></div>
            </div>
          </div>
        </div>

        {/* 3. Program Roadmap (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 03
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Program Roadmap
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Interactive week-by-week curriculum timeline displaying completed work and locked upcoming milestones.
            </p>
          </div>

          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
            <span className="text-slate-300">W1 Completed</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">W2 Completed</span>
            <span className="text-slate-600">/</span>
            <span className="text-orange-400 font-medium">W3 Active</span>
          </div>
        </div>

        {/* 4. Your Cohort (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 02
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Cohort Directory
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Private peer directory showing company bios, contact channels, and timezone coordination.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/20 text-[9px] flex items-center justify-center font-mono text-slate-300">AK</div>
              <div className="w-5 h-5 rounded-full bg-slate-700 border border-white/20 text-[9px] flex items-center justify-center font-mono text-slate-200">MR</div>
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/20 text-[9px] flex items-center justify-center font-mono text-slate-400">+30</div>
            </div>
            <span className="font-mono text-[11px] text-slate-400">32 Members Enrolled</span>
          </div>
        </div>

        {/* 5. Schedule (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 04
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Live Schedule
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Centralized call calendar with direct session links, iCal subscriptions, and local timezone conversions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono text-slate-400">
            <span>Direct Video Links</span>
            <span>iCal / Google Sync</span>
          </div>
        </div>

        {/* 6. Modules (Wide Feature: lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 md:p-7 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 05
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    Modules & Worksheets
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-sm leading-relaxed mb-5">
              Curriculum video lessons paired directly with required worksheet submissions and deliverable review gates.
            </p>
          </div>

          {/* Lesson Card Artifact */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Lesson 3.2: Architecture Blueprint & Tech Stack</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              Deliverable Required
            </span>
          </div>
        </div>

        {/* 7. Resources (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <FolderArchive className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 06
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Resource Vault
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Organized library for slide decks, SOP templates, financial models, and downloadable frameworks.
            </p>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Search className="w-3 h-3 text-slate-500" /> Filter library by tag</span>
            <span className="text-slate-500 text-[10px]">Indexed</span>
          </div>
        </div>

        {/* 8. Sessions (lg:col-span-6) */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 08
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Session Archives
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Complete archive of past live call replays, topic summaries, timestamps, and key takeaway notes.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono text-slate-400">
            <span className="text-slate-300">Call 04: Pricing Models</span>
            <span>Summary & Timestamps</span>
          </div>
        </div>

        {/* 9. Announcements (lg:col-span-6) */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Screen 09
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Announcements
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed mb-4">
              Operator broadcast feed for weekly focus priorities, schedule adjustments, and cohort notifications.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono text-slate-400">
            <span>Broadcast Feed</span>
            <span>Real-Time Sync</span>
          </div>
        </div>

      </div>
    </section>
  );
}
