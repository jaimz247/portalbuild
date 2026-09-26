import React, { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Loader2, 
  X, 
  Check, 
  Sparkles, 
  Mail, 
  Globe, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  CheckCircle2,
  Lock,
  Zap,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react';
import { OPEN_MODAL_EVENT, CLOSE_MODALS_EVENT } from '../lib/events';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackFormSubmission } from '../lib/analytics';
import { trackAction } from '../lib/tracker';

const CAL_URL = 'https://cal.com/morningcrest/portal-fit-call';

const getUrlParams = () => {
  if (typeof window === 'undefined') return { preview: false, ref: '', a: '' };
  const searchParams = new URLSearchParams(window.location.search);
  return {
    preview: searchParams.get('preview') === '1',
    ref: searchParams.get('ref') || '',
    a: searchParams.get('a') || '',
  };
};

const getContextualSubheading = (aValue: string) => {
  const norm = (aValue || '').trim().toLowerCase();
  if (norm === 'leadership') {
    return 'You just explored Harbourline Institute. Yours carries your executive curriculum, modules, and schedule — built in 24 hours.';
  }
  if (norm === 'ai') {
    return 'You just explored an AI operations portal. Yours carries your technical modules, build tracks, and schedule — built in 24 hours.';
  }
  if (norm === 'agency') {
    return 'You just explored Northline Collective. Yours carries your agency sprint, MRR milestones, and operator radar — built in 24 hours.';
  }
  return 'Drop your link below. We review your public curriculum and build your interactive, branded staging portal in 24 hours.';
};

const COHORT_OPTIONS = [
  'Within 3 weeks',
  'In 3–6 weeks',
  'In 6–12 weeks',
  'In 3+ months',
  'No date set yet',
];

const SAMPLE_PORTALS = [
  {
    name: 'The Growth Collective',
    type: 'Founder Accelerator',
    url: 'https://growthcollective.cohortroom.com',
  },
  {
    name: 'Harbourline Institute',
    type: 'Executive Leadership',
    url: 'https://leadership.cohortroom.com',
  },
  {
    name: 'Northline Collective',
    type: 'Agency Mastermind',
    url: 'https://agency.cohortroom.com',
  },
];

// Validation patterns
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

