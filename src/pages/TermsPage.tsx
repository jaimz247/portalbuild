import { ArrowLeft, ShieldCheck, FileCheck, Scale, AlertCircle, Building2 } from 'lucide-react';

export default function TermsPage() {
  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePrivacy = () => {
    window.history.pushState({}, '', '/privacy');
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
            <span>Legal Compliance</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-6 md:p-10 shadow-2xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>MorningCrest Solutions LLC · Legal Operations</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: August 3, 2026 · Governing Entity: MorningCrest Solutions LLC
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <FileCheck className="w-5 h-5 text-orange-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the services provided at <strong className="text-white">getportalbuild.com</strong> ("PortalBuild"), operated by <strong className="text-white">MorningCrest Solutions LLC</strong> ("we", "us", or "our"), requesting a custom portal preview, or engaging our engineering team, you confirm that you have read, understood, and agreed to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Scale className="w-5 h-5 text-orange-400" />
              2. Scope of Services &amp; Free Preview Policy
            </h2>
            <p>
              PortalBuild, a division of MorningCrest Solutions LLC, specializes in building, deploying, and maintaining custom member retention portals and intelligence radar dashboards for high-ticket cohort programs and masterminds.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Free Preview Service:</strong> Our 24-hour custom preview offer is provided free of charge to active cohort operators. Generating a preview creates zero obligation to purchase or sign a contract.</li>
              <li><strong className="text-white">Preview Content:</strong> Previews are constructed using publicly available information from your program sales page or curriculum outline submitted in your request form.</li>
              <li><strong className="text-white">Full Cohort Deployments:</strong> Full custom portal builds are executed under fixed agreement pricing, delivering complete brand ownership and full domain deployment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              3. Intellectual Property Rights
            </h2>
            <p>
              You retain 100% intellectual property ownership of your brand assets, logo, course curriculum, and student content. Upon full build handoff and fee settlement, you own the deployed portal application architecture and database configuration outright with zero developer lock-in.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              4. User Conduct &amp; Acceptable Use
            </h2>
            <p>
              You agree not to misuse our request forms or portal interfaces by submitting malicious code, spamming preview endpoints, impersonating other business entities, or using the platform for unauthorized commercial distribution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              5. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, MorningCrest Solutions LLC, PortalBuild, and its operators shall not be held liable for indirect, incidental, or consequential damages resulting from website downtime, third-party internet service disruptions, or external platform API changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              6. Modifications &amp; Governing Law
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time to reflect software updates or regulatory changes. These Terms are governed by and construed in accordance with applicable international commercial regulations.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/[0.08]">
            <h2 className="text-lg font-bold text-white">Contact &amp; Corporate Inquiries</h2>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              PortalBuild / MorningCrest Solutions LLC Legal Operations<br />
              Email: legal@getportalbuild.com | support@getportalbuild.com<br />
              Corporate Parent: MorningCrest Solutions LLC · Domain: getportalbuild.com
            </p>
          </section>
        </div>

        {/* Footer Navigation Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>Related:</span>
            <button
              onClick={handleNavigatePrivacy}
              className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              Privacy Policy →
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
