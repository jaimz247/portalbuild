import { Plus } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "What software tools do you build these portals with?",
      a: "We use elite, lightweight no-code and low-code architecture—including platforms like Softr, Glide, Bubble, and Airtable—tailored entirely to your stack. The tech stack is invisible to your clients; they simply experience a premium, branded web application via their standard browser with no downloads required."
    },
    {
      q: "How is this better than a Looker Studio link or a standard template?",
      a: "Looker Studio or generic Notion templates look exactly like what they are: free, shared links. A custom portal signals permanence, premium enterprise investment, and security. It is an exclusive, white-label product owned under your domain that instantly elevates your brand value."
    },
    {
      q: "Can clients securely log in and see live, real-time data?",
      a: "Yes. While the free 72-hour prototype uses representative data structures to map out layout and user experience, the full paid build introduces live client authentication, secure individual logins, and real-time automated data integrations from your tools via API."
    },
    {
      q: "Who owns the portal architecture once the full build is done?",
      a: "You do. You own the entire build asset outright with no developer lock-in. We supply complete handoff and maintenance documentation so your internal team can update it seamlessly without us, though you can always opt for our ongoing support package."
    },
    {
      q: "What's the catch behind the free prototype?",
      a: "There is no catch, but there is a strict quality filter. Because we spend real development hours mapping out your layout, we only build prototypes for operators who have active client workflows and real intent to scale if the design delivers."
    },
    {
      q: "What about security protocols and enterprise-grade data handling?",
      a: "Our portals leverage enterprise-grade security protocols, including end-to-end encryption, strict role-based access controls, and secure tokenized authentication. All architecture complies with modern data handling regulations, ensuring that your clients' sensitive information remains isolated, protected, and fully within your control at all times."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto">
       <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block text-center">F.A.Q</span>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-16 text-center">
        Everything you need to know before applying.
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details key={idx} className="group bg-white/[0.02] border border-white/10 hover:border-orange-500/50 transition-colors [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer p-6 flex items-center justify-between text-sm font-bold tracking-wide text-slate-200 group-hover:text-white transition-colors list-none select-none">
              {faq.q}
              <span className="ml-6 flex-shrink-0 text-slate-600 group-open:rotate-45 transition-transform duration-300 transform group-hover:text-orange-500">
                 <Plus className="w-4 h-4" />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm pt-4 mt-2">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
