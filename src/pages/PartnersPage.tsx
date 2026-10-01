import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  Loader2, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Eye, 
  Shield, 
  Award, 
  Zap, 
  AlertCircle,
  HelpCircle,
  Mail,
  User,
  Globe,
  Calendar,
  Layers,
  Calculator,
  TrendingUp,
  Sun,
  Moon,
  Plus,
  Minus,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackAction } from '../lib/tracker';
import { useTheme } from '../context/ThemeContext';
import EarningsSparkline from '../components/EarningsSparkline';

const PLANS_CONFIG = {
  essential: {
    id: 'essential',
    name: 'Essential',
    tag: 'One-off Cohorts',
    clientPrice: '$1,997 + $297/mo',
    signingFee: 500,
    retentionBonus: 250,
    totalPerClient: 750,
    clientFreeMonthValue: '$297',
    desc: 'For one program running one cohort at a time.',
  },
  signature: {
    id: 'signature',
    name: 'Signature',
    tag: 'Most Popular',
    clientPrice: '$3,497 + $497/mo',
    signingFee: 1000,
    retentionBonus: 500,
    totalPerClient: 1500,
    clientFreeMonthValue: '$497',
    desc: 'For active programs running cohorts back-to-back.',
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    tag: 'High-Volume Academies',
    clientPrice: '$5,997 + $797/mo',
    signingFee: 1500,
    retentionBonus: 750,
    totalPerClient: 2250,
    clientFreeMonthValue: '$797',
    desc: 'For academies and institutions with multiple parallel tracks.',
  },
} as const;

type PlanKey = keyof typeof PLANS_CONFIG;

const checkEmailFormat = (val: string): boolean => {
  const trimmed = val.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmed);
};

const checkUrlFormat = (val: string): boolean => {
  const trimmed = val.trim();
  if (!trimmed) return false;
  return /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i.test(trimmed);
};

const sanitizeRefCode = (val: string): string => {
  return val.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
};

