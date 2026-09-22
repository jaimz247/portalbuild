import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Lock, Check, Calendar, ArrowRight, ShieldCheck, UserCheck, Eye, Layers, Sparkles, Clock, Globe } from 'lucide-react';
import { trackDemoInteraction } from '../lib/analytics';
import { openApplicationModal } from '../lib/events';

interface DemoPortal {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  subtitle: string;
  descriptor: string;
  domain: string;
  url: string;
  totalWeeks: number;
  currentWeek: number;
  memberName: string;
  memberInitials: string;
  memberRole: string;
  currentSessionTitle: string;
  currentSessionTime: string;
  currentSessionNote: string;
  currentModuleNum: string;
  currentModuleName: string;
  metrics: {
    label: string;
    value: string;
    sublabel: string;
    highlight?: boolean;
  }[];
  operatorHighlight: {
    flaggedName: string;
    flaggedStatus: string;
    flaggedReason: string;
    actionLabel: string;
  };
}

interface LiveDemoPortalProps {
  isLoading?: boolean;
  programURL?: string;
}

const LIVE_HOSTED_PORTALS: DemoPortal[] = [
  {
    id: 'growth-collective',
    name: 'The Growth Collective',
    shortName: 'TGC',
    badge: 'Founder Accelerator',
    subtitle: 'A 12-week accelerator for founder-led service businesses',
    descriptor: '12-week accelerator · 32 founders',
    domain: 'growthcollective.cohortroom.com',
    url: 'https://growthcollective.cohortroom.com',
    totalWeeks: 12,
    currentWeek: 4,
    memberName: 'Sarah Whitfield',
    memberInitials: 'SW',
    memberRole: 'Member · Pod B · 4 weeks running',
    currentSessionTitle: 'Week 4 Live Session — Pricing Without Discounting',
    currentSessionTime: 'Thu, Sep 24 @ 11:00am Zoom · Main Room',
    currentSessionNote: 'In 2 days',
    currentModuleNum: '04',
    currentModuleName: 'Pricing Without Discounting',
    metrics: [
      { label: 'Curriculum Progress', value: '68%', sublabel: 'On track · 3 deliverables submitted' },
      { label: 'Next Live Session', value: 'Thu @ 11:00 AM', sublabel: 'Pricing Without Discounting' },
      { label: 'Cohort Benchmark', value: '+34%', sublabel: 'Top quartile revenue growth', highlight: true },
    ],
    operatorHighlight: {
      flaggedName: 'Elena Rostova',
      flaggedStatus: 'At-Risk (Week 3 Inactive)',
      flaggedReason: 'Has not opened Module 3 or logged in for 6 days. Zero submissions.',
      actionLabel: 'Intervene Now',
    },
  },
  {
    id: 'leadership',
    name: 'Harbourline Institute',
    shortName: 'HI',
    badge: 'Executive Leadership',
    subtitle: 'A 10-week program for senior managers stepping into executive roles',
    descriptor: '10-week program · 22 participants',
    domain: 'leadership.cohortroom.com',
    url: 'https://leadership.cohortroom.com',
    totalWeeks: 10,
    currentWeek: 4,
    memberName: 'Priya Raman',
    memberInitials: 'PR',
    memberRole: 'Member · Pod B · 4 weeks running',
    currentSessionTitle: 'Week 4 Live Session — Strategic Prioritization',
    currentSessionTime: 'Thu, Sep 24 @ 11:00am Zoom · Executive Hall',
    currentSessionNote: 'In 2 days',
    currentModuleNum: '04',
    currentModuleName: 'Strategic Prioritization',
    metrics: [
      { label: 'Curriculum Progress', value: '70%', sublabel: 'Leadership Pod B peer review done' },
      { label: 'Next Executive Session', value: 'Thu @ 11:00 AM', sublabel: 'Strategic Prioritization' },
      { label: 'Peer Review Score', value: '9.4/10', sublabel: 'Top rated in Executive Pod B', highlight: true },
    ],
    operatorHighlight: {
      flaggedName: 'Marcus Thorne',
      flaggedStatus: 'Needs Follow-up',
      flaggedReason: 'Attended session but missed 360 stakeholder feedback upload.',
      actionLabel: 'Send Nudge',
    },
  },
  {
    id: 'agency',
    name: 'Northline Collective',
    shortName: 'NC',
    badge: 'Agency Mastermind',
    subtitle: 'A 16-week sprint for agency owners going from operator to owner',
    descriptor: '16-week sprint · 24 agency owners',
    domain: 'agency.cohortroom.com',
    url: 'https://agency.cohortroom.com',
    totalWeeks: 16,
    currentWeek: 4,
    memberName: 'Nate Calloway',
    memberInitials: 'NC',
    memberRole: 'Member · Pod B · 4 weeks running',
    currentSessionTitle: 'Week 4 Live Session — Delegation & Margin Health',
    currentSessionTime: 'Wednesdays, 12pm ET · Main Room',
    currentSessionNote: 'Live Sprint',
    currentModuleNum: '04',
    currentModuleName: 'Delegation & Margin Health',
    metrics: [
      { label: 'Monthly Recurring Revenue', value: '$47,000', sublabel: '+38% growth since start', highlight: true },
      { label: 'Agency Margin Health', value: '44%', sublabel: 'Up 11% from baseline audit' },
      { label: 'Cohort Rank by MRR', value: 'Top Quartile', sublabel: 'Rank #3 by MRR expansion' },
    ],
    operatorHighlight: {
      flaggedName: 'David Chen',
      flaggedStatus: 'Needs Follow-up',
      flaggedReason: 'Logged revenue metrics but skipped hiring matrix deliverable.',
      actionLabel: 'Send Nudge',
    },
  },
];

