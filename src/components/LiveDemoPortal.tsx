import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { trackDemoInteraction } from '../lib/analytics';

interface DemoPortal {
  id: string;
  name: string;
  descriptor: string;
  domain: string;
  url: string;
  isLive: boolean;
}

interface LiveDemoPortalProps {
  isLoading?: boolean;
}

// Multi-Demo Config: Unlaunched cohortroom demos are gated behind isLive flag defaulting to off
const DEMO_PORTALS: DemoPortal[] = [
  {
    id: 'growth-collective',
    name: 'Growth Collective',
    descriptor: 'Business mastermind · 12 weeks · 32 members',
    domain: 'growthcollective.cohortroom.com',
    url: 'https://growthcollective.cohortroom.com',
    isLive: true,
  },
  {
    id: 'leadership',
    name: 'Leadership Programme',
    descriptor: 'Corporate leadership · 14 weeks · 22 participants',
    domain: 'leadership.cohortroom.com',
    url: 'https://growthcollective.cohortroom.com',
    isLive: false,
  },
  {
    id: 'ai-operations',
    name: 'AI Operations Cohort',
    descriptor: 'Technical build track · 8 weeks · 40 members',
    domain: 'ai.cohortroom.com',
    url: 'https://growthcollective.cohortroom.com',
    isLive: false,
  },
  {
    id: 'agency',
    name: 'Agency Mastermind',
    descriptor: 'Agency scaling · 16 weeks · 24 members',
    domain: 'agency.cohortroom.com',
    url: 'https://growthcollective.cohortroom.com',
    isLive: false,
  },
];

