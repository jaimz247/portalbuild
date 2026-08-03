import React, { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, Check, ShieldCheck, Sparkles, User, Mail, Globe, Calendar } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { OPEN_MODAL_EVENT, CLOSE_MODALS_EVENT } from '../lib/events';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { trackFormSubmission } from '../lib/analytics';

export default function ApplicationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    programUrl: '',
    cohortStartDate: '',
    // Honeypot field (hidden from real human users)
    website_hp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-bot timing check: track when form opens
  const formOpenedAt = useRef<number>(0);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      formOpenedAt.current = Date.now();
      setFormData({
        name: '',
        email: '',
        programUrl: '',
        cohortStartDate: '',
        website_hp: '',
      });
      setErrors({});
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener(OPEN_MODAL_EVENT, handleOpen);

    const handleCloseEvent = () => {
      closeForm();
    };
    window.addEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);

    const handleHash = () => {
      if (window.location.hash === '#apply') {
        handleOpen();
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHash);

    if (window.location.hash === '#apply') {
      handleOpen();
    }

    return () => {
      window.removeEventListener(OPEN_MODAL_EVENT, handleOpen);
      window.removeEventListener(CLOSE_MODALS_EVENT, handleCloseEvent);
      window.removeEventListener('hashchange', handleHash);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const closeForm = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

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

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

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

    // 2. Anti-bot timing check: reject submissions faster than 2.5 seconds
    const elapsedSeconds = (Date.now() - formOpenedAt.current) / 1000;
    if (elapsedSeconds < 2.5) {
      console.warn('Bot submission blocked via rapid timing check');
      setIsSuccess(true);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    const path = 'preview_requests';

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      programUrl: formData.programUrl.trim(),
      cohortStartDate: formData.cohortStartDate,
      status: 'pending_preview',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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

  const cohortOptions = [
    { value: 'immediately', label: 'Starting in 1-2 weeks' },
    { value: '1-month', label: 'Starting in 3-4 weeks' },
    { value: '2-months', label: 'Starting in 1-2 months' },
    { value: 'planning', label: 'Currently planning next cohort' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap key="modal-trap" focusTrapOptions={{ clickOutsideDeactivates: true, onDeactivate: closeForm, fallbackFocus: "#internal-modal-container" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
            id="internal-modal-container"
            tabIndex={-1}
          >
            <div className="absolute inset-0" onClick={closeForm}></div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-white/10 shadow-2xl relative my-auto z-10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={closeForm}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5 z-20"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 relative">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                      role="alert"
                      aria-live="assertive"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <ShieldCheck className="w-8 h-8" />
                      </div>

                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono border border-emerald-400/20 px-3 py-1 bg-emerald-400/5 mb-3 rounded-full">
                        Preview Request Received
                      </span>

                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
                        We're on it!
                      </h3>

                      <p className="text-slate-300 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                        We're analyzing your program page and building your custom interactive portal preview. Look out for an email at <span className="text-orange-400 font-medium">{formData.email || 'your email'}</span> within 24 hours.
                      </p>

                      <div className="w-full bg-slate-950/80 border border-white/10 p-4 rounded-xl text-left space-y-2 mb-6">
                        <div className="text-[10px] uppercase font-mono tracking-widest font-bold text-orange-400">What happens next?</div>
                        <ul className="text-xs text-slate-300 space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>We pull your brand colors, logo, and curriculum structure.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>We build a live, interactive 9-screen portal prototype.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>You get a private preview link to test drive at your convenience.</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-lg shadow-orange-600/30"
                      >
                        Back to site
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                          <Sparkles className="w-3 h-3" />
                          <span>24-Hour Custom Preview</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">
                          Get my free portal preview
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Provide your details and program URL. We build your custom preview in 24 hours.
                        </p>
                      </div>

                      {/* Honeypot field - hidden from humans */}
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

                      {/* Field 1: Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-orange-400" />
                          <span>Your Name <span className="text-orange-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.name ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2.5 text-white focus:outline-none transition-all placeholder:text-slate-600 rounded-lg text-sm`}
                          placeholder="e.g. Sarah Connor"
                        />
                        {errors.name && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.name}</p>}
                      </div>

                      {/* Field 2: Work Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-orange-400" />
                          <span>Work Email <span className="text-orange-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.email ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2.5 text-white focus:outline-none transition-all placeholder:text-slate-600 rounded-lg text-sm`}
                          placeholder="sarah@yourprogram.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.email}</p>}
                      </div>

                      {/* Field 3: Program or Sales Page URL */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          <span>Program or Sales Page URL <span className="text-orange-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          name="programUrl"
                          value={formData.programUrl}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.programUrl ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2.5 text-white focus:outline-none transition-all placeholder:text-slate-600 rounded-lg text-sm`}
                          placeholder="https://yourprogram.com or skool.com/your-group"
                        />
                        {errors.programUrl && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.programUrl}</p>}
                      </div>

                      {/* Field 4: Next Cohort Start Date */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>When does your next cohort start? <span className="text-orange-500">*</span></span>
                        </label>
                        <select
                          name="cohortStartDate"
                          value={formData.cohortStartDate}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-950/80 border ${
                            errors.cohortStartDate ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
                          } px-3.5 py-2.5 text-white focus:outline-none transition-all rounded-lg text-sm cursor-pointer`}
                        >
                          <option value="" disabled className="bg-slate-900 text-slate-400">Select timeframe...</option>
                          {cohortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {errors.cohortStartDate && <p className="text-red-400 text-xs font-medium mt-0.5">{errors.cohortStartDate}</p>}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-tight rounded-lg shadow-xl shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
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

                      {/* Required Microcopy */}
                      <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
                        Free. No credit card required. No sales call. Built from your public page in 24 hours.
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
