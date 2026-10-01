import React, { useState } from 'react';
import { openApplicationModal } from '../lib/events';
import { Calendar, ExternalLink, Sparkles, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const CAL_URL = 'https://cal.com/morningcrest/portal-fit-call';

interface HeroProps {
  onOpenModal?: () => void;
}

interface CohortSample {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  domain: string;
  url: string;
  subtitle: string;
  memberName: string;
  memberRole: string;
  weekHeadline: string;
  stat1Label: string;
  stat1Val: string;
  stat2Label: string;
  stat2Val: string;
  stat3Label: string;
  stat3Val: string;
  accentColor: string;
  trustDescription: string;
  cohortSpecs: string;
}

const SAMPLE_COHORTS: CohortSample[] = [
  {
    id: 'leadership',
    name: 'Harbourline Institute',
    shortName: 'HI',
    badge: 'Executive Leadership',
    domain: 'leadership.cohortroom.com',
    url: 'https://leadership.cohortroom.com',
    subtitle: '10-Week Executive Transition · 22 Participants',
    memberName: 'Priya Raman',
    memberRole: 'VP Operations · Leadership Pod B',
    weekHeadline: 'Week 4: Strategic Prioritization & Executive Influence',
    stat1Label: 'Curriculum Progress',
    stat1Val: '70% (4/10 Wks)',
    stat2Label: 'Live Session',
    stat2Val: 'Thu @ 11:00 AM ET',
    stat3Label: 'Peer Review',
    stat3Val: '9.4/10 (Top 5%)',
    accentColor: '#ea580c',
    trustDescription: 'A 10-week executive transition cohort for 22 senior leaders. Fully customized curriculum with 360 stakeholder feedback radar, live Zoom synchronization, and structured pod deliverables.',
    cohortSpecs: '10-Week Executive Sequence · 22 Participants · Zoom Synced',
  },
  {
    id: 'aldermoor',
    name: 'Aldermoor Coaching',
    shortName: 'ACI',
    badge: 'ICF Credential Pathway',
    domain: 'certification.cohortroom.com',
    url: 'https://certification.cohortroom.com',
    subtitle: '30-Week Accredited Coach Certification · 20 Coaches',
    memberName: 'Rachel Kim',
    memberRole: 'PCC Track · VP People · Cohort 14',
    weekHeadline: 'Module 5: Building Your Coaching Practice & Client Acquisition',
    stat1Label: 'ICF PCC Readiness',
    stat1Val: '34% (68/125 hrs)',
    stat2Label: 'Group Mentor',
    stat2Val: 'Tue @ 12:00 PM ET',
    stat3Label: 'Coaching Log',
    stat3Val: '212 / 500 hrs',
    accentColor: '#10b981',
    trustDescription: 'A 30-week accredited ICF coach certification pathway for 20 coaches, tracking 500 practicum hours, triad peer coaching, and formal mentor evaluations.',
    cohortSpecs: '30-Week ICF Pathway · 20 Coaches · 500h Log Tracker',
  },
  {
    id: 'agency',
    name: 'Northline Collective',
    shortName: 'NC',
    badge: 'Agency Mastermind',
    domain: 'agency.cohortroom.com',
    url: 'https://agency.cohortroom.com',
    subtitle: '16-Week Operator to Owner Sprint · 24 Agency Owners',
    memberName: 'Nate Calloway',
    memberRole: 'Agency Founder · Sprint Pod B',
    weekHeadline: 'Sprint 4: Margin Health, Delegation & Retainer Architecture',
    stat1Label: 'Monthly Recurring Revenue',
    stat1Val: '$47,000 MRR (+38%)',
    stat2Label: 'Sprint Mastermind',
    stat2Val: 'Wed @ 12:00 PM ET',
    stat3Label: 'Target Margin',
    stat3Val: '64% Gross Profit',
    accentColor: '#8b5cf6',
    trustDescription: 'A 16-week agency mastermind for 24 agency founders transitioning from operator to owner, tracking monthly MRR growth ($47K current) and gross profit margin health.',
    cohortSpecs: '16-Week Mastermind · 24 Agency Owners · MRR Tracker',
  },
];

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const kickerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING,
    },
  },
};

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: EASING, // Linear & Raycast easeOutExpo
    },
  },
};

const subheadVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASING,
    },
  },
};

const ctaGroupVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.65,
      ease: EASING,
    },
  },
};

const ctaButtonVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: EASING,
    },
  },
};

const microcopyVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
};

const assetFrameVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: EASING,
    },
  },
};