export default function LiveDemoPortal({ isLoading }: LiveDemoPortalProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('growth-collective');
  const [activeTab, setActiveTab] = useState<'overview' | 'cohort' | 'roadmap' | 'operator'>('overview');
  const tabListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  const activeDemo = LIVE_HOSTED_PORTALS.find((d) => d.id === selectedDemoId) || LIVE_HOSTED_PORTALS[0];

  const handleDemoSwitch = (demo: DemoPortal) => {
    setSelectedDemoId(demo.id);
    trackDemoInteraction(demo.id, 'switch_demo_tab');
  };

  const handleOpenFullDemo = (demo: DemoPortal) => {
    trackDemoInteraction(demo.id, 'open_full_demo');
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % LIVE_HOSTED_PORTALS.length;
      handleDemoSwitch(LIVE_HOSTED_PORTALS[nextIndex]);
      const nextBtn = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + LIVE_HOSTED_PORTALS.length) % LIVE_HOSTED_PORTALS.length;
      handleDemoSwitch(LIVE_HOSTED_PORTALS[prevIndex]);
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
        <div className="text-center mb-8 md:mb-12">
          <div className="w-44 h-7 rounded-full bg-slate-800/60 border border-white/5 animate-pulse mx-auto mb-3" />
          <div className="w-3/4 max-w-xl h-9 md:h-12 rounded-lg bg-slate-800/60 animate-pulse mx-auto mb-3" />
          <div className="w-4/5 max-w-lg h-4 rounded bg-slate-800/40 animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-900/80 border border-white/10 animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-xl border border-white/10 bg-slate-950 animate-pulse" />
      </section>
    );
  }

  return (
    <section id="live-demo" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto transition-opacity duration-300">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono tracking-wider uppercase mb-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Hosted Portals
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Explore 3 live sample portals. Built and hosted for real cohort models.
        </h2>
        <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
          We have built and hosted 3 complete, ready-made sample portals across founder accelerator, executive leadership, and agency mastermind formats. Test-drive each live website directly — including the member journey, module roadmaps, and the operator back-office view.
        </p>
      </div>

      {/* 3 Showcase Cards: 1-Click Launch & Tab Selector */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Live Hosted Cohort Portals"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {LIVE_HOSTED_PORTALS.map((demo, idx) => {
          const isSelected = demo.id === activeDemo.id;
          return (
            <div
              key={demo.id}
              role="tab"
              id={`tab-${demo.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${demo.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleDemoSwitch(demo)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`p-5 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between relative cursor-pointer group ${
                isSelected
                  ? 'bg-slate-900/90 border-orange-500/40 ring-1 ring-orange-500/30 shadow-lg shadow-orange-950/20'
                  : 'bg-slate-950/70 hover:bg-slate-900/70 border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div>
                {/* Top Badge & Live Indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                    {demo.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE HOSTED
                  </span>
                </div>

                {/* Portal Name & Subtitle */}
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{demo.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {demo.subtitle}
                </p>

                {/* Domain Pill */}
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/[0.06] text-[11px] font-mono text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{demo.domain}</span>
                </div>
              </div>

              {/* Action Buttons: Open Live Site or Select Preview */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {isSelected ? 'Currently Viewing ↓' : 'Click to inspect'}
                </span>
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFullDemo(demo);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold tracking-tight shadow-sm transition-colors cursor-pointer shrink-0"
                  aria-label={`Open live portal for ${demo.name} in new tab`}
                >
                  <span>Open Live Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Browser Stage Container */}
      <div
        id={`panel-${activeDemo.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeDemo.id}`}
        className="hidden md:block relative rounded-2xl border border-white/[0.12] bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-900/95 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between gap-4">
          {/* Window Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-xl mx-auto bg-slate-950 border border-white/[0.08] rounded-lg px-3.5 py-1.5 flex items-center gap-2.5 text-xs text-slate-300 font-mono shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 select-all font-semibold truncate">{activeDemo.domain}</span>
            <span className="ml-auto text-[10px] font-sans font-medium px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Member Portal
            </span>
          </div>

          {/* Direct Launch Action */}
          <a
            href={activeDemo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOpenFullDemo(activeDemo)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs font-semibold text-orange-300 hover:text-orange-200 transition-colors cursor-pointer shrink-0"
          >
            <span>Open Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Portal Stage View */}
        <div className="relative min-h-[540px] bg-slate-950 flex flex-col md:flex-row overflow-hidden text-slate-100">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.08] bg-slate-900/40 p-4 flex flex-col gap-5 shrink-0">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                {activeDemo.shortName}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-white truncate">{activeDemo.name}</h4>
                <p className="text-[11px] text-orange-400 font-mono truncate">
                  Week {activeDemo.currentWeek} of {activeDemo.totalWeeks} · Live
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-row md:flex-col overflow-x-auto gap-1 font-medium text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('overview');
                  trackDemoInteraction('overview', 'click_tab_overview');
                }}
                className={`text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Welcome / Home</span>
                <span className="text-[10px] opacity-75 font-mono">Screen 1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('cohort');
                  trackDemoInteraction('cohort', 'click_tab_cohort');
                }}
                className={`text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeTab === 'cohort'
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Cohort Pods</span>
                <span className="text-[10px] opacity-75 font-mono">Screen 2</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('roadmap');
                  trackDemoInteraction('roadmap', 'click_tab_roadmap');
                }}
                className={`text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Curriculum Roadmap</span>
                <span className="text-[10px] opacity-75 font-mono">Screen 3</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('operator');
                  trackDemoInteraction('operator', 'click_tab_operator');
                }}
                className={`text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeTab === 'operator'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Operator Radar</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                  ADMIN
                </span>
              </button>
            </div>

            {/* Member Persona Footer Card */}
            <div className="hidden md:flex mt-auto p-3 rounded-xl border border-white/[0.08] bg-slate-900/80 items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-white/10">
                {activeDemo.memberInitials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{activeDemo.memberName}</p>
                <p className="text-[10px] text-slate-400 truncate">{activeDemo.memberRole}</p>
              </div>
            </div>
          </div>

          {/* Main Stage Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Greeting Banner */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-900/60 to-slate-900/40 border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-orange-400 tracking-wider font-semibold">
                      Fall 2026 Cohort · Week {activeDemo.currentWeek} Active
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activeDemo.currentSessionNote}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Good evening, {activeDemo.memberName.split(' ')[0]}.
                  </h3>
                  <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed">
                    {activeDemo.subtitle}
                  </p>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeDemo.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border bg-slate-900/70 flex flex-col justify-between ${
                        m.highlight ? 'border-orange-500/30' : 'border-white/[0.08]'
                      }`}
                    >
                      <span className="text-xs text-slate-400">{m.label}</span>
                      <div className={`text-xl md:text-2xl font-bold mt-1 tracking-tight ${m.highlight ? 'text-orange-400' : 'text-white'}`}>
                        {m.value}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 font-mono">{m.sublabel}</span>
                    </div>
                  ))}
                </div>

                {/* Live Session Deliverable Box */}
                <div className="p-5 rounded-xl bg-slate-900/70 border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">UPCOMING SESSION</span>
                      <h4 className="font-bold text-sm md:text-base text-white mt-0.5">
                        {activeDemo.currentSessionTitle}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{activeDemo.currentSessionTime}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-mono font-medium">
                      {activeDemo.currentSessionNote}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-200">
                        Module {activeDemo.currentModuleNum}: {activeDemo.currentModuleName}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">IN PROGRESS</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cohort' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Cohort Pod B Members</h3>
                    <p className="text-xs text-slate-400">Accountability pods with peer progress transparency</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Private Directory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: activeDemo.memberName, role: "Pod Lead", status: "Active Now", progress: "74%" },
                    { name: "Sarah Vance", role: "Operator", status: "Active 2h ago", progress: "84%" },
                    { name: "Marcus Thorne", role: "Participant", status: "Active yesterday", progress: "72%" },
                    { name: "Elena Rostova", role: "Founder", status: "Active 3d ago", progress: "45%" },
                  ].map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{activeDemo.totalWeeks}-Week Program Roadmap</h3>
                  <span className="text-xs text-orange-400 font-mono">Week {activeDemo.currentWeek} Active</span>
                </div>
                <div className="space-y-3">
                  {[
                    { week: "Week 1-2", title: "Diagnostic & Core System Architecture", status: "Completed", color: "text-emerald-400" },
                    { week: "Week 3-4", title: activeDemo.currentModuleName, status: "In Progress", color: "text-orange-400" },
                    { week: "Week 5-8", title: "Scale Sprints & Executive Milestones", status: "Locked", color: "text-slate-500" },
                    { week: `Week 9-${activeDemo.totalWeeks}`, title: "Graduation Deliverables & Peer Audits", status: "Locked", color: "text-slate-500" },
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
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
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      Operator Radar · Real-time Member Flags
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Cohort Health: Member Risk Management</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                    LIVE RADAR
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">
                          {activeDemo.operatorHighlight.flaggedName} —{' '}
                          <span className="text-rose-400">{activeDemo.operatorHighlight.flaggedStatus}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {activeDemo.operatorHighlight.flaggedReason}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      {activeDemo.operatorHighlight.actionLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Device Mock (< 768px) */}
      <div className="block md:hidden max-w-sm mx-auto">
        <div className="rounded-[28px] border-4 border-slate-800 bg-slate-950 p-3 shadow-2xl relative overflow-hidden">
          <div className="w-24 h-3.5 bg-slate-800 rounded-b-xl mx-auto mb-3" />
          <div className="bg-slate-900 border border-white/[0.08] rounded-xl p-4 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase truncate block max-w-[170px]">
                  {activeDemo.name}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {activeDemo.memberName.split(' ')[0]}'s Portal
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600 text-white font-bold font-mono">
                Week {activeDemo.currentWeek}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-400 font-mono">UPCOMING SESSION</span>
              <p className="text-xs font-bold text-white">{activeDemo.currentSessionTitle}</p>
              <p className="text-[10px] text-slate-400">{activeDemo.currentSessionTime}</p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400">OPERATOR RADAR</span>
              <p className="text-xs font-bold text-white">{activeDemo.operatorHighlight.flaggedName}</p>
              <p className="text-[10px] text-slate-300">{activeDemo.operatorHighlight.flaggedStatus}</p>
            </div>

            <a
              href={activeDemo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleOpenFullDemo(activeDemo)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              <span>Open Live Portal ({activeDemo.domain})</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Custom Program Callout Banner */}
      <div className="mt-8 p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase text-orange-400 tracking-wider font-semibold">
            Custom Cohort Preview
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            Want to see your curriculum and brand inside a custom portal?
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Send us your sales page or curriculum URL. We'll build an interactive, branded preview portal from your content in 24 hours — 100% free, no call, no credit card required.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openApplicationModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-xl text-sm font-semibold tracking-tight transition-colors cursor-pointer shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span>Get my free portal preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