export default function PartnersPage() {
  const { theme, toggleTheme, isLight } = useTheme();

  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Referral form state
  const [referData, setReferData] = useState({
    name: '',
    email: '',
    referralCode: '',
    clientProgramUrl: '',
    cohortDate: '',
    notes: '',
    previewRecipient: 'to_me', // 'to_me' or 'to_client'
  });
  const [referErrors, setReferErrors] = useState<Record<string, string>>({});
  const [referTouched, setReferTouched] = useState<Record<string, boolean>>({});
  const [isReferSubmitting, setIsReferSubmitting] = useState(false);
  const [isReferSuccess, setIsReferSuccess] = useState(false);

  // Partner signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    whatYouDo: '',
    groupClientsCount: '',
    websiteOrLinkedIn: '',
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupTouched, setSignupTouched] = useState<Record<string, boolean>>({});
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Interactive Earnings Calculator state
  const [calcPlan, setCalcPlan] = useState<PlanKey>('signature');
  const [calcClients, setCalcClients] = useState<number>(3);
  const [isEarningsTooltipOpen, setIsEarningsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Close tooltip on outside click or Escape
  useEffect(() => {
    if (!isEarningsTooltipOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsEarningsTooltipOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEarningsTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEarningsTooltipOpen]);

  // Prefill referral code from ?ref= or pb_ref in sessionStorage
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRef = searchParams.get('ref') || '';
      const storedRef = sessionStorage.getItem('pb_ref') || '';
      const activeRef = sanitizeRefCode(urlRef || storedRef);
      if (activeRef) {
        setReferData(prev => ({ ...prev, referralCode: activeRef }));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleReferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'referralCode' ? sanitizeRefCode(value) : value;
    setReferData(prev => ({ ...prev, [name]: finalValue }));
    setReferTouched(prev => ({ ...prev, [name]: true }));
    if (referErrors[name]) {
      setReferErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setSignupTouched(prev => ({ ...prev, [name]: true }));
    if (signupErrors[name]) {
      setSignupErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateReferForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!referData.name.trim()) {
      errors.name = 'Please provide your name.';
    }
    if (!referData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!checkEmailFormat(referData.email)) {
      errors.email = 'Please provide a valid work email address.';
    }
    if (!referData.clientProgramUrl.trim()) {
      errors.clientProgramUrl = "Please provide the client's programme page link.";
    } else if (!checkUrlFormat(referData.clientProgramUrl)) {
      errors.clientProgramUrl = 'Please provide a valid URL with a domain (e.g. clientprogram.com).';
    }
    setReferErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!signupData.name.trim()) {
      errors.name = 'Please provide your name.';
    }
    if (!signupData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!checkEmailFormat(signupData.email)) {
      errors.email = 'Please provide a valid work email address.';
    }
    if (!signupData.whatYouDo) {
      errors.whatYouDo = 'Please select what you do.';
    }
    if (!signupData.groupClientsCount) {
      errors.groupClientsCount = 'Please select how many of your clients run group programmes.';
    }
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferTouched({
      name: true,
      email: true,
      clientProgramUrl: true,
    });
    if (!validateReferForm()) return;

    setIsReferSubmitting(true);
    const payload = {
      ...referData,
      referralCode: sanitizeRefCode(referData.referralCode),
      status: 'pending_partner_review',
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(collection(db, 'partner_referrals'));
      await setDoc(docRef, { ...payload, id: docRef.id });

      const existingLocal = localStorage.getItem('local_partner_referrals');
      let list = existingLocal ? JSON.parse(existingLocal) : [];
      list.unshift({ ...payload, id: docRef.id });
      localStorage.setItem('local_partner_referrals', JSON.stringify(list));

      fetch('/api/partner-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: docRef.id }),
      }).catch(err => console.warn('Partner referral notify notice:', err));

      trackAction('partner_referral_submitted', {
        category: 'conversion',
        label: `Partner Referral: ${payload.name}`,
        metadata: { email: payload.email, clientUrl: payload.clientProgramUrl },
      });

      setIsReferSubmitting(false);
      setIsReferSuccess(true);
    } catch (err) {
      console.error('Firestore save failed, fallback local store:', err);
      const fallbackId = 'ref-' + Math.random().toString(36).substring(2, 9);
      const existingLocal = localStorage.getItem('local_partner_referrals');
      let list = existingLocal ? JSON.parse(existingLocal) : [];
      list.unshift({ ...payload, id: fallbackId });
      localStorage.setItem('local_partner_referrals', JSON.stringify(list));

      fetch('/api/partner-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: fallbackId }),
      }).catch(err => console.warn('Partner referral notify notice:', err));

      setIsReferSubmitting(false);
      setIsReferSuccess(true);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupTouched({
      name: true,
      email: true,
      whatYouDo: true,
      groupClientsCount: true,
    });
    if (!validateSignupForm()) return;

    setIsSignupSubmitting(true);
    const payload = {
      ...signupData,
      status: 'pending_partner_approval',
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(collection(db, 'partner_signups'));
      await setDoc(docRef, { ...payload, id: docRef.id });

      const existingLocal = localStorage.getItem('local_partner_signups');
      let list = existingLocal ? JSON.parse(existingLocal) : [];
      list.unshift({ ...payload, id: docRef.id });
      localStorage.setItem('local_partner_signups', JSON.stringify(list));

      fetch('/api/partner-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: docRef.id }),
      }).catch(err => console.warn('Partner signup notify notice:', err));

      trackAction('partner_signup_submitted', {
        category: 'conversion',
        label: `Partner Code Request: ${payload.name}`,
        metadata: { email: payload.email, role: payload.whatYouDo },
      });

      setIsSignupSubmitting(false);
      setIsSignupSuccess(true);
    } catch (err) {
      console.error('Firestore save failed, fallback local store:', err);
      const fallbackId = 'signup-' + Math.random().toString(36).substring(2, 9);
      const existingLocal = localStorage.getItem('local_partner_signups');
      let list = existingLocal ? JSON.parse(existingLocal) : [];
      list.unshift({ ...payload, id: fallbackId });
      localStorage.setItem('local_partner_signups', JSON.stringify(list));

      fetch('/api/partner-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: fallbackId }),
      }).catch(err => console.warn('Partner signup notify notice:', err));

      setIsSignupSubmitting(false);
      setIsSignupSuccess(true);
    }
  };

  const faqs = [
    {
      q: 'Do I have to sell anything?',
      a: 'No. You make an intro or send a link. We build the preview, run the call and deliver the portal.',
    },
    {
      q: 'Will my client have to leave Circle / Kajabi / Skool?',
      a: 'No. The portal sits alongside what they use. Nothing migrates.',
    },
    {
      q: "What if they don't buy?",
      a: 'Nothing happens. The preview was free, and your relationship is untouched.',
    },
    {
      q: 'When do I get paid?',
      a: "The signing fee within 7 days of your client's deposit clearing, and the retention bonus within 7 days of their third paid month. By Wise or PayPal.",
    },
    {
      q: "What if my client isn't a fit?",
      a: "We'll tell them kindly, and tell you exactly why, so the next intro lands.",
    },
    {
      q: 'I build portals myself. Is this competition?',
      a: "It doesn't have to be. White-label at 30% off list gives you a product without the build time.",
    },
  ];

  const currentPlan = PLANS_CONFIG[calcPlan];
  const upfrontPayout = currentPlan.signingFee * calcClients;
  const retentionPayout = currentPlan.retentionBonus * calcClients;
  const milestoneBonus = calcClients >= 3 ? 1000 : 0;
  const totalCommission = upfrontPayout + retentionPayout + milestoneBonus;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-slate-100'} font-sans selection:bg-orange-500/30 selection:text-orange-50 partners-page transition-colors duration-300`}>
      {/* Top Header Bar / Brand Lockup matching site */}
      <header className={`border-b ${isLight ? 'border-slate-200/80 bg-white/85' : 'border-white/[0.08] bg-slate-950/80'} backdrop-blur-md sticky top-0 z-50 transition-colors`}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackHome}
              aria-label="Back to PortalBuild Home"
              className={`w-9 h-9 rounded-xl ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-white/10'} border flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer`}
            >
              <span className="w-3 h-3 rounded-sm bg-orange-500" />
            </button>
            <div className="flex flex-col text-left">
              <span className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} leading-tight`}>
                PortalBuild
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-tight -mt-0.5">
                a MorningCrest Solutions Company
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Partner page navigation" className={`hidden lg:flex items-center gap-7 text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className={`${isLight ? 'hover:text-slate-900' : 'hover:text-white'} transition-colors cursor-pointer`}
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('demos')}
              className={`${isLight ? 'hover:text-slate-900' : 'hover:text-white'} transition-colors cursor-pointer`}
            >
              Demos
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('commission')}
              className={`${isLight ? 'hover:text-slate-900' : 'hover:text-white'} transition-colors cursor-pointer`}
            >
              Commission
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('calculator')}
              className={`${isLight ? 'hover:text-slate-900' : 'hover:text-white'} transition-colors cursor-pointer`}
            >
              Calculator
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className={`${isLight ? 'hover:text-slate-900' : 'hover:text-white'} transition-colors cursor-pointer`}
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Return Home text link */}
            <button
              onClick={handleBackHome}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Return Home</span>
            </button>

            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20 bg-slate-900/60 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
              aria-label={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
              title={theme === 'light' ? "Activate dark theme" : "Activate light theme"}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" aria-hidden="true" /> : <Sun className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => scrollToSection('refer')}
              className="group relative inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 active:from-orange-600 active:to-orange-700 text-white font-semibold py-1.5 px-3.5 text-xs tracking-tight rounded-lg shadow-sm hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.35)] ring-1 ring-inset ring-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <span>Send a Client</span>
              <span className="text-orange-200 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <p className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-4 sm:mb-6">
          PortalBuild Partner Programme
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Your clients run cohorts. We build the portal underneath.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A branded participant portal and founder dashboard for cohort programmes. It sits alongside Circle, Kajabi or Skool with no migration. You make one intro; we do everything else, and you get paid.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('refer')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm tracking-tight shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Send a client's programme page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('demos')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>See the demos</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <p className="mt-5 text-xs text-slate-400 font-mono tracking-tight">
          Free branded preview in 24 hours · Their first month free · We never go around you
        </p>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Step-by-Step Model</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/[0.08] relative group hover:border-orange-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-orange-400 font-mono font-bold flex items-center justify-center mb-5 border border-white/10">
              1
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              Send a programme page
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Paste your client's programme link below, or forward us an intro. That's your whole job.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/[0.08] relative group hover:border-orange-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-orange-400 font-mono font-bold flex items-center justify-center mb-5 border border-white/10">
              2
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              We build a branded preview in 24 hours
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Their name, their modules, their dates. You hand it over and take the credit, or we send it with you cc'd.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/[0.08] relative group hover:border-orange-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-orange-400 font-mono font-bold flex items-center justify-center mb-5 border border-white/10">
              3
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              They sign, you get paid
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              $1,000 within 7 days of their deposit (Signature), $500 more when they stay. Live 7 days before their cohort opens, or they don't pay.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 3 — THE DEMOS */}
      <section id="demos" className="py-16 sm:py-20 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Live Demonstrations</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Three demos. Pick the one that looks like your client.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                Business programmes
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Masterminds and accelerators for founders and agency owners.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Results Board: members' growth becomes the next sales page</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Pods and hot-seat rota</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Quiet-member flags before week three</span>
                </li>
              </ul>
            </div>
            <a
              href="https://agency.cohortroom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold tracking-tight inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open demo</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                Professional programmes
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Leadership and professional development cohorts.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Cohort roster and live progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Quiet-member flags with the check-in already drafted</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Sponsor-ready progress reports</span>
                </li>
              </ul>
            </div>
            <a
              href="https://leadership.cohortroom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold tracking-tight inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open demo</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Card 3 (Newest) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-orange-500/40 relative flex flex-col justify-between shadow-lg shadow-orange-500/5">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-mono tracking-tight font-semibold">
                Newest
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                Certification programmes
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Coach schools and credential programmes (ICF, NBHWC).
              </p>
              <ul className="space-y-3 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Every participant's road to their credential, tracked after graduation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Credential-format logs, exported in one click</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>A built-in 90-second tour</span>
                </li>
              </ul>
            </div>
            <a
              href="https://certification.cohortroom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold tracking-tight inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Open demo</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 font-mono">
          All demo academies and people are fictional.
        </p>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 4 — THE SCREEN THAT SELLS IT */}
      <section className="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Browser Frame with Cockpit Screenshot */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="rounded-2xl border border-white/[0.12] bg-slate-950 p-2 shadow-2xl shadow-black/50 overflow-hidden group">
              {/* Subtle Browser Chrome Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 rounded-t-xl border-b border-white/[0.06] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 max-w-xs mx-auto text-center px-3 py-0.5 rounded-md bg-slate-950/70 border border-white/[0.06]">
                  <span className="text-[11px] font-mono text-slate-400 select-all">certification.cohortroom.com</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Clickable Image Linking to Faculty View */}
              <a
                href="https://certification.cohortroom.com/faculty"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative overflow-hidden rounded-lg group/link cursor-pointer"
                title="Open certification.cohortroom.com/faculty in a new tab"
              >
                <img
                  src="/images/cockpit-screenshot.png"
                  alt="Aldermoor Coaching Institute Cockpit Dashboard"
                  className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover/link:scale-[1.01]"
                  loading="lazy"
                />
              </a>
            </div>

            {/* Caption under the image */}
            <p className="text-xs text-slate-400 font-mono text-center sm:text-left px-1">
              The real founder view. Click to open it.
            </p>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Founder Value Proposition</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Founders buy the dashboard.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every participant, across every cohort, on one screen, with the ones going quiet flagged weeks before a refund request. That's the conversation your client has been having with themselves in a spreadsheet.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              One click on any flagged name writes the check-in and opens it in WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 5 — WHAT YOU EARN */}
      <section id="commission" className="py-16 sm:py-20 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Compensation Model</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            $1,000 when they sign. $500 more when they stay.
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Flat amounts, paid fast. And your client gets their first month free because they came through you.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/[0.08] bg-slate-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-slate-900/80 text-xs font-mono uppercase text-slate-400">
                <th className="py-4 px-6 font-semibold">Client plan</th>
                <th className="py-4 px-6 font-semibold">When they sign</th>
                <th className="py-4 px-6 font-semibold">When they pass 3 paid months</th>
                <th className="py-4 px-6 font-semibold text-orange-400">Total per client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Essential</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$500</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$250</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">$750</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Signature</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$1,000</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$500</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">$1,500</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Scale</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$1,500</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$750</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">$2,250</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="block sm:hidden space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Essential</span>
              <span className="text-orange-400 font-bold font-mono">$750 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they sign:</span>
              <span className="font-mono">$500</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they pass 3 paid months:</span>
              <span className="font-mono">$250</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Signature</span>
              <span className="text-orange-400 font-bold font-mono">$1,500 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they sign:</span>
              <span className="font-mono">$1,000</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they pass 3 paid months:</span>
              <span className="font-mono">$500</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Scale</span>
              <span className="text-orange-400 font-bold font-mono">$2,250 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they sign:</span>
              <span className="font-mono">$1,500</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>When they pass 3 paid months:</span>
              <span className="font-mono">$750</span>
            </div>
          </div>
        </div>

        {/* Three small points under the table */}
        <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs font-mono text-slate-400 text-center">
          <span>Signing fee paid within 7 days of your client's deposit.</span>
          <span className="hidden md:inline select-none text-slate-700">·</span>
          <span>Your 3rd signed client earns a one-off $1,000 bonus.</span>
          <span className="hidden md:inline select-none text-slate-700">·</span>
          <span>90-day attribution from your first intro or referral code.</span>
        </div>

        {/* Interactive Earnings Calculator — Editorial Clean Architecture */}
        <div id="calculator" className="mt-12 rounded-2xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl scroll-mt-20">
          {/* Top specular hairline edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/[0.06] blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* Header of Calculator */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/[0.08]">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-semibold uppercase tracking-widest text-orange-400">
                <Calculator className="w-3 h-3" />
                <span>Partner Economics · Yield Model</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Model your partner referral commission
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dual cash settlements wired directly to you: upfront upon client deposit, plus retention upside at month three.
              </p>
            </div>

            {/* Quick Settlement Badge */}
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/[0.08] flex items-center gap-3 shrink-0 self-start md:self-auto shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Settlement Guarantee</p>
                <p className="text-xs font-bold text-white">Within 7 days of deposit</p>
              </div>
            </div>
          </div>

          {/* Calculator Controls Grid */}
          <div className="grid lg:grid-cols-12 gap-8 pt-8">
            {/* Left Controls Column (Plan & Volume Segmented Controls) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Step 1: Select Plan Tier via Editorial Segmented Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Client Plan Tier</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    Total payout: <strong className="text-orange-400 font-bold">${currentPlan.totalPerClient.toLocaleString()}</strong> / client
                  </span>
                </div>

                {/* Segmented Control Bar */}
                <div className="p-1 rounded-xl bg-slate-950 border border-white/[0.08] grid grid-cols-3 gap-1 shadow-inner">
                  {(Object.keys(PLANS_CONFIG) as Array<PlanKey>).map((planKey) => {
                    const plan = PLANS_CONFIG[planKey];
                    const isSelected = calcPlan === planKey;
                    return (
                      <button
                        key={planKey}
                        type="button"
                        onClick={() => {
                          setCalcPlan(planKey);
                          trackAction('calculator_plan_changed', { category: 'engagement', label: plan.name });
                        }}
                        className={`relative py-3 px-3 rounded-lg text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-sm border border-white/10 ring-1 ring-orange-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                        }`}
                      >
                        {planKey === 'signature' && (
                          <span className="absolute -top-2.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-orange-500 text-white shadow-sm">
                            Most Popular
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-bold tracking-tight">
                          {plan.name}
                        </span>
                        <span className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                          ${plan.totalPerClient.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">/ client</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Editorial Tier Dossier Strip */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span className="text-slate-300 font-medium">
                      <strong className="text-white">{currentPlan.name}:</strong> {currentPlan.desc}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 shrink-0 flex items-center gap-2">
                    <span>Rate: <strong className="text-slate-200">{currentPlan.clientPrice}</strong></span>
                    <span className="text-white/20">|</span>
                    <span className="text-emerald-400 font-semibold">${currentPlan.signingFee} sign + ${currentPlan.retentionBonus} retain</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Select Client Volume via Segmented Controls (No Standard Slider) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Referred Clients in 12 Months</span>
                  </label>

                  {/* Interactive Fine-tune Stepper */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-white/[0.08] rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setCalcClients(Math.max(1, calcClients - 1))}
                      disabled={calcClients <= 1}
                      aria-label="Decrease client count"
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1.5 min-w-[2.5rem] text-center">
                      {calcClients} {calcClients === 1 ? 'Client' : 'Clients'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalcClients(Math.min(15, calcClients + 1))}
                      disabled={calcClients >= 15}
                      aria-label="Increase client count"
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Segmented Volume Preset Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 5, 8, 10].map((count) => {
                    const isSelected = calcClients === count;
                    const isMilestone = count === 3;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setCalcClients(count);
                          trackAction('calculator_volume_changed', { category: 'engagement', label: `${count}_clients` });
                        }}
                        className={`relative py-3 px-2 rounded-xl text-center transition-all cursor-pointer select-none border ${
                          isSelected
                            ? 'bg-slate-800 text-white border-orange-500/50 ring-1 ring-orange-500/30 shadow-md'
                            : 'bg-slate-950/70 border-white/[0.08] hover:border-white/[0.16] hover:bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        {isMilestone && (
                          <span className="absolute -top-2 inset-x-1 mx-auto text-[8px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-500/30 rounded py-0.5 px-1 shadow-sm">
                            +$1k Bonus
                          </span>
                        )}
                        <p className="text-xs font-mono font-bold">
                          {count} {count === 1 ? 'Client' : 'Clients'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {count === 1 ? 'Base' : count === 3 ? 'Milestone' : count >= 5 ? 'Scale' : 'Paced'}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Milestone Tier Reassurance Banner */}
                {calcClients >= 3 ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                    <span className="flex items-center gap-2 font-mono">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>$1,000 Milestone Bonus Unlocked</strong> (earned on your 3rd signed client)</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      Tier Activated
                    </span>
                  </div>
                ) : (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-950/40 border border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      <span>Refer {3 - calcClients} more {3 - calcClients === 1 ? 'client' : 'clients'} to unlock the one-off <strong>$1,000 Milestone Bonus</strong>.</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Display Bento Column: High-Contrast Editorial Typography */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-white/[0.12] relative shadow-2xl overflow-hidden">
              {/* Subtle radial ambient highlight */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.08] blur-[70px] rounded-full pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header Label & Micro-Indicator with Formula Tooltip Trigger */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 relative">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Total Potential Commission
                    </span>
                    {/* Subtle Icon-based Tooltip Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsEarningsTooltipOpen(!isEarningsTooltipOpen)}
                      className={`p-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        isEarningsTooltipOpen
                          ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                      }`}
                      aria-label="Explain how estimated earnings are derived"
                      title="Click to view earnings formula & payment mechanics"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono uppercase tracking-wider hidden sm:inline">Formula</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    Guaranteed Payout
                  </span>
                </div>

                {/* Animated Popover Tooltip explaining earnings mechanics */}
                <AnimatePresence>
                  {isEarningsTooltipOpen && (
                    <motion.div
                      ref={tooltipRef}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="p-4 rounded-xl bg-slate-900/95 border border-orange-500/40 shadow-2xl space-y-3 relative z-30 backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            Formula &amp; Payout Mechanics
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEarningsTooltipOpen(false)}
                          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
                          aria-label="Close tooltip"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs font-mono text-slate-300">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-white/[0.08] text-orange-300 font-bold flex flex-wrap items-center justify-between gap-1 shadow-inner">
                          <span>(${currentPlan.signingFee} upfront + ${currentPlan.retentionBonus} retain) × {calcClients} clients {milestoneBonus > 0 ? '+ $1,000 Milestone Bonus' : ''}</span>
                          <span className="text-white font-extrabold text-sm">= ${totalCommission.toLocaleString()}</span>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed list-disc list-inside pt-1">
                          <li>
                            <strong className="text-white">Upfront Wire Payout:</strong> ${currentPlan.signingFee} per client, wired within 7 business days of client deposit.
                          </li>
                          <li>
                            <strong className="text-white">Quarterly Retention:</strong> ${currentPlan.retentionBonus} per client, wired within 7 business days of their 3rd paid month.
                          </li>
                          <li>
                            <strong className="text-white">Milestone Accelerator:</strong> One-off $1,000 cash bonus unlocked automatically upon your 3rd client signing.
                          </li>
                          <li>
                            <strong className="text-white">Client Free Month:</strong> Your client receives their 1st month free ({currentPlan.clientFreeMonthValue} value) exclusively because they came through your intro.
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* High-Contrast Primary Number Display & D3 Sparkline Chart */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-mono tracking-tight leading-none drop-shadow-sm">
                        ${totalCommission.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                        USD
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 mt-2 flex items-center gap-2">
                      <span>Yield:</span>
                      <strong className="text-orange-400 font-bold font-mono">
                        ${Math.round(totalCommission / calcClients).toLocaleString()}
                      </strong>
                      <span className="text-slate-500">average cash earned per client</span>
                    </p>
                  </div>

                  {/* D3 Non-obtrusive Sparkline Chart */}
                  <div className="shrink-0 p-2.5 rounded-xl bg-slate-950/70 border border-white/[0.08] shadow-inner self-start sm:self-auto flex items-center justify-center">
                    <EarningsSparkline
                      currentPlanId={calcPlan}
                      signingFee={currentPlan.signingFee}
                      retentionBonus={currentPlan.retentionBonus}
                      activeClients={calcClients}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Financial Statement / Structured Settlement Breakdown */}
                <div className="space-y-3 pt-4 border-t border-white/[0.08] text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Upfront Signing Fees</span>
                    </span>
                    <span className="text-white font-bold">${upfrontPayout.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-3.5 -mt-1.5">
                    ${currentPlan.signingFee} × {calcClients} client{calcClients > 1 ? 's' : ''} (wired within 7 days of deposit)
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Quarterly Retention Bonuses</span>
                    </span>
                    <span className="text-white font-bold">${retentionPayout.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-3.5 -mt-1.5">
                    ${currentPlan.retentionBonus} × {calcClients} client{calcClients > 1 ? 's' : ''} (wired at month 3 milestone)
                  </p>

                  {milestoneBonus > 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>3rd Client Milestone Bonus</span>
                        </span>
                        <span>+$1,000</span>
                      </div>
                      <p className="text-[10px] text-emerald-400/80 mt-0.5">
                        One-off cash accelerator awarded upon 3rd signed client
                      </p>
                    </div>
                  )}

                  {/* Exclusive Client Benefit Callout */}
                  <div className="p-3 rounded-lg bg-orange-500/[0.06] border border-orange-500/20 text-[11px] text-slate-300 leading-relaxed mt-2">
                    <span className="text-orange-400 font-semibold block mb-0.5">Your Client's Incentive:</span>
                    First month free (<strong className="text-white">{currentPlan.clientFreeMonthValue} value</strong>) automatically applied via your introduction.
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('refer');
                    trackAction('calculator_cta_clicked', { category: 'intent', label: currentPlan.name });
                  }}
                  className="group relative w-full py-3 px-4 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 active:from-orange-600 text-white font-semibold text-xs tracking-tight shadow-md hover:shadow-[0_0_25px_-3px_rgba(249,115,22,0.4)] ring-1 ring-inset ring-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Refer a Client on {currentPlan.name} (${currentPlan.totalPerClient.toLocaleString()})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Callout Card */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/80 border border-white/[0.1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              Rather deliver it under your own name?
            </h3>
            <p className="text-xs text-slate-300">
              White-label at 30% off list. You set the price and keep the client; we build it invisibly.
            </p>
          </div>
          <a
            href="mailto:hello@cohortroom.com?subject=White-label%20partner"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold tracking-tight shrink-0 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Ask about white-label</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 6 — OUR PROMISE TO PARTNERS */}
      <section className="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Relationship Standard</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Our promise to partners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-orange-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                We never go around you
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                No pitching your client anything else. Their relationship stays yours.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-orange-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                You're cc'd on everything
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A one-line update at every stage: preview sent, call booked, signed.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-orange-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                Two-hour replies
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The speed you'd want your client to get.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                A guarantee that protects you
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Live 7 days before their cohort opens, or the build fee is refunded in full.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 7 — WHO'S A FIT */}
      <section className="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Referral Qualification</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Send us founders running…
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-slate-200">
              A named programme with cohort dates
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-slate-200">
              $2,000+ per seat
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-slate-200">
              15+ participants per cohort
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-slate-200">
              The founder makes the decision
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs sm:text-sm text-slate-400">
          Not a fit? Tell us anyway. We'll say so straight, and tell you why.
        </p>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 8 — REFER A CLIENT */}
      <section id="refer" className="py-16 sm:py-20 px-6 max-w-3xl mx-auto scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Direct Intake</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Send a client's programme page
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            We'll build a branded preview within 24 hours and send it to you first.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-xl">
          {isReferSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Got it. Your preview will be with you within 24 hours. Watch for an email from James.
              </h3>
            </div>
          ) : (
            <form onSubmit={handleReferSubmit} noValidate className="space-y-4">
              <input type="hidden" name="form-name" value="partner-referral" />

              {/* Your name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Your name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={referData.name}
                  onChange={handleReferChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    referErrors.name && referTouched.name
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                  placeholder="Your full name"
                />
                {referErrors.name && referTouched.name && (
                  <p className="text-red-400 text-xs pl-1">{referErrors.name}</p>
                )}
              </div>

              {/* Your email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Your email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={referData.email}
                  onChange={handleReferChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    referErrors.email && referTouched.email
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                  placeholder="you@yourdomain.com"
                />
                {referErrors.email && referTouched.email && (
                  <p className="text-red-400 text-xs pl-1">{referErrors.email}</p>
                )}
              </div>

              {/* Your referral code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Your referral code <span className="text-slate-500 text-[11px] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="referralCode"
                  maxLength={20}
                  value={referData.referralCode}
                  onChange={handleReferChange}
                  className="w-full bg-slate-900/90 border border-white/[0.12] focus:border-orange-500 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none font-mono uppercase"
                  placeholder="e.g. SARAH01"
                />
              </div>

              {/* Client's programme page URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Client's programme page URL <span className="text-orange-500">*</span>
                </label>
                <input
                  type="url"
                  name="clientProgramUrl"
                  required
                  value={referData.clientProgramUrl}
                  onChange={handleReferChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    referErrors.clientProgramUrl && referTouched.clientProgramUrl
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                  placeholder="https://clientdomain.com/program or notion.so/..."
                />
                {referErrors.clientProgramUrl && referTouched.clientProgramUrl && (
                  <p className="text-red-400 text-xs pl-1">{referErrors.clientProgramUrl}</p>
                )}
              </div>

              {/* Client's next cohort date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Client's next cohort date <span className="text-slate-500 text-[11px] font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  name="cohortDate"
                  value={referData.cohortDate}
                  onChange={handleReferChange}
                  className="w-full bg-slate-900/90 border border-white/[0.12] focus:border-orange-500 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              {/* Anything we should know? */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Anything we should know? <span className="text-slate-500 text-[11px] font-normal">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={referData.notes}
                  onChange={handleReferChange}
                  className="w-full bg-slate-900/90 border border-white/[0.12] focus:border-orange-500 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none"
                  placeholder="Context on the cohort size, structure, or current community setup..."
                />
              </div>

              {/* Radio: Recipient */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-200 block">
                  Preview delivery recipient
                </label>
                <div className="space-y-2 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="previewRecipient"
                      value="to_me"
                      checked={referData.previewRecipient === 'to_me'}
                      onChange={handleReferChange}
                      className="accent-orange-500"
                    />
                    <span>Send the preview to me to hand over</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="previewRecipient"
                      value="to_client"
                      checked={referData.previewRecipient === 'to_client'}
                      onChange={handleReferChange}
                      className="accent-orange-500"
                    />
                    <span>Send it to my client, with me cc'd</span>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isReferSubmitting}
                  className="w-full py-3.5 px-6 font-semibold text-sm tracking-tight rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isReferSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting referral...</span>
                    </>
                  ) : (
                    <span>Send it</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 9 — BECOME A PARTNER */}
      <section className="py-16 sm:py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Onboarding</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Not ready to refer yet? Get your partner code.
          </h2>
        </div>

        <div className="bg-slate-900/70 border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-xl">
          {isSignupSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Thanks. Your code and partner kit arrive within 24 hours.
              </h3>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} noValidate className="space-y-4">
              <input type="hidden" name="form-name" value="partner-signup" />

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    signupErrors.name && signupTouched.name
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                  placeholder="Your full name"
                />
                {signupErrors.name && signupTouched.name && (
                  <p className="text-red-400 text-xs pl-1">{signupErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    signupErrors.email && signupTouched.email
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                  placeholder="you@yourdomain.com"
                />
                {signupErrors.email && signupTouched.email && (
                  <p className="text-red-400 text-xs pl-1">{signupErrors.email}</p>
                )}
              </div>

              {/* What you do */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  What you do <span className="text-orange-500">*</span>
                </label>
                <select
                  name="whatYouDo"
                  required
                  value={signupData.whatYouDo}
                  onChange={handleSignupChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    signupErrors.whatYouDo && signupTouched.whatYouDo
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                >
                  <option value="">Select your role...</option>
                  <option value="OBM / Integrator">OBM / Integrator</option>
                  <option value="Community / Circle / Skool builder">Community / Circle / Skool builder</option>
                  <option value="Course platform expert (Kajabi, Thinkific, etc.)">Course platform expert (Kajabi, Thinkific, etc.)</option>
                  <option value="Launch strategist">Launch strategist</option>
                  <option value="Programme / curriculum designer">Programme / curriculum designer</option>
                  <option value="Coach of coaches">Coach of coaches</option>
                  <option value="Other">Other</option>
                </select>
                {signupErrors.whatYouDo && signupTouched.whatYouDo && (
                  <p className="text-red-400 text-xs pl-1">{signupErrors.whatYouDo}</p>
                )}
              </div>

              {/* Roughly how many of your clients run group programmes? */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Roughly how many of your clients run group programmes? <span className="text-orange-500">*</span>
                </label>
                <select
                  name="groupClientsCount"
                  required
                  value={signupData.groupClientsCount}
                  onChange={handleSignupChange}
                  className={`w-full bg-slate-900/90 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none ${
                    signupErrors.groupClientsCount && signupTouched.groupClientsCount
                      ? 'border-red-500/70 ring-1 ring-red-500/20'
                      : 'border-white/[0.12] focus:border-orange-500'
                  }`}
                >
                  <option value="">Select client count...</option>
                  <option value="0–2">0–2</option>
                  <option value="3–5">3–5</option>
                  <option value="6–10">6–10</option>
                  <option value="10+">10+</option>
                </select>
                {signupErrors.groupClientsCount && signupTouched.groupClientsCount && (
                  <p className="text-red-400 text-xs pl-1">{signupErrors.groupClientsCount}</p>
                )}
              </div>

              {/* Website or LinkedIn */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Website or LinkedIn <span className="text-slate-500 text-[11px] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="websiteOrLinkedIn"
                  value={signupData.websiteOrLinkedIn}
                  onChange={handleSignupChange}
                  className="w-full bg-slate-900/90 border border-white/[0.12] focus:border-orange-500 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  placeholder="https://linkedin.com/in/... or your website"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSignupSubmitting}
                  className="w-full py-3.5 px-6 font-semibold text-sm tracking-tight rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSignupSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating code...</span>
                    </>
                  ) : (
                    <span>Get my partner code</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 10 — FAQ (ACCORDION) */}
      <section className="py-16 sm:py-28 px-6 max-w-4xl mx-auto scroll-mt-20" id="faq">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-3">
            Frequently Asked Questions
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight">
            Everything you need to know about the partner programme.
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <details
              key={faq.q}
              open={openFaqIndex === idx}
              onToggle={(e) => {
                const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                if (isOpen) {
                  setOpenFaqIndex(idx);
                  trackAction('faq_expanded', { category: 'engagement', label: faq.q });
                } else if (openFaqIndex === idx) {
                  setOpenFaqIndex(null);
                }
              }}
              className="group bg-slate-900/40 border border-white/[0.08] rounded-2xl hover:border-white/[0.18] backdrop-blur-md transition-all duration-300 [&_summary::-webkit-details-marker]:hidden relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              <summary className="cursor-pointer p-5 md:p-6 flex items-center justify-between text-base font-bold tracking-tight text-slate-200 group-hover:text-white transition-colors list-none select-none">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-orange-400/80">0{idx + 1}</span>
                  <span>{faq.q}</span>
                </span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300 group-hover:text-orange-400">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <div className="px-5 md:px-6 pb-6 text-slate-300/90 leading-relaxed text-sm pt-2 border-t border-white/[0.06]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