export default function LiveDemoPortal({ isLoading }: LiveDemoPortalProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Provides visual skeleton structure during initial client-side hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  const liveDemos = DEMO_PORTALS.filter((d) => d.isLive);
  const [selectedDemoId, setSelectedDemoId] = useState<string>(liveDemos[0]?.id || 'growth-collective');
  const [activeTab, setActiveTab] = useState<'overview' | 'cohort' | 'roadmap' | 'operator'>('overview');
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeDemo = liveDemos.find((d) => d.id === selectedDemoId) || liveDemos[0] || DEMO_PORTALS[0];

  const handleDemoSwitch = (demo: DemoPortal) => {
    setSelectedDemoId(demo.id);
    trackDemoInteraction(demo.id, 'switch_demo_tab');
  };

  const handleOpenFullDemo = () => {
    trackDemoInteraction(activeDemo.id, 'open_full_demo');
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (liveDemos.length <= 1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % liveDemos.length;
      handleDemoSwitch(liveDemos[nextIndex]);
      const nextBtn = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + liveDemos.length) % liveDemos.length;
      handleDemoSwitch(liveDemos[prevIndex]);
      const prevBtn = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[prevIndex];
      prevBtn?.focus();
    }
  };

  const showSkeleton = isLoading ?? !isHydrated;

  if (showSkeleton) {
    return (
      <section
        id="live-demo"
        className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto"
        role="status"
        aria-label="Loading Interactive Demo Portal"
      >
        {/* Header Skeleton */}
        <div className="text-center mb-8 md:mb-12">
          <div className="w-44 h-7 rounded-full bg-slate-800/60 border border-white/5 animate-pulse mx-auto mb-3" />
          <div className="w-3/4 max-w-xl h-9 md:h-12 rounded-lg bg-slate-800/60 animate-pulse mx-auto mb-3" />
          <div className="w-4/5 max-w-lg h-4 rounded bg-slate-800/40 animate-pulse mx-auto" />
        </div>

        {/* Program Selector Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-36 md:w-44 h-9 rounded-lg bg-slate-900/80 border border-white/10 animate-pulse"
            />
          ))}
        </div>

        {/* Active Descriptor Pill Skeleton */}
        <div className="w-64 h-4 rounded bg-slate-800/40 animate-pulse mx-auto mb-4" />

        {/* Desktop Browser Chrome Container Skeleton */}
        <div className="hidden md:block relative rounded-xl border border-white/15 bg-slate-950 shadow-2xl overflow-hidden">
          {/* Top Bar Skeleton */}
          <div className="bg-slate-900/90 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700/60" />
              <div className="w-3 h-3 rounded-full bg-slate-700/60" />
              <div className="w-3 h-3 rounded-full bg-slate-700/60" />
            </div>
            <div className="flex-1 max-w-xl mx-auto h-7 bg-slate-950 border border-white/10 rounded-md animate-pulse" />
            <div className="w-32 h-7 rounded bg-slate-800/60 animate-pulse" />
          </div>

          {/* Stage Screen Container Skeleton */}
          <div className="min-h-[520px] md:min-h-[580px] md:aspect-[16/10] bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Skeleton */}
            <div className="w-64 border-r border-white/10 bg-slate-900/50 p-4 flex flex-col gap-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/60 border border-white/5 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-4 rounded bg-slate-800/60 animate-pulse" />
                  <div className="w-16 h-3 rounded bg-slate-800/40 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-8 rounded-md bg-slate-800/40 animate-pulse" />
                ))}
              </div>
              <div className="mt-auto p-3 rounded-lg border border-white/10 bg-slate-900/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800/60 animate-pulse" />
                <div className="space-y-1 flex-1">
                  <div className="w-20 h-3 rounded bg-slate-800/60 animate-pulse" />
                  <div className="w-14 h-2.5 rounded bg-slate-800/40 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Main Content Area Skeleton */}
            <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-950/60">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-48 h-6 rounded bg-slate-800/60 animate-pulse" />
                  <div className="w-32 h-3.5 rounded bg-slate-800/40 animate-pulse" />
                </div>
                <div className="w-28 h-8 rounded-lg bg-slate-800/50 animate-pulse" />
              </div>

              {/* 3 Metric Cards Skeleton */}
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/10 bg-slate-900/60 space-y-3">
                    <div className="w-24 h-3 rounded bg-slate-800/40 animate-pulse" />
                    <div className="w-16 h-6 rounded bg-slate-800/60 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Main Panel Skeleton */}
              <div className="flex-1 p-5 rounded-xl border border-white/10 bg-slate-900/40 space-y-4">
                <div className="w-40 h-4 rounded bg-slate-800/60 animate-pulse" />
                <div className="w-full h-20 rounded-lg bg-slate-800/30 animate-pulse" />
                <div className="w-full h-20 rounded-lg bg-slate-800/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Demo Card Skeleton */}
        <div className="md:hidden rounded-xl border border-white/15 bg-slate-900/80 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="space-y-1">
              <div className="w-24 h-3 rounded bg-slate-800/40 animate-pulse" />
              <div className="w-32 h-4 rounded bg-slate-800/60 animate-pulse" />
            </div>
            <div className="w-14 h-5 rounded bg-slate-800/60 animate-pulse" />
          </div>
          <div className="h-16 rounded-lg bg-slate-950 border border-white/5 animate-pulse" />
          <div className="h-16 rounded-lg bg-slate-950 border border-white/5 animate-pulse" />
          <div className="h-11 rounded-lg bg-slate-800/60 animate-pulse mt-2" />
        </div>
      </section>
    );
  }

  return (
    <section id="live-demo" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto transition-opacity duration-300">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Interactive Preview</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          These are real portals. Click around them.
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-3">
          Test the exact member experience — from week-by-week curriculum roadmaps to cohort schedule tracking and operator progress flags.
        </p>
      </div>

      {/* Program Shape Selector Tabs (keyboard-accessible ARIA tablist) */}
      {liveDemos.length > 1 && (
        <div 
          ref={tabListRef}
          role="tablist" 
          aria-label="Demo Portal Programs"
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
        >
          {liveDemos.map((demo, idx) => {
            const isSelected = demo.id === activeDemo.id;
            return (
              <button
                key={demo.id}
                role="tab"
                id={`tab-${demo.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${demo.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleDemoSwitch(demo)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10'
                }`}
              >
                <span>{demo.name}</span>
                <span className="hidden sm:inline-block ml-2 text-[11px] opacity-80 font-normal">
                  ({demo.descriptor.split('·')[0].trim()})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Program Descriptor Badge */}
      <div className="flex items-center justify-center gap-2 mb-4 text-xs text-slate-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Active Demo: <strong className="text-slate-200">{activeDemo.name}</strong> · {activeDemo.descriptor}</span>
      </div>

      {/* Browser Chrome Container (Desktop / Tablet) */}
      <div 
        id={`panel-${activeDemo.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeDemo.id}`}
        className="hidden md:block relative rounded-xl border border-white/15 bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-900/90 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-xl mx-auto bg-slate-950 border border-white/10 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-slate-300 font-mono shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 select-all font-semibold">{activeDemo.domain}</span>
            <span className="ml-auto text-[10px] text-emerald-400 font-sans font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Live Member Portal
            </span>
          </div>

          {/* External Link Action */}
          <a
            href={activeDemo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenFullDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-medium text-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <span>Open Full Demo</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>

        {/* Demo Stage Screen Container */}
        <div className="relative min-h-[520px] md:min-h-[580px] md:aspect-[16/10] bg-slate-950 flex flex-col overflow-hidden">
          {/* Interactive Portal Simulated App Interface */}
          <div className="flex-1 flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/50 p-3 md:p-4 flex flex-col gap-3 md:gap-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center font-extrabold text-white text-base shrink-0">
                  {activeDemo.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{activeDemo.name}</h4>
                  <p className="text-[11px] text-orange-400 font-mono">Cohort 8 · Live</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-1 font-medium text-xs pb-1 md:pb-0">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    trackDemoInteraction('overview', 'click_tab_overview');
                  }}
                  className={`text-left px-3 py-2 rounded-md transition-all flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 shrink-0 md:shrink whitespace-nowrap md:whitespace-normal ${
                    activeTab === 'overview' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Welcome / Home</span>
                  <span className="text-[10px] opacity-75">Screen 1</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('cohort');
                    trackDemoInteraction('cohort', 'click_tab_cohort');
                  }}
                  className={`text-left px-3 py-2 rounded-md transition-all flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 shrink-0 md:shrink whitespace-nowrap md:whitespace-normal ${
                    activeTab === 'cohort' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Your Cohort (32)</span>
                  <span className="text-[10px] opacity-75">Screen 2</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('roadmap');
                    trackDemoInteraction('roadmap', 'click_tab_roadmap');
                  }}
                  className={`text-left px-3 py-2 rounded-md transition-all flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 shrink-0 md:shrink whitespace-nowrap md:whitespace-normal ${
                    activeTab === 'roadmap' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Program Roadmap</span>
                  <span className="text-[10px] opacity-75">Screen 3</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('operator');
                    trackDemoInteraction('operator', 'click_tab_operator');
                  }}
                  className={`text-left px-3 py-2 rounded-md transition-all flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 shrink-0 md:shrink whitespace-nowrap md:whitespace-normal ${
                    activeTab === 'operator' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Operator View</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">ADMIN</span>
                </button>
              </div>

              {/* Member Profile Card */}
              <div className="hidden md:flex mt-auto p-3 rounded-lg border border-white/10 bg-slate-900/80 items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
                  JM
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">Jordan Miller</p>
                  <p className="text-[10px] text-slate-400 truncate">Member · Week 4 of 12</p>
                </div>
              </div>
            </div>

            {/* Main Stage Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Welcome Banner */}
                  <div className="p-6 rounded-xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-900 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase text-orange-400 tracking-wider">Cohort 8 · Week 4 Active</span>
                      <span className="text-xs text-slate-400">Target Finish: Nov 15</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Welcome back, Jordan</h3>
                    <p className="text-slate-300 text-sm mt-1">You have 2 items due before Thursday's live Mastermind session.</p>
                  </div>

                  {/* Progress Bar & Current Milestone */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-slate-900 border border-white/10">
                      <span className="text-xs text-slate-400">Curriculum Progress</span>
                      <div className="text-2xl font-bold text-white mt-1">68%</div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full w-[68%]"></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-900 border border-white/10">
                      <span className="text-xs text-slate-400">Next Live Session</span>
                      <div className="text-base font-bold text-white mt-1">Thursday @ 2:00 PM EST</div>
                      <span className="text-[11px] text-emerald-400">Zoom link ready in Schedule</span>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-900 border border-white/10">
                      <span className="text-xs text-slate-400">Milestone Status</span>
                      <div className="text-base font-bold text-emerald-400 mt-1">On Track</div>
                      <span className="text-[11px] text-slate-400">3 deliverables submitted</span>
                    </div>
                  </div>

                  {/* Active Module Deliverables */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-white/10 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center justify-between">
                      <span>Module 4: Offer Architecture &amp; Pricing</span>
                      <span className="text-xs font-normal text-orange-400">Due Oct 12</span>
                    </h4>

                    <div className="space-y-2">
                      <div className="p-3 rounded bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-0" />
                          <span className="text-slate-300 line-through">Watch Video Lesson 4.1: Value Tiering Framework</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">COMPLETED</span>
                      </div>

                      <div className="p-3 rounded bg-slate-950 border border-orange-500/30 bg-orange-500/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" readOnly className="rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-0" />
                          <span className="text-white font-medium">Submit Worksheet: 3-Tier Offer Matrix</span>
                        </div>
                        <span className="text-[10px] text-orange-400 font-mono">ACTION REQUIRED</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cohort' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Cohort 8 Members (32 Operators)</h3>
                    <span className="text-xs text-slate-400 font-mono">Private Member Directory</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Jordan Miller", role: "Growth Lead", status: "Active Now", progress: "68%" },
                      { name: "Sarah Vance", role: "Agency Founder", status: "Active 2h ago", progress: "84%" },
                      { name: "Marcus Thorne", role: "Consultant", status: "Active yesterday", progress: "72%" },
                      { name: "Elena Rostova", role: "Cohort Director", status: "Active 3d ago", progress: "45%" },
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-mono block">{m.progress}</span>
                          <span className="text-[9px] text-slate-500">{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">12-Week Program Roadmap</h3>
                  <div className="space-y-3">
                    {[
                      { week: "Week 1-2", title: "Foundation & System Audit", status: "Completed", color: "text-emerald-400" },
                      { week: "Week 3-4", title: "Offer Architecture & Retention Engine", status: "In Progress", color: "text-orange-400" },
                      { week: "Week 5-6", title: "Operator Radar & Automated Onboarding", status: "Locked", color: "text-slate-500" },
                      { week: "Week 7-8", title: "Cohort Dynamics & Milestone Reviews", status: "Locked", color: "text-slate-500" },
                    ].map((step, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{step.week}</span>
                          <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        </div>
                        <span className={`text-xs font-semibold ${step.color}`}>{step.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'operator' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Operator Radar · Real-time Member Flags</span>
                      <h3 className="text-lg font-bold text-white">Cohort Health: 2 At-Risk Members Flagged</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                      LIVE RADAR
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                        <div>
                          <p className="text-xs font-bold text-white">Elena Rostova — <span className="text-rose-400">At-Risk (Week 3 Inactive)</span></p>
                          <p className="text-[11px] text-slate-400">Has not opened Module 3 or logged in for 6 days. Zero submissions.</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-rose-400">
                        Intervene Now
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <div>
                          <p className="text-xs font-bold text-white">David Chen — <span className="text-amber-400">Needs Follow-up</span></p>
                          <p className="text-[11px] text-slate-400">Watched videos but skipped worksheet upload. 2 days behind milestone.</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400">
                        Send Nudge
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Frame Device Mock (< 768px) */}
      <div className="block md:hidden max-w-sm mx-auto">
        <div className="rounded-[32px] border-4 border-slate-800 bg-slate-950 p-3 shadow-2xl relative overflow-hidden">
          {/* Phone Notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3"></div>

          {/* Mobile App View */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase">{activeDemo.name}</span>
                <h4 className="text-sm font-bold text-white">Jordan's Portal</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600 text-white font-bold">Week 4</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-2">
              <span className="text-[10px] text-slate-400">Next Mastermind Session</span>
              <p className="text-xs font-bold text-white">Thursday @ 2:00 PM EST</p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400">OPERATOR RADAR</span>
              <p className="text-xs font-bold text-white">1 Member Flagged At-Risk</p>
              <p className="text-[10px] text-slate-300">Elena Rostova hasn't logged in for 6 days.</p>
            </div>

            {/* Mobile Open Full Demo Button */}
            <a
              href={activeDemo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenFullDemo}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <span>Open Full Demo Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