export default function Hero({ onOpenModal }: HeroProps) {
  const { isLight } = useTheme();
  const [activeCohortId, setActiveCohortId] = useState<string>('leadership');

  const currentSample = SAMPLE_COHORTS.find(c => c.id === activeCohortId) || SAMPLE_COHORTS[0];

  const handlePrimaryCTA = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoSection = document.getElementById('live-demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-24 px-6 max-w-6xl mx-auto text-center flex flex-col items-center relative">
      <motion.div
        className="flex flex-col items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Category Descriptor - Refined Editorial Kicker */}
        <motion.p
          variants={kickerVariants}
          className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-4 sm:mb-6"
        >
          The member retention layer for high-ticket cohort programs
        </motion.p>

        {/* H1 Headline */}
        <motion.h1
          variants={headlineVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-[-0.03em] text-white mb-6 leading-[1.06] max-w-4xl"
        >
          Every cohort, you lose members you could have saved.
        </motion.h1>

        {/* Hero Subhead */}
        <motion.p
          variants={subheadVariants}
          className="text-lg md:text-xl text-slate-300/90 max-w-2xl mb-10 leading-relaxed font-normal"
        >
          One branded home for your program. One dashboard showing exactly who's falling behind. Live before your next cohort starts.
        </motion.p>

        {/* Primary CTA & Microcopy with Staggered Entrance */}
        <motion.div
          variants={ctaGroupVariants}
          className="flex flex-col items-center w-full max-w-xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <motion.button
              variants={ctaButtonVariants}
              onClick={handlePrimaryCTA}
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-7 py-3.5 text-base font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors w-full sm:w-auto cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <span>Get my free portal preview</span>
            </motion.button>
            <motion.a
              variants={ctaButtonVariants}
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white px-5 py-3.5 text-sm font-medium tracking-tight rounded-xl border border-white/[0.12] hover:border-white/25 transition-all w-full sm:w-auto cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <Calendar className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Book 20-Min Fit Call</span>
              <span className="text-slate-500 text-xs">↗</span>
            </motion.a>
          </div>

          {/* Microcopy Reassurance */}
          <motion.div
            variants={microcopyVariants}
            className="flex flex-col items-center mt-3.5 gap-1"
          >
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Free preview in 24h · No call required · Or book a call if you prefer to speak first
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-medium">
              <span>Live 7 days before your start date, or you don't pay.</span>
            </div>
          </motion.div>

          {/* Secondary Text Link */}
          <motion.a
            variants={microcopyVariants}
            href="#live-demo"
            onClick={scrollToDemo}
            className="mt-6 inline-flex items-center gap-1 text-xs font-mono tracking-wider text-slate-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
          >
            <span>SEE LIVE DEMO PORTAL</span>
            <span className="text-orange-400">↓</span>
          </motion.a>
        </motion.div>

        {/* Hero Portal High-Performance Asset Frame — Interactive & WOW with Glassmorphism Overlays */}
        <div className="relative mt-12 md:mt-16 w-full max-w-5xl">
          {/* Ambient Glow Backdrop to make the mockup pop in both light and dark themes */}
          <div
            className="absolute -inset-2 sm:-inset-4 rounded-3xl opacity-35 dark:opacity-25 blur-3xl pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 35%, ${currentSample.accentColor} 0%, transparent 72%)`,
            }}
          />

          <motion.div
            variants={assetFrameVariants}
            className={`w-full rounded-2xl border ${
              isLight
                ? 'border-slate-200/90 bg-white/95 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.12)]'
                : 'border-white/[0.08] bg-slate-900/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
            } p-2.5 sm:p-3 relative overflow-hidden group transition-all duration-300`}
          >
            {/* Interactive Cohort Selector Segmented Bar */}
            <div className="mb-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-1">
              <div className={`flex items-center gap-1.5 p-1 rounded-xl border shadow-inner ${
                isLight ? 'bg-slate-100/90 border-slate-200/80' : 'bg-slate-950/80 border-white/[0.08]'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 hidden md:inline ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Live Client Portals:
                </span>
                {SAMPLE_COHORTS.map(cohort => {
                  const isSelected = cohort.id === activeCohortId;
                  return (
                    <button
                      key={cohort.id}
                      type="button"
                      onClick={() => setActiveCohortId(cohort.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{cohort.name.split(' ')[0]}</span>
                      <span className="text-[10px] font-normal opacity-85 hidden lg:inline">({cohort.badge.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>

              {/* Direct Launch Button */}
              <a
                href={currentSample.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300/80'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
                title={`Open ${currentSample.name} in full live tab`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Launch {currentSample.domain}</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>

            {/* Browser Window Header */}
            <div className={`flex items-center justify-between px-3 py-2 border-b mb-2 text-xs font-mono ${
              isLight ? 'border-slate-200/80 text-slate-500' : 'border-white/[0.06] text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              
              {/* Clickable Active Domain Pill */}
              <a
                href={currentSample.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-orange-500/50 text-slate-800'
                    : 'bg-slate-950/70 hover:bg-slate-950 border-white/[0.08] hover:border-orange-500/40 text-slate-200 hover:text-white'
                }`}
              >
                <span className="text-emerald-500">●</span>
                <span className="font-semibold">{currentSample.domain}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>

              <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold ${
                isLight ? 'text-orange-600' : 'text-orange-400'
              }`}>
                <span>MEMBER PORTAL</span>
              </div>
            </div>

            {/* Graphic Container with Clickable Interactive Trigger & Layered Glass Overlays */}
            <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
              isLight ? 'border-slate-200/90 bg-slate-50' : 'border-white/[0.08] bg-slate-950'
            }`}>
              <a
                href={currentSample.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open interactive live sample portal: ${currentSample.name}`}
                className="block group/screen relative cursor-pointer"
              >
                {/* Glassmorphism Floating Badge 1 (Top-Right): Verified Live Room */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                  <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-mono font-semibold backdrop-blur-xl shadow-lg border transition-all duration-300 group-hover/screen:scale-105 ${
                    isLight
                      ? 'bg-white/85 text-slate-900 border-slate-200/90 shadow-slate-900/5'
                      : 'bg-slate-950/85 text-white border-white/15 shadow-black/60'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline">Verified Client Room:</span>
                    <span className="font-bold" style={{ color: currentSample.accentColor }}>{currentSample.name.split(' ')[0]} ↗</span>
                  </div>
                </div>

                {/* Glassmorphism Floating Card 2 (Bottom-Left): Active Telemetry Badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none max-w-[260px] sm:max-w-xs">
                  <div className={`p-2.5 sm:p-3 rounded-xl backdrop-blur-xl border shadow-xl flex items-center gap-2.5 transition-all duration-300 ${
                    isLight
                      ? 'bg-white/85 border-slate-200/90 text-slate-800 shadow-slate-900/5'
                      : 'bg-slate-950/85 border-white/15 text-slate-200 shadow-black/60'
                  }`}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${currentSample.accentColor}25`, border: `1px solid ${currentSample.accentColor}50` }}
                    >
                      <ShieldCheck className="w-4 h-4" style={{ color: currentSample.accentColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {currentSample.name}
                      </p>
                      <p className="text-[10px] font-mono opacity-80 truncate">
                        {currentSample.stat1Label}: <span className="font-semibold text-emerald-500">{currentSample.stat1Val}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Theme & Cohort Aware High-Resolution Sample Graphic with Entry Animation */}
                {(() => {
                  const sampleKey = activeCohortId === 'aldermoor' ? 'aldermoor' : activeCohortId === 'agency' ? 'northline' : 'harbourline';
                  const modeKey = isLight ? 'light' : 'dark';
                  const imageSrc = `/images/hero-${sampleKey}-${modeKey}.webp`;
                  const imageSrc2x = `/images/hero-${sampleKey}-${modeKey}-2x.webp`;

                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${sampleKey}-${modeKey}`}
                        initial={{ opacity: 0, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.995 }}
                        transition={{ duration: 0.28, ease: EASING }}
                        className="relative w-full"
                      >
                        <img
                          src={imageSrc}
                          srcSet={`${imageSrc} 1x, ${imageSrc2x} 2x`}
                          width={1200}
                          height={675}
                          alt={`${currentSample.name} Cohort Member Portal Interface Preview (${currentSample.domain})`}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover/screen:scale-[1.015]"
                        />
                      </motion.div>
                    </AnimatePresence>
                  );
                })()}

                {/* Floating Interactive Hover CTA Card with Glassmorphism */}
                <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px] opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 pointer-events-none z-30">
                  <div className={`px-6 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3.5 transform translate-y-2 group-hover/screen:translate-y-0 transition-transform duration-300 backdrop-blur-xl ${
                    isLight
                      ? 'bg-white/95 border-orange-500/40 text-slate-900 shadow-slate-900/10'
                      : 'bg-slate-950/95 border-orange-500/60 text-white shadow-black/70'
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="text-left font-sans">
                      <p className={`text-sm font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <span>Launch Live {currentSample.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                      </p>
                      <p className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        Full interactive member room on {currentSample.domain}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Trust-Building Client Caption Block referencing Aldermoor, Harbourline, and Northline */}
            <div className={`mt-3 p-3.5 sm:p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 ${
              isLight
                ? 'bg-slate-50/90 border-slate-200/90 text-slate-800 shadow-sm'
                : 'bg-slate-950/70 border-white/[0.08] text-slate-200 shadow-lg'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 mb-2.5 border-b border-inherit/40">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live Client Portal Specimen
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                  <span className="text-xs font-mono font-bold" style={{ color: currentSample.accentColor }}>
                    {currentSample.domain}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Built &amp; Hosted in 24 Hours</span>
                </div>
              </div>

              <p className={`text-xs sm:text-[13px] leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <strong className={isLight ? 'text-slate-950 font-bold' : 'text-white font-bold'}>
                  {currentSample.name}
                </strong>
                {' — '}
                {currentSample.trustDescription}
              </p>

              <div className="mt-2.5 pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-inherit/30">
                <div className="flex items-center gap-3">
                  <span>Track: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentSample.badge}</span></span>
                  <span>·</span>
                  <span>Active Member: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentSample.memberName}</span></span>
                </div>
                <a
                  href={currentSample.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <span>Test-drive {currentSample.name.split(' ')[0]} live room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

