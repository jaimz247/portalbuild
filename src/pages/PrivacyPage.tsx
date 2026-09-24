import { ArrowLeft, ShieldCheck, Mail, Lock, FileText, Building2 } from 'lucide-react';

export default function PrivacyPage() {
  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTerms = () => {
    window.history.pushState({}, '', '/terms');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 max-w-4xl mx-auto font-sans">
      {/* Header Bar / Brand Lockup & Navigation */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackHome}
            aria-label="Back to PortalBuild Home"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer"
          >
            <span className="w-3 h-3 rounded-sm bg-orange-500" />
          </button>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-tight">
              PortalBuild
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-tight -mt-0.5">
              a MorningCrest Solutions Company
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
            <span>Return Home</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR &amp; Privacy Standards</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-6 md:p-10 shadow-2xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>MorningCrest Solutions LLC · Privacy Operations</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: August 3, 2026 · Governing Entity: MorningCrest Solutions LLC
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <FileText className="w-5 h-5 text-orange-400" />
              1. Overview &amp; Commitment
            </h2>
            <p>
              PortalBuild ("we", "us", or "our"), a technology business operated by <strong className="text-white">MorningCrest Solutions LLC</strong>, respects your privacy and is committed to safeguarding personal and business data. This Privacy Policy details our data collection, handling, storage, and communication standards when you visit <strong className="text-white">getportalbuild.com</strong> or request a custom cohort portal preview.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Lock className="w-5 h-5 text-orange-400" />
              2. Information We Collect
            </h2>
            <p>When you submit a request for a custom portal preview or interact with our site, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Contact Information:</strong> Your full name, work email address, and company/brand details.</li>
              <li><strong className="text-white">Program Details:</strong> Your public program sales page URL, course website link, and cohort timeline details.</li>
              <li><strong className="text-white">Technical Data:</strong> Anonymized interaction telemetry, device identifiers, time zones, and first-party event metrics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Mail className="w-5 h-5 text-orange-400" />
              3. Email Communications &amp; Deliverability Compliance
            </h2>
            <p>
              By submitting your email address to request a portal preview, you consent to receive direct transactional communications related to your preview request, including preview link delivery, cohort onboarding guidance, and follow-up support.
            </p>
            <p>
              We adhere strictly to international email deliverability standards (CAN-SPAM, GDPR, CASL):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>We never sell, rent, trade, or share your contact email address with third-party data brokers.</li>
              <li>Every automated broadcast or notification includes an explicit, 1-click unsubscribe mechanism.</li>
              <li>Preview requests are strictly B2B and evaluated for active cohort operators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              4. Cookies &amp; First-Party Tracking Technologies
            </h2>
            <p>
              We use essential session tokens and first-party behavioral metrics to analyze overall site flow, monitor preview request form completions, and optimize page performance. We do not sell tracking profiles to external advertisement networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              5. Data Protection &amp; Cloud Security
            </h2>
            <p>
              All submitted data is stored securely using enterprise Google Firestore cloud infrastructure with strict security rules, encrypted both in transit (TLS 1.3) and at rest (AES-256 encryption). Access is restricted solely to authorized engineering personnel building your preview.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              6. Your Rights &amp; Data Removal
            </h2>
            <p>
              You hold full rights to access, update, or request the complete deletion of your submitted data at any time. To request data deletion or opt-out of all communications, email our privacy desk at <a href="mailto:privacy@getportalbuild.com" className="text-orange-400 hover:underline">privacy@getportalbuild.com</a>.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/[0.08]">
            <h2 className="text-lg font-bold text-white">Contact &amp; Legal Inquiries</h2>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              PortalBuild / MorningCrest Solutions LLC<br />
              Email: legal@getportalbuild.com | privacy@getportalbuild.com<br />
              Corporate Parent: MorningCrest Solutions LLC · Domain: getportalbuild.com
            </p>
          </section>
        </div>

        {/* Footer Navigation Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>Related:</span>
            <button
              onClick={handleNavigateTerms}
              className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              Terms of Service →
            </button>
          </div>
          <button
            onClick={handleBackHome}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to PortalBuild Home
          </button>
        </div>
      </div>
    </div>
  );
}
