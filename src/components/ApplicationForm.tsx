import React, { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, Check, Sparkles, Mail, Globe, Calendar } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
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
    return 'You just walked through a live leadership program portal. Yours carries your brand, your modules, your dates — back in 24 hours.';
  }
  if (norm === 'ai') {
    return 'You just walked through a live AI operations cohort portal. Yours carries your brand, your modules, your dates — back in 24 hours.';
  }
  if (norm === 'agency') {
    return 'You just walked through a live agency mastermind portal. Yours carries your brand, your modules, your dates — back in 24 hours.';
  }
  return 'Provide your details and program URL. We build your custom preview in 24 hours.';
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

    const handleHash = () => {
      if (window.location.hash === '#apply') {
        openForm();
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHash);

    if (window.location.hash === '#apply') {
      openForm();
    }

    return () => {
      window.removeEventListener(OPEN_MODAL_EVENT, handleOpenEvent);
      window.removeEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);
      window.removeEventListener('hashchange', handleHash);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (!formData.programUrl.trim()) {
      newErrors.programUrl = 'Please enter your program sales page or website URL.';
    } else {
      const url = formData.programUrl.trim();
      if (!url.includes('.') && !url.startsWith('http')) {
        newErrors.programUrl = 'Please enter a valid website URL (e.g. yourprogram.com).';
      }
    }

    if (!formData.cohortStartDate.trim()) {
      newErrors.cohortStartDate = 'Please select your next cohort start timeframe.';
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
        <FocusTrap key="modal-trap" focusTrapOptions={{ clickOutsideDeactivates: true, onDeactivate: closeForm, fallbackFocus: "#internal-modal-container" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
            id="internal-modal-container"
            tabIndex={-1}
          >
            <div className="absolute inset-0" onClick={closeForm}></div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-white/10 shadow-2xl relative my-auto z-10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5 z-20"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-5 sm:p-7 relative">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-6 text-center"
                      role="alert"
                      aria-live="assertive"
                    >
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Check className="w-6 h-6" />
                      </div>

                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono border border-emerald-400/20 px-3 py-0.5 bg-emerald-400/5 mb-2.5 rounded-full">
                        Request Received
                      </span>

                      <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                        Your preview is being built.
                      </h3>

                      <p className="text-slate-300 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                        It lands in your inbox within 24 hours. Nothing else needed from you.
                      </p>

                      <div className="w-full max-w-sm mx-auto space-y-3">
                        <a
                          href={CAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-tight rounded-lg shadow-xl shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Skip the wait — book 20 minutes</span>
                        </a>

                        <p className="text-xs text-slate-400 text-center font-medium">
                          Or just wait for the email. Either works.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] font-mono uppercase tracking-wider mb-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span>24-Hour Custom Preview</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                          Get my free portal preview
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {subheading}
                        </p>
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
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-orange-400" />
                          <span>Work Email <span className="text-orange-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          aria-label="Work Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.email ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2 sm:py-2.5 text-white focus:outline-none transition-all placeholder:text-slate-600 rounded-lg text-sm`}
                          placeholder="sarah@yourprogram.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.email}</p>}
                      </div>

                      {/* Field 2: Program or Sales Page URL */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          <span>Program or Sales Page URL <span className="text-orange-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          name="programUrl"
                          aria-label="Program or Sales Page URL"
                          value={formData.programUrl}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.programUrl ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2 sm:py-2.5 text-white focus:outline-none transition-all placeholder:text-slate-600 rounded-lg text-sm`}
                          placeholder="https://yourprogram.com or skool.com/your-group"
                        />
                        {errors.programUrl && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.programUrl}</p>}
                      </div>

                      {/* Field 3: Cohort Start Timeframe */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>When does your next cohort start? <span className="text-orange-500">*</span></span>
                        </label>
                        <select
                          name="cohortStartDate"
                          aria-label="When does your next cohort start?"
                          value={formData.cohortStartDate}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.cohortStartDate ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2 sm:py-2.5 text-white focus:outline-none transition-all rounded-lg text-sm cursor-pointer`}
                        >
                          <option value="" disabled className="bg-slate-900 text-slate-400">Select timeframe...</option>
                          {COHORT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900 text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.cohortStartDate && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.cohortStartDate}</p>}
                        {formData.cohortStartDate === 'Within 3 weeks' && (
                          <p className="text-amber-400 text-xs font-medium mt-1 leading-normal">
                            Tight, but tell us — we'll be straight with you about whether we can make the guarantee.
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 sm:py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-tight rounded-lg shadow-xl shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Building request...</span>
                          </>
                        ) : (
                          <>
                            <span>Get my free portal preview</span>
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Secondary path */}
                      <div className="text-center pt-0.5">
                        <a
                          href={CAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-orange-400 transition-colors inline-block font-medium cursor-pointer"
                        >
                          Prefer to talk first? Book 20 minutes
                        </a>
                      </div>

                      {/* Required Microcopy */}
                      <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
                        Free. No credit card required. No call required. Built from your public page in 24 hours.
                      </p>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      )}
      <Toast message="Preview request submitted successfully!" isVisible={showToast} />
    </AnimatePresence>
  );
}
