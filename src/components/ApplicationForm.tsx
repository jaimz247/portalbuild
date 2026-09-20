import React, { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'motion/react';
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
  ExternalLink
} from 'lucide-react';
import { OPEN_MODAL_EVENT, CLOSE_MODALS_EVENT } from '../lib/events';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackFormSubmission } from '../lib/analytics';

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
    return 'You just explored a live leadership program portal. Yours carries your brand, modules, and schedule — delivered in 24 hours.';
  }
  if (norm === 'ai') {
    return 'You just explored a live AI operations cohort portal. Yours carries your brand, modules, and schedule — delivered in 24 hours.';
  }
  if (norm === 'agency') {
    return 'You just explored a live agency mastermind portal. Yours carries your brand, modules, and schedule — delivered in 24 hours.';
  }
  return 'Drop your details below. We review your public curriculum and build your interactive preview in 24 hours.';
};

const COHORT_OPTIONS = [
  'Within 3 weeks',
  'In 3–6 weeks',
  'In 6–12 weeks',
  'In 3+ months',
  'No date set yet',
];

export default function ApplicationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    programUrl: '',
    cohortStartDate: '',
    ref: '',
    a: '',
    // Honeypot field (hidden from real human users)
    website_hp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-bot timing check: track when form opens
  const formOpenedAt = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const openForm = () => {
    const { ref, a } = getUrlParams();
    setIsOpen(true);
    setIsSuccess(false);
    formOpenedAt.current = Date.now();
    setFormData(prev => ({
      email: '',
      programUrl: '',
      cohortStartDate: '',
      ref: ref || prev.ref || '',
      a: a || prev.a || '',
      website_hp: '',
    }));
    setErrors({});
    document.body.style.overflow = 'hidden';
  };

  const closeForm = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const { preview, ref, a } = getUrlParams();
    if (ref || a) {
      setFormData(prev => ({ ...prev, ref: ref || prev.ref, a: a || prev.a }));
    }

    // 1. Auto-open from URL if ?preview=1 is present
    if (preview) {
      openForm();
    }

    const handleOpenEvent = () => {
      openForm();
    };

    const handleCloseEvent = () => {
      closeForm();
    };

    window.addEventListener(OPEN_MODAL_EVENT, handleOpenEvent);
    window.addEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);

    // Register direct window function for zero-latency fallback opening
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

  // Accessible keyboard navigation & focus trapping when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Focus first interactive input after animation mount
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
  };

  const handleSelectCohort = (option: string) => {
    setFormData(prev => ({ ...prev, cohortStartDate: option }));
    if (errors.cohortStartDate) {
      const newErrors = { ...errors };
      delete newErrors.cohortStartDate;
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Work Email validation
    const emailTrimmed = formData.email.trim();
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailTrimmed) {
      newErrors.email = 'Please enter your work email address.';
    } else if (!emailPattern.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid work email address (e.g. name@company.com).';
    }

    // 2. Program URL validation
    const urlTrimmed = formData.programUrl.trim();
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
    if (!urlTrimmed) {
      newErrors.programUrl = 'Please enter your program sales page, Notion, or website URL.';
    } else if (!urlPattern.test(urlTrimmed)) {
      newErrors.programUrl = 'Please enter a valid URL with a proper domain (e.g. yourprogram.com or https://school.com/group).';
    }

    // 3. Cohort start timeframe validation
    if (!formData.cohortStartDate.trim()) {
      newErrors.cohortStartDate = 'Please select when your next cohort starts.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-bot honeypot check: if website_hp is filled, reject silently
    if (formData.website_hp) {
      console.warn('Bot submission blocked via honeypot field');
      setIsSuccess(true);
      return;
    }

    // 2. Anti-bot timing check: reject submissions faster than 1.5 seconds
    const elapsedSeconds = (Date.now() - formOpenedAt.current) / 1000;
    if (elapsedSeconds < 1.5) {
      console.warn('Bot submission blocked via rapid timing check');
      setIsSuccess(true);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    const path = 'preview_requests';

    const payload: Record<string, any> = {
      email: formData.email.trim(),
      programUrl: formData.programUrl.trim(),
      cohortStartDate: formData.cohortStartDate,
      status: 'pending_preview',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (formData.ref) payload.ref = formData.ref.trim();
    if (formData.a) payload.a = formData.a.trim();

    try {
      // Create document in Firestore
      const newDocRef = doc(collection(db, path));
      await setDoc(newDocRef, { ...payload, id: newDocRef.id });

      // Save locally as backup
      const existingLocal = localStorage.getItem('local_preview_requests');
      let localList = existingLocal ? JSON.parse(existingLocal) : [];
      localList.unshift({ ...payload, id: newDocRef.id });
      localStorage.setItem('local_preview_requests', JSON.stringify(localList));

      // Dispatch instant email notification to server
      fetch('/api/notify-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: newDocRef.id }),
      }).catch((err) => console.warn('Notification delivery background notice:', err));

      // Trigger real-time alert in open admin dashboard
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
      const existingLocal = localStorage.getItem('local_preview_requests');
      let localList = existingLocal ? JSON.parse(existingLocal) : [];
      localList.unshift({ ...payload, id: fallbackId });
      localStorage.setItem('local_preview_requests', JSON.stringify(localList));

      // Dispatch instant email notification even in fallback mode
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
            id="internal-modal-container"
            tabIndex={-1}
          >
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={closeForm}
              aria-label="Close modal backdrop"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-slate-900 border border-white/10 shadow-2xl relative my-auto z-10 rounded-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 z-20 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-8 relative">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-6 text-center"
                      role="alert"
                      aria-live="assertive"
                    >
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/20">
                        <Check className="w-7 h-7" />
                      </div>

                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest border border-emerald-400/25 px-3 py-1 bg-emerald-400/10 mb-3 rounded-md flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Preview Build In Queue
                      </span>

                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                        Your preview is being assembled.
                      </h3>

                      <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
                        We're mapping your brand, curriculum, and dates into an interactive staging build. It lands in your inbox within 24 hours.
                      </p>

                      <div className="w-full max-w-md mx-auto space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/10 mb-6 text-left">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">1</div>
                          <div>
                            <p className="text-xs font-semibold text-white">Delivered to your email</p>
                            <p className="text-[11px] text-slate-400">{formData.email || 'Your provided work email'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">2</div>
                          <div>
                            <p className="text-xs font-semibold text-white">Full interactive staging access</p>
                            <p className="text-[11px] text-slate-400">Includes live member portal + operator retention radar walkthrough</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full max-w-md mx-auto space-y-3">
                        <a
                          href={CAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold text-sm tracking-tight rounded-xl border border-orange-400/30 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span>Skip the wait — book 20 minutes</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={closeForm}
                          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
                        >
                          Or close and wait for your email
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                      {/* Modal Header */}
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
                          24-Hour Custom Preview
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          Get your free portal preview
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed">
                          {subheading}
                        </p>

                        {/* Quick 3-Pillar Confidence Strip */}
                        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/10 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>24h Delivery</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Bespoke Design</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>No Credit Card</span>
                          </div>
                        </div>
                      </div>

                      {/* Hidden tracking fields & bot honeypot */}
                      <input type="hidden" name="ref" value={formData.ref} />
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

                      {/* Field 1: Work Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="field-email" className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                            Work Email <span className="text-orange-500">*</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">Where we send the preview</span>
                        </label>
                        <div className="relative">
                          <input
                            id="field-email"
                            type="email"
                            name="email"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'field-email-error' : undefined}
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full bg-slate-950/90 border ${
                              errors.email 
                                ? 'border-red-500 focus:ring-red-500/20' 
                                : 'border-white/15 focus:border-orange-500 focus:ring-orange-500/20'
                            } px-4 py-2.5 text-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-500 rounded-xl text-sm`}
                            placeholder="sarah@yourprogram.com"
                          />
                        </div>
                        {errors.email && (
                          <p id="field-email-error" role="alert" className="text-red-400 text-xs font-medium pl-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Field 2: Program or Sales Page URL */}
                      <div className="space-y-1.5">
                        <label htmlFor="field-program-url" className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                            Program URL or Sales Page <span className="text-orange-500">*</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">Sales page, Notion, Skool, etc.</span>
                        </label>
                        <div className="relative">
                          <input
                            id="field-program-url"
                            type="text"
                            name="programUrl"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.programUrl}
                            aria-describedby={errors.programUrl ? 'field-program-url-error' : undefined}
                            value={formData.programUrl}
                            onChange={handleInputChange}
                            className={`w-full bg-slate-950/90 border ${
                              errors.programUrl 
                                ? 'border-red-500 focus:ring-red-500/20' 
                                : 'border-white/15 focus:border-orange-500 focus:ring-orange-500/20'
                            } px-4 py-2.5 text-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-500 rounded-xl text-sm`}
                            placeholder="https://yourprogram.com or skool.com/your-group"
                          />
                        </div>
                        {errors.programUrl && (
                          <p id="field-program-url-error" role="alert" className="text-red-400 text-xs font-medium pl-1">
                            {errors.programUrl}
                          </p>
                        )}
                      </div>

                      {/* Field 3: Cohort Start Timeframe (Interactive Chips + Accessible Select) */}
                      <div className="space-y-2">
                        <label htmlFor="field-cohort-select" className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                            When does your next cohort start? <span className="text-orange-500">*</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">Pick closest target</span>
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
                                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/70 shadow-sm shadow-orange-500/10'
                                    : 'bg-slate-950/80 hover:bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-orange-400" />}
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Hidden sync select for accessibility & assistive tech */}
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
                          <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                            <span>Tight timeline — our 7-day turnaround was built for this. We'll fast-track your preview!</span>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 text-white font-semibold text-sm tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Building your preview request...</span>
                          </>
                        ) : (
                          <>
                            <span>Build my free portal preview</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Secondary path */}
                      <div className="text-center pt-1">
                        <a
                          href={CAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-300 hover:text-orange-400 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <span>Prefer to talk first? Book 20 minutes</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Reassuring Microcopy */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Free · No credit card · No high-pressure call · Built from your public page in 24h</span>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
      <Toast message="Preview request submitted successfully!" isVisible={showToast} />
    </AnimatePresence>
  );
}