export default function ApplicationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    programUrl: '',
    cohortStartDate: '',
    ref: '',
    a: '',
    website_hp: '', // Honeypot
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  // Anti-bot timing check: track when form opens
  const formOpenedAt = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Real-time evaluation as the user types
  const urlVal = formData.programUrl.trim();
  const emailVal = formData.email.trim();

  const isUrlValid = checkUrlFormat(urlVal);
  const isUrlTyping = urlVal.length > 0;
  const showUrlInvalid = isUrlTyping && !isUrlValid && (urlVal.length >= 4 || touched.programUrl);

  const isEmailValid = checkEmailFormat(emailVal);
  const isEmailTyping = emailVal.length > 0;
  const showEmailInvalid = isEmailTyping && !isEmailValid && (emailVal.includes('@') || emailVal.length >= 6 || touched.email);

  const isFormComplete = isUrlValid && isEmailValid && formData.cohortStartDate.trim().length > 0;

  // Celebratory confetti burst triggered on submission success
  const triggerCelebrationConfetti = () => {
    try {
      // Primary burst from center
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.45 },
        colors: ['#f97316', '#fb923c', '#10b981', '#34d399', '#f59e0b', '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 99999,
      });

      // Flanking cannons after short delay for layered gratification
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.15, y: 0.55 },
          colors: ['#f97316', '#10b981', '#ffffff'],
          zIndex: 99999,
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.85, y: 0.55 },
          colors: ['#f97316', '#10b981', '#ffffff'],
          zIndex: 99999,
        });
      }, 180);
    } catch (e) {
      console.debug('Confetti animation suppressed or unsupported', e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      triggerCelebrationConfetti();
    }
  }, [isSuccess]);

  const openForm = () => {
    const { ref, a } = getUrlParams();
    const storedRef = typeof window !== 'undefined' ? (sessionStorage.getItem('pb_ref') || '') : '';
    const activeRef = (ref || storedRef || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
    setIsOpen(true);
    setIsSuccess(false);
    formOpenedAt.current = Date.now();
    setFormData(prev => ({
      email: '',
      programUrl: '',
      cohortStartDate: '',
      ref: activeRef || prev.ref || '',
      a: a || prev.a || '',
      website_hp: '',
    }));
    setTouched({});
    setErrors({});
    document.body.style.overflow = 'hidden';
  };

  const focusedFieldsRef = useRef(new Set<string>());

  const closeForm = () => {
    if (!isSuccess && (formData.programUrl || formData.email)) {
      trackAction('form_abandoned', {
        category: 'retention',
        label: 'Preview modal closed without completing submission',
        metadata: { hasUrl: !!formData.programUrl, hasEmail: !!formData.email },
      });
    }
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const { preview, ref, a } = getUrlParams();
    const storedRef = typeof window !== 'undefined' ? (sessionStorage.getItem('pb_ref') || '') : '';
    const activeRef = (ref || storedRef || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
    if (activeRef || a) {
      setFormData(prev => ({ ...prev, ref: activeRef || prev.ref, a: a || prev.a }));
    }

    if (preview) {
      openForm();
    }

    const handleOpenEvent = () => openForm();
    const handleCloseEvent = () => closeForm();

    window.addEventListener(OPEN_MODAL_EVENT, handleOpenEvent);
    window.addEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);

    (window as any).__openPortalApplicationModal = openForm;

    const handleHash = () => {
      if (window.location.hash === '#apply' || window.location.hash === '#preview') {
        openForm();
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHash);

    if (window.location.hash === '#apply' || window.location.hash === '#preview') {
      openForm();
    }

    return () => {
      window.removeEventListener(OPEN_MODAL_EVENT, handleOpenEvent);
      window.removeEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);
      window.removeEventListener('hashchange', handleHash);
      if ((window as any).__openPortalApplicationModal === openForm) {
        delete (window as any).__openPortalApplicationModal;
      }
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Focus trapping & Esc keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstInput = modalRef.current.querySelector<HTMLInputElement>('input:not([type="hidden"])');
        firstInput?.focus();
      }
    }, 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeForm();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleInputFocus = (fieldName: string) => {
    if (!focusedFieldsRef.current.has(fieldName)) {
      focusedFieldsRef.current.add(fieldName);
      trackAction('form_field_focused', {
        category: 'intent',
        label: `Form Field Focused: ${fieldName}`,
        metadata: { field: fieldName },
      });
    }
  };

  const handleInputBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleSelectCohort = (option: string) => {
    setFormData(prev => ({ ...prev, cohortStartDate: option }));
    setTouched(prev => ({ ...prev, cohortStartDate: true }));
    trackAction('cohort_date_selected', {
      category: 'intent',
      label: `Cohort Date Selected: ${option}`,
      metadata: { cohortDate: option },
    });
    if (errors.cohortStartDate) {
      const newErrors = { ...errors };
      delete newErrors.cohortStartDate;
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    setTouched({ email: true, programUrl: true, cohortStartDate: true });

    if (!emailVal) {
      newErrors.email = 'Please enter your work email where we should deliver the preview.';
    } else if (!isEmailValid) {
      newErrors.email = 'Please enter a valid work email address (e.g. name@company.com).';
    }

    if (!urlVal) {
      newErrors.programUrl = 'Please provide a link to your sales page, Notion curriculum, or outline.';
    } else if (!isUrlValid) {
      newErrors.programUrl = 'Please enter a valid link with a domain (e.g. yourprogram.com or notion.so/...).';
    }

    if (!formData.cohortStartDate.trim()) {
      newErrors.cohortStartDate = 'Please select your target cohort start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot check
    if (formData.website_hp) {
      setIsSuccess(true);
      return;
    }

    // Anti-bot timing check
    const elapsedSeconds = (Date.now() - formOpenedAt.current) / 1000;
    if (elapsedSeconds < 1.5) {
      setIsSuccess(true);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    const path = 'preview_requests';

    const payload: Record<string, any> = {
      email: emailVal,
      programUrl: urlVal,
      cohortStartDate: formData.cohortStartDate,
      status: 'pending_preview',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (formData.ref) {
      const sanitized = formData.ref.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
      payload.ref = sanitized;
      payload.referredBy = sanitized;
    }
    if (formData.a) payload.a = formData.a.trim();

    try {
      const newDocRef = doc(collection(db, path));
      await setDoc(newDocRef, { ...payload, id: newDocRef.id });
      setSubmissionId(newDocRef.id);

      const existingLocal = localStorage.getItem('local_preview_requests');
      let localList = existingLocal ? JSON.parse(existingLocal) : [];
      localList.unshift({ ...payload, id: newDocRef.id });
      localStorage.setItem('local_preview_requests', JSON.stringify(localList));

      fetch('/api/notify-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: newDocRef.id }),
      }).catch((err) => console.warn('Notification delivery background notice:', err));

      window.dispatchEvent(
        new CustomEvent('new-application-submitted', {
          detail: {
            id: newDocRef.id,
            name: payload.email,
            email: payload.email,
            revenue: payload.cohortStartDate,
            businessType: 'cohort-program',
          },
        })
      );

      setIsSubmitting(false);
      setIsSuccess(true);
      setShowToast(true);
      trackFormSubmission({ email: payload.email, programUrl: payload.programUrl });
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Firestore save error, falling back to local state:', error);

      const fallbackId = 'preview-' + Math.random().toString(36).substring(2, 9);
      setSubmissionId(fallbackId);
      const existingLocal = localStorage.getItem('local_preview_requests');
      let localList = existingLocal ? JSON.parse(existingLocal) : [];
      localList.unshift({ ...payload, id: fallbackId });
      localStorage.setItem('local_preview_requests', JSON.stringify(localList));

      fetch('/api/notify-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: fallbackId }),
      }).catch((err) => console.warn('Notification delivery background notice:', err));

      setIsSubmitting(false);
      setIsSuccess(true);
      setShowToast(true);
      trackFormSubmission({ email: payload.email, programUrl: payload.programUrl });
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const subheading = getContextualSubheading(formData.a);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          ref={modalRef} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-preview-title"
          className="contents"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto"
            id="internal-modal-container"
            tabIndex={-1}
          >
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={closeForm}
              aria-label="Close modal backdrop"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 14 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.04 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-slate-950 border border-white/[0.1] shadow-2xl relative my-auto z-10 rounded-2xl overflow-hidden text-slate-100"
            >
              {/* Radial focal glow accent */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all cursor-pointer p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] z-30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* POST-SUBMISSION STATE: CELEBRATORY MICRO-ANIMATION & HIGH GRATIFICATION */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="p-6 sm:p-10 relative"
                    role="alert"
                    aria-live="assertive"
                  >
                    {/* Header Celebratory Spring Checkmark Badge */}
                    <div className="text-center max-w-xl mx-auto mb-8">
                      <motion.div
                        initial={{ scale: 0, rotate: -25 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/25 relative"
                      >
                        {/* Animated celebratory pulsating aura */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.45, opacity: 0 }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none"
                        />
                        <Check className="w-8 h-8 stroke-[3]" />
                      </motion.div>

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>PREVIEW BUILD QUEUED · 24-HOUR TARGET</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Your custom portal is now in production.
                      </h2>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                        We are mapping your brand styling, curriculum syllabus, and cohort schedule into an interactive, live staging portal.
                      </p>
                    </div>

                    {/* 3-Stage Interactive Build Pipeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-3.5 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">1. Request Logged</p>
                          <p className="text-[11px] text-slate-400">Encrypted & assigned</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/80 border border-orange-500/40 flex items-center gap-3.5 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                          <Zap className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">2. Content Extraction</p>
                          <p className="text-[11px] text-orange-300">Curriculum & color mapping</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.08] flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-white/10">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">3. Staging Deployment</p>
                          <p className="text-[11px] text-slate-400">Arrives in &lt; 24 hours</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Receipt Card */}
                    <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-white/[0.08] mb-8">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
                        <span className="text-xs font-mono uppercase text-slate-400">Delivery Receipt</span>
                        <span className="text-[11px] font-mono text-emerald-400">ID: {submissionId || 'CONFIRMED'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Delivering to Email:</span>
                          <span className="font-semibold text-white truncate block">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Program Link Analyzed:</span>
                          <span className="font-semibold text-slate-200 truncate block">{formData.programUrl}</span>
                        </div>
                      </div>
                    </div>

                    {/* What to do while you wait: Test drive 3 live portals */}
                    <div className="max-w-2xl mx-auto mb-8 text-center sm:text-left">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono uppercase text-slate-400">While you wait for your build:</span>
                        <span className="text-[11px] text-orange-400 font-medium">Explore live portals ➔</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {SAMPLE_PORTALS.map((portal, idx) => (
                          <a
                            key={idx}
                            href={portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-orange-500/30 transition-all flex items-center justify-between group cursor-pointer text-left"
                          >
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                                {portal.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">{portal.type}</p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors shrink-0 ml-2" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Urgent Fast-Track Onboarding Call CTA */}
                    <div className="max-w-2xl mx-auto p-5 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-900/80 to-slate-900/40 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                          <span>Launching a cohort within 2–3 weeks?</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono">PRIORITY</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Lock in your launch date on an onboarding architecture call with our lead engineer.
                        </p>
                      </div>
                      <a
                        href={CAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-xs font-semibold tracking-tight transition-colors flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                      >
                        <span>Book 20-min call</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Footer Close */}
                    <div className="text-center mt-6">
                      <button
                        onClick={closeForm}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Done · Close window and return to site
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* SPLIT 2-COLUMN MODAL CONTENT WITH REAL-TIME INLINE VALIDATION */
                  <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
                    {/* LEFT COLUMN: Value Proposition, Miniature Staging Teaser & Proof */}
                    <div className="md:col-span-5 bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[11px] font-mono uppercase tracking-wider mb-3.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Free 24h Staging Preview</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                          See your cohort inside a custom-built, executive portal.
                        </h2>

                        <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                          We take your sales page or syllabus and assemble a fully interactive, clickable preview under your brand — delivered in 24 hours.
                        </p>

                        {/* Staging Preview UI Mockup Teaser */}
                        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/90 border border-white/[0.08] space-y-2.5 shadow-inner text-left">
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <Lock className="w-3 h-3 text-emerald-400" />
                              portal.yourcohort.com
                            </span>
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Staging Link
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                              <span>Your brand palette & typography</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                              <span>Weekly module roadmap & deliverables</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                              <span>Operator Radar with member risk flags</span>
                            </div>
                          </div>
                        </div>

                        {/* 4 Frictionless Guarantees */}
                        <div className="mt-5 space-y-2 text-[11px] text-slate-300">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>100% Free · No credit card required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Delivered to your inbox within 24 hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Review at your own pace · No sales calls</span>
                          </div>
                        </div>
                      </div>

                      {/* Micro Testimonial Quote */}
                      <div className="mt-6 pt-5 border-t border-white/[0.08]">
                        <p className="text-xs italic text-slate-400 leading-relaxed">
                          "Seeing our actual Notion curriculum laid out in an executive portal in 24 hours was night and day compared to Skool."
                        </p>
                        <p className="text-[11px] font-mono text-slate-300 mt-1.5 font-semibold">
                          — David Chen, Agency Accelerator Lead
                        </p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: The High-Converting Input Flow with Real-time Inline Validation */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        {/* Header */}
                        <div className="mb-5">
                          <h3 id="modal-preview-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Where should we send your preview?
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {subheading}
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                          {/* Hidden tracking fields & bot honeypot */}
                          <input type="hidden" name="form-name" value="preview-requests" />
                          <input type="hidden" name="a" value={formData.a} />
                          <div className="hidden" aria-hidden="true">
                            <input
                              type="text"
                              name="website_hp"
                              tabIndex={-1}
                              autoComplete="off"
                              value={formData.website_hp}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* Field 1: Program or Sales Page URL with Real-time Feedback */}
                          <div className="space-y-1.5">
                            <label htmlFor="field-program-url" className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                                Program Sales Page, Notion or Syllabus <span className="text-orange-500">*</span>
                              </span>
                              {isUrlValid ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono transition-opacity duration-200">
                                  <Check className="w-3 h-3" /> Valid Link
                                </span>
                              ) : showUrlInvalid ? (
                                <span className="text-[11px] text-amber-400 flex items-center gap-1 font-mono transition-opacity duration-200">
                                  <AlertCircle className="w-3 h-3" /> Needs Domain
                                </span>
                              ) : null}
                            </label>
                            <div className="relative">
                              <input
                                id="field-program-url"
                                type="text"
                                name="programUrl"
                                required
                                aria-required="true"
                                aria-invalid={showUrlInvalid || !!errors.programUrl}
                                aria-describedby={errors.programUrl ? 'field-program-url-error' : 'field-program-url-hint'}
                                value={formData.programUrl}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus('programUrl')}
                                onBlur={() => handleInputBlur('programUrl')}
                                className={`w-full bg-slate-900/90 border transition-all duration-200 px-4 py-2.5 pr-24 text-white focus:outline-none rounded-xl text-sm ${
                                  isUrlValid
                                    ? 'border-emerald-500/70 focus:border-emerald-400 ring-1 ring-emerald-500/25 bg-emerald-950/15'
                                    : showUrlInvalid || errors.programUrl
                                    ? 'border-amber-500/70 focus:border-amber-400 ring-1 ring-amber-500/25 bg-amber-950/15'
                                    : 'border-white/[0.12] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                                }`}
                                placeholder="https://yourprogram.com, notion.so/..., or skool.com/..."
                              />
                              {/* Inline status indicator badge inside input */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {isUrlValid ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                                    <Check className="w-3 h-3" /> Ready
                                  </span>
                                ) : showUrlInvalid ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                                    Incomplete
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {/* Real-time inline feedback text */}
                            {isUrlValid ? (
                              <p id="field-program-url-hint" className="text-[11px] text-emerald-400 flex items-center gap-1.5 pl-1 font-medium animate-fadeIn">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Ready — we'll extract your curriculum structure & brand colors from this link.
                              </p>
                            ) : showUrlInvalid ? (
                              <p id="field-program-url-hint" className="text-[11px] text-amber-400 flex items-center gap-1.5 pl-1 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Please include a valid domain (e.g. yourprogram.com, notion.so/curriculum, or skool.com/group).
                              </p>
                            ) : errors.programUrl ? (
                              <p id="field-program-url-error" role="alert" className="text-red-400 text-xs font-medium pl-1">
                                {errors.programUrl}
                              </p>
                            ) : (
                              <p id="field-program-url-hint" className="text-[11px] text-slate-500 pl-1">
                                Sales page, Notion doc, Google Doc curriculum outline, or community link.
                              </p>
                            )}
                          </div>

                          {/* Field 2: Work Email with Real-time Feedback */}
                          <div className="space-y-1.5">
                            <label htmlFor="field-email" className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                                Work Email <span className="text-orange-500">*</span>
                              </span>
                              {isEmailValid ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono transition-opacity duration-200">
                                  <Check className="w-3 h-3" /> Verified Format
                                </span>
                              ) : showEmailInvalid ? (
                                <span className="text-[11px] text-amber-400 flex items-center gap-1 font-mono transition-opacity duration-200">
                                  <AlertCircle className="w-3 h-3" /> Incomplete Email
                                </span>
                              ) : null}
                            </label>
                            <div className="relative">
                              <input
                                id="field-email"
                                type="email"
                                name="email"
                                required
                                aria-required="true"
                                aria-invalid={showEmailInvalid || !!errors.email}
                                aria-describedby={errors.email ? 'field-email-error' : 'field-email-hint'}
                                value={formData.email}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus('email')}
                                onBlur={() => handleInputBlur('email')}
                                className={`w-full bg-slate-900/90 border transition-all duration-200 px-4 py-2.5 pr-24 text-white focus:outline-none rounded-xl text-sm ${
                                  isEmailValid
                                    ? 'border-emerald-500/70 focus:border-emerald-400 ring-1 ring-emerald-500/25 bg-emerald-950/15'
                                    : showEmailInvalid || errors.email
                                    ? 'border-amber-500/70 focus:border-amber-400 ring-1 ring-amber-500/25 bg-amber-950/15'
                                    : 'border-white/[0.12] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                                }`}
                                placeholder="founder@yourprogram.com"
                              />
                              {/* Inline status indicator badge inside input */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {isEmailValid ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                                    <Check className="w-3 h-3" /> Valid
                                  </span>
                                ) : showEmailInvalid ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                                    Checking
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {/* Real-time inline feedback text */}
                            {isEmailValid ? (
                              <p id="field-email-hint" className="text-[11px] text-emerald-400 flex items-center gap-1.5 pl-1 font-medium animate-fadeIn">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Verified — your private interactive staging access link will be delivered here.
                              </p>
                            ) : showEmailInvalid ? (
                              <p id="field-email-hint" className="text-[11px] text-amber-400 flex items-center gap-1.5 pl-1 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Please enter a full email address with domain (e.g. name@company.com).
                              </p>
                            ) : errors.email ? (
                              <p id="field-email-error" role="alert" className="text-red-400 text-xs font-medium pl-1">
                                {errors.email}
                              </p>
                            ) : (
                              <p id="field-email-hint" className="text-[11px] text-slate-500 pl-1">
                                We'll send your private interactive staging access link here.
                              </p>
                            )}
                          </div>

                          {/* Field 3: Cohort Start Timeframe (Interactive Pills) */}
                          <div className="space-y-2">
                            <label htmlFor="field-cohort-select" className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                                When does your next cohort start? <span className="text-orange-500">*</span>
                              </span>
                              {formData.cohortStartDate ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-normal">Pick target</span>
                              )}
                            </label>

                            {/* Interactive Pill Selector */}
                            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Cohort start timeframe options">
                              {COHORT_OPTIONS.map((opt) => {
                                const isSelected = formData.cohortStartDate === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => handleSelectCohort(opt)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                                      isSelected
                                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/70 shadow-sm shadow-orange-500/10 ring-1 ring-orange-500/30'
                                        : 'bg-slate-900/80 hover:bg-white/[0.06] text-slate-300 border-white/[0.08] hover:border-white/[0.18]'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 text-orange-400" />}
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Hidden sync select for accessibility & screen readers */}
                            <select
                              id="field-cohort-select"
                              name="cohortStartDate"
                              aria-label="When does your next cohort start?"
                              aria-required="true"
                              aria-invalid={!!errors.cohortStartDate}
                              aria-describedby={errors.cohortStartDate ? 'field-cohort-error' : undefined}
                              value={formData.cohortStartDate}
                              onChange={handleInputChange}
                              className="sr-only"
                              tabIndex={-1}
                            >
                              <option value="">Select timeframe...</option>
                              {COHORT_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>

                            {errors.cohortStartDate && (
                              <p id="field-cohort-error" role="alert" className="text-red-400 text-xs font-medium pl-1">
                                {errors.cohortStartDate}
                              </p>
                            )}

                            {formData.cohortStartDate === 'Within 3 weeks' && (
                              <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs flex items-center gap-2 animate-fadeIn">
                                <Zap className="w-4 h-4 text-orange-400 shrink-0" />
                                <span>Fast-track turnaround activated — prioritized for 12–24h build delivery!</span>
                              </div>
                            )}
                          </div>

                          {/* Field 4: Referred by (optional) */}
                          <div className="space-y-1.5">
                            <label htmlFor="field-referred-by" className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                Referred by (optional)
                              </span>
                              {formData.ref ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono transition-opacity duration-200">
                                  <Check className="w-3 h-3" /> Code Applied
                                </span>
                              ) : null}
                            </label>
                            <div className="relative">
                              <input
                                id="field-referred-by"
                                type="text"
                                name="ref"
                                maxLength={20}
                                value={formData.ref}
                                onChange={(e) => {
                                  const sanitized = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
                                  setFormData(prev => ({ ...prev, ref: sanitized }));
                                }}
                                onFocus={() => handleInputFocus('ref')}
                                onBlur={() => handleInputBlur('ref')}
                                className="w-full bg-slate-900/90 border border-white/[0.12] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 px-4 py-2.5 text-white focus:outline-none rounded-xl text-sm placeholder:text-slate-500 font-mono uppercase"
                                placeholder="Partner code, e.g. SARAH01"
                              />
                            </div>
                          </div>

                          {/* Primary Submit Button with Readiness State */}
                          <div className="pt-2 space-y-3">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className={`w-full py-3.5 px-6 font-semibold text-sm tracking-tight rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                                isFormComplete && !isSubmitting
                                  ? 'bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/25 scale-[1.005]'
                                  : 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 text-white shadow-orange-950/40'
                              }`}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Building your preview queue...</span>
                                </>
                              ) : (
                                <>
                                  <span>Build my free portal preview</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>

                            {/* Secondary Action: Book call directly */}
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                No sales calls required
                              </span>
                              <a
                                href={CAL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-300 hover:text-orange-400 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
                              >
                                <span>Prefer a 20-min call?</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* Footer Guarantee */}
                      <div className="mt-6 pt-4 border-t border-white/[0.08] text-center text-[11px] text-slate-400">
                        Zero obligation · You keep the preview regardless · Confidentiality protected
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      )}
      <Toast message="Preview request submitted successfully!" isVisible={showToast} />
    </AnimatePresence>
  );
}
