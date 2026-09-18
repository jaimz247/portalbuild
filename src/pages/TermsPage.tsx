import { ArrowLeft, ShieldCheck, FileCheck, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
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
          <span>Terms of Service Compliance</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-12 shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block mb-2">
            Legal Terms &amp; Agreement
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: August 3, 2026 · Effective Immediately
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <FileCheck className="w-5 h-5 text-orange-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the services provided at <strong className="text-white">getportalbuild.com</strong> ("PortalBuild"), requesting a custom portal preview, or engaging our engineering team, you confirm that you have read, understood, and agreed to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Scale className="w-5 h-5 text-orange-400" />
              2. Scope of Services &amp; Free Preview Policy
            </h2>
            <p>
              PortalBuild specializes in building, deploying, and maintaining custom member retention portals for high-ticket cohort programs and masterminds.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Free Preview Service:</strong> Our 24-hour custom preview offer is provided free of charge to active cohort operators. Generating a preview creates zero obligation to purchase or sign a contract.</li>
              <li><strong className="text-white">Preview Content:</strong> Previews are constructed using publicly available information from your program sales page or curriculum outline submitted in your request form.</li>
              <li><strong className="text-white">Full Cohort Deployments:</strong> Full custom portal builds are executed under fixed agreement pricing, delivering complete brand ownership and full domain deployment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              3. Intellectual Property Rights
            </h2>
            <p>
              You retain 100% intellectual property ownership of your brand assets, logo, course curriculum, and student content. Upon full build handoff and fee settlement, you own the deployed portal application architecture and database configuration outright with zero developer lock-in.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              4. User Conduct &amp; Acceptable Use
            </h2>
            <p>
              You agree not to misuse our request forms or portal interfaces by submitting malicious code, spamming preview endpoints, impersonating other business entities, or using the platform for unauthorized commercial distribution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              5. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, PortalBuild and its operators shall not be held liable for indirect, incidental, or consequential damages resulting from website downtime, third-party internet service disruptions, or external platform API changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              6. Modifications &amp; Governing Law
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time to reflect software updates or regulatory changes. These Terms are governed by and construed in accordance with applicable international B2B commerce regulations.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-lg font-bold text-white">Contact &amp; Support</h2>
            <p className="text-xs text-slate-400 font-mono">
              PortalBuild Legal Operations<br />
              Email: legal@getportalbuild.com | support@getportalbuild.com<br />
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
