import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
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
  Layers
} from 'lucide-react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackAction } from '../lib/tracker';

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
      a: 'Within 7 days of your client’s payment clearing: the build share once, then 10% of their monthly fee for 12 months.',
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-50">
      {/* Top Header Bar / Brand Lockup matching site */}
      <header className="border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackHome}
              aria-label="Back to PortalBuild Home"
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer"
            >
              <span className="w-3 h-3 rounded-sm bg-orange-500" />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                PortalBuild
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-tight -mt-0.5">
                a MorningCrest Solutions Company
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBackHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Return Home</span>
            </button>
            <button
              onClick={() => scrollToSection('refer')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold tracking-tight shadow-sm transition-all cursor-pointer"
            >
              Send a client
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-6">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span>PortalBuild Partner Programme</span>
        </div>

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
          Free branded preview in 24 hours · You're cc'd on everything · We never go around you
        </p>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 2 — HOW IT WORKS */}
      <section className="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
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
              They go live, you get paid
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Live 7 days before their cohort opens, or they don't pay. Your share lands within 7 days of their payment.
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

          {/* Card 3 (Most requested) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-orange-500/40 relative flex flex-col justify-between shadow-lg shadow-orange-500/5">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-mono tracking-tight font-semibold">
                Most requested
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
          {/* Left Column: Cockpit Image + GIF */}
          <div className="lg:col-span-7 space-y-4">
            {/* Device frame for Cockpit screenshot */}
            <div className="rounded-2xl border border-white/[0.12] bg-slate-950 p-2 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 rounded-t-xl border-b border-white/[0.06] mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">cockpit.portalbuild.io</span>
              </div>
              <img
                src="/images/cockpit-screenshot.png"
                alt="PortalBuild Founder & Operator Cockpit Dashboard"
                className="w-full h-auto rounded-lg object-cover"
                loading="lazy"
              />
            </div>

            {/* Smaller frame for WhatsApp GIF */}
            <div className="rounded-xl border border-white/[0.08] bg-slate-950/80 p-2 shadow-md max-w-md">
              <img
                src="/images/whatsapp-checkin.gif"
                alt="One click personal check-in written in WhatsApp"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <p className="text-[11px] font-mono text-slate-400 mt-2 px-1 text-center sm:text-left">
                One click: a personal check-in, written and opened in WhatsApp.
              </p>
            </div>
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
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center opacity-60 my-2 relative z-10">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* SECTION 5 — WHAT YOU EARN */}
      <section className="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Compensation Model</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            One intro. No delivery. Paid for a year.
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/[0.08] bg-slate-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-slate-900/80 text-xs font-mono uppercase text-slate-400">
                <th className="py-4 px-6 font-semibold">Client plan</th>
                <th className="py-4 px-6 font-semibold">Build share (20%)</th>
                <th className="py-4 px-6 font-semibold">Monthly share (10% × 12 months)</th>
                <th className="py-4 px-6 font-semibold text-orange-400">Year-one total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Essential</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$399</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$356</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">~$755</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Signature</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$699</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$596</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">~$1,295</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Scale</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$1,199</td>
                <td className="py-4 px-6 text-slate-300 font-mono">$956</td>
                <td className="py-4 px-6 font-bold text-orange-400 font-mono">~$2,155</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="block sm:hidden space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Essential</span>
              <span className="text-orange-400 font-bold font-mono">~$755 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Build share (20%):</span>
              <span className="font-mono">$399</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Monthly share (10% × 12m):</span>
              <span className="font-mono">$356</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Signature</span>
              <span className="text-orange-400 font-bold font-mono">~$1,295 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Build share (20%):</span>
              <span className="font-mono">$699</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Monthly share (10% × 12m):</span>
              <span className="font-mono">$596</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="font-bold text-white">Scale</span>
              <span className="text-orange-400 font-bold font-mono">~$2,155 total</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Build share (20%):</span>
              <span className="font-mono">$1,199</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Monthly share (10% × 12m):</span>
              <span className="font-mono">$956</span>
            </div>
          </div>
        </div>

        {/* Three small points under the table */}
        <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs font-mono text-slate-400 text-center">
          <span>Paid by Wise or PayPal within 7 days of your client's payment clearing.</span>
          <span className="hidden md:inline select-none text-slate-700">·</span>
          <span>After three closed referrals: 25% build share.</span>
          <span className="hidden md:inline select-none text-slate-700">·</span>
          <span>90-day attribution from your first intro or referral code.</span>
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
      <section className="py-16 sm:py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Questions &amp; Details</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-white/[0.08] bg-slate-900/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none hover:bg-white/[0.02]"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
