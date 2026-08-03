import { ArrowLeft, ShieldCheck, Mail, Lock, FileText } from 'lucide-react';

export default function PrivacyPage() {
  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-6 max-w-4xl mx-auto font-sans">
      {/* Header Bar / Navigation */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Back to PortalBuild Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GDPR &amp; CAN-SPAM Compliant</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-12 shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block mb-2">
            Legal &amp; Data Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: August 3, 2026 · Effective Immediately
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <FileText className="w-5 h-5 text-orange-400" />
              1. Overview &amp; Commitment
            </h2>
            <p>
              PortalBuild ("we", "us", or "our") respects your privacy and is committed to protecting the personal and business information you share with us. This Privacy Policy outlines our data collection, handling, storage, and communication practices when you visit our website at <strong className="text-white">getportalbuild.com</strong> or request a custom portal preview.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Lock className="w-5 h-5 text-orange-400" />
              2. Information We Collect
            </h2>
            <p>When you submit a request for a custom portal preview or interact with our site, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Contact Information:</strong> Your full name, work email address, and company/brand details.</li>
              <li><strong className="text-white">Program Details:</strong> Your public program sales page URL, course website link, and cohort timeline details.</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device identifiers, time zones, and anonymized interaction analytics via Google Analytics (GA4).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
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
              <li>Every automated broadcast or newsletter includes an explicit, 1-click unsubscribe link.</li>
              <li>Preview requests are strictly B2B and evaluated for active cohort operators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              4. Cookies &amp; Tracking Technologies
            </h2>
            <p>
              We use essential cookies and deferred Google Analytics 4 (GA4) tags to analyze overall traffic flow, monitor portal preview form conversions, and optimize user experience. No sensitive authentication or personal financial records are stored in browser cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              5. Data Protection &amp; Security
            </h2>
            <p>
              All submitted data is stored securely using enterprise Google Firestore cloud infrastructure with strict security rules, encrypted both in transit (TLS 1.3) and at rest (AES-256 encryption). Access is restricted solely to authorized engineering personnel building your preview.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              6. Your Rights &amp; Data Removal
            </h2>
            <p>
              You hold full rights to access, update, or request the complete deletion of your submitted data at any time. To request data deletion or opt-out of all future communications, email our privacy desk at <a href="mailto:privacy@getportalbuild.com" className="text-orange-400 hover:underline">privacy@getportalbuild.com</a>.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-lg font-bold text-white">Contact &amp; Legal Inquiries</h2>
            <p className="text-xs text-slate-400 font-mono">
              PortalBuild Legal &amp; Data Protection Office<br />
              Email: legal@getportalbuild.com | privacy@getportalbuild.com<br />
              Domain: getportalbuild.com
            </p>
          </section>
        </div>

        {/* Footer Return CTA */}
        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-slate-400">© 2026 PortalBuild. All rights reserved.</p>
          <button
            onClick={handleBackHome}
            className="text-xs text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider cursor-pointer"
          >
            ← Return to main site
          </button>
        </div>
      </div>
    </div>
  );
}
