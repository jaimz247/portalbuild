import { ShieldCheck, Zap, Award } from 'lucide-react';

export default function SocialProof() {
  const points = [
    {
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      title: "Built in Days, Not Months",
      desc: "Live before day one of your next cohort. Under a week turnaround from preview approval to domain deployment."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-orange-400" />,
      title: "Founding Cohort Rate",
      desc: "Lock in founding partner pricing ($1,000 off standard fee) in exchange for a post-launch testimonial."
    },
    {
      icon: <Award className="w-5 h-5 text-orange-400" />,
      title: "Zero-Risk Free Preview",
      desc: "We build your custom portal preview from your sales page before you spend a single dollar or book a call."
    }
  ];

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto border-t border-b border-white/10 bg-slate-900/40" id="proof">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span>Founding Client Opportunity</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-8 max-w-2xl">
          Currently building case studies — apply to be a founding client.
        </h3>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 w-full text-left">
          {points.map((point, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                {point.icon}
              </div>
              <h4 className="text-base font-bold text-white">{point.title}</h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

