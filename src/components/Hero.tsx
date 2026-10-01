import React, { useState } from 'react';
import { openApplicationModal } from '../lib/events';
import { Calendar, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
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

        {/* Hero Portal High-Performance Asset Frame — Interactive & WOW */}
        <motion.div
          variants={assetFrameVariants}
          className={`mt-12 md:mt-16 w-full max-w-5xl rounded-2xl border ${
            isLight
              ? 'border-slate-200/90 bg-white/95 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.12)]'
              : 'border-white/[0.08] bg-slate-900/60 shadow-2xl backdrop-blur-2xl'
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
                Live Sample Portals:
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

          {/* Graphic Container with Clickable Interactive Trigger */}
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
              {/* Enticing Always-Visible Floating Specimen Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-mono font-semibold backdrop-blur-md shadow-xl transition-all duration-300 group-hover/screen:scale-105 ${
                  isLight
                    ? 'bg-white/95 text-slate-900 border border-slate-200/90 shadow-slate-900/5'
                    : 'bg-slate-950/90 text-white border border-orange-500/40 shadow-black/50'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Live Interactive Specimen:</span>
                  <span className="font-bold text-orange-500">Click to Explore ↗</span>
                </div>
              </div>

              {/* Dynamic Theme & Cohort Aware High-Resolution Sample Graphic */}
              {(() => {
                const sampleKey = activeCohortId === 'aldermoor' ? 'aldermoor' : activeCohortId === 'agency' ? 'northline' : 'harbourline';
                const modeKey = isLight ? 'light' : 'dark';
                const imageSrc = `/images/hero-${sampleKey}-${modeKey}.webp`;
                const imageSrc2x = `/images/hero-${sampleKey}-${modeKey}-2x.webp`;

                return (
                  <img
                    key={`${sampleKey}-${modeKey}`}
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
                );
              })()}

              {/* Floating Interactive Hover CTA Card */}
              <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px] opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 pointer-events-none">
                <div className={`px-6 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3.5 transform translate-y-2 group-hover/screen:translate-y-0 transition-transform duration-300 ${
                  isLight
                    ? 'bg-white/95 border-orange-500/40 text-slate-900 shadow-slate-900/10'
                    : 'bg-slate-950/95 border-orange-500/60 text-white shadow-black/60'
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

          {/* Sub-bar showing active cohort highlights */}
          <div className={`mt-2.5 px-3.5 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors duration-300 ${
            isLight
              ? 'bg-slate-50/90 border-slate-200/80 text-slate-700'
              : 'bg-slate-950/60 border-white/[0.04] text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>
                <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentSample.name}:</strong> {currentSample.subtitle}
              </span>
            </div>
            <div className={`flex items-center gap-4 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Active Student: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentSample.memberName}</strong></span>
              <span className={isLight ? 'text-slate-300' : 'text-white/20'}>·</span>
              <span className="text-emerald-500 font-semibold">{currentSample.stat1Label}: {currentSample.stat1Val}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

