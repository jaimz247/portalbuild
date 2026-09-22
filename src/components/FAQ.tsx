import { ChevronDown } from 'lucide-react';
import { trackFAQExpansion } from '../lib/analytics';

export default function FAQ() {
  const faqs = [
    {
      q: "How does the free preview work?",
      a: "Paste your program sales page URL or curriculum outline. Within 24 hours, we build a high-fidelity, interactive portal preview styled with your logo and colors. There is zero cost, no credit card required, and no phone call needed. You review it at your own pace."
    },
    {
      q: "Can I explore real sample portals before requesting my own?",
      a: "Yes. We have 3 complete, live sample portals hosted on the web across distinct cohort models: The Growth Collective (12-week founder accelerator at growthcollective.cohortroom.com), Harbourline Institute (10-week executive leadership at leadership.cohortroom.com), and Northline Collective (16-week agency mastermind at agency.cohortroom.com). You can click into any of them directly from the live portals section on this page."
    },
    {
      q: "Will my portal be ready before my next cohort starts?",
      a: "Yes. Once you approve your preview, the full portal build takes under a week. Your portal goes live on your own domain, with your members' progress tracked from day one."
    },
    {
      q: "Do I need technical skills to run or update the portal?",
      a: "None at all. Module updates, session links, new resources and alert thresholds are handled for you on the monthly plan — you send them, they're live the same week."
    },
    {
      q: "How is this different from Skool, Circle, or Kajabi?",
      a: "Skool and Circle bury your curriculum inside noisy social feeds where members get distracted. Kajabi is a basic 2015 video locker. Your Portal gives your members a distraction-free, high-ticket home on your own domain, plus gives you an Operator Radar to flag at-risk members in week three."
    },
    {
      q: "Do members get their own logins?",
      a: "Not yet. Right now your members get one link to the cohort home, and your operator dashboard is kept current from the attendance and submission data you already collect — that's what the monthly plan covers. Individual member logins ship in the new year, and every existing client moves onto them at no extra cost and no price change."
    },
    {
      q: "What happens after I receive my free preview?",
      a: "If you love the preview and want it live for your upcoming cohort, we proceed with the full build under a fixed fee from the three tiers below. If you decide not to proceed, you walk away with zero obligations and keep the preview."
    },
    {
      q: "Can I use my own custom domain?",
      a: "Yes. Your portal deploys live on your custom domain (e.g. portal.yourprogram.com) with full SSL security, custom favicon, and your exact brand styling."
    },
    {
      q: "How does operator health tracking work?",
      a: "Member progress and engagement are checked against your cohort milestones. If a member hasn't opened modules for 4+ days or misses two consecutive worksheets, the Operator Radar flags them on your admin dashboard so you can intervene."
    },
    {
      q: "What if I need changes or updates later?",
      a: "Every full build includes two revision rounds before launch and full handover support. Module updates, new resources, and cohort rollovers are handled for you on your monthly plan."
    }
  ];

  return (
    <section className="py-16 md:py-28 px-6 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-slate-900/60 backdrop-blur-md text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
          <span className="text-orange-400">Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight">
          Everything you need to know before requesting your preview.
        </h2>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            onToggle={(e) => {
              if ((e.currentTarget as HTMLDetailsElement).open) {
                trackFAQExpansion(faq.q);
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
  );
}

