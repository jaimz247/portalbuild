import { Users, Briefcase, Settings, AlertTriangle } from 'lucide-react';

export default function Audience() {
  const cards = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Premium Coaches",
      desc: "Executive, Business, Sales, Leadership, or Career coaches looking to clear up client communication and match their high-ticket fees."
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Digital & Marketing Agencies",
      desc: "Paid Ads, Lead-Gen, SEO, Content, or CRM/Automation agencies who need a single, white-label hub to display pipeline data, live KPIs, and asset links without sending manual weekly reports."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Fractional Operators & Consultants",
      desc: "Fractional CMOs, COOs, CFOs, or corporate consultants managing multiple high-tier client ecosystems simultaneously."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-orange-500 font-mono tracking-widest text-[10px] uppercase mb-4 block">Who this is for</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
              Built for serious experts who value client experience.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              This execution sprint is explicitly designed for established providers who have paying clients, a repeatable service delivery model, and a desire to elevate their brand authority.
            </p>
          </div>

          <div className="bg-[#1f2123] border border-slate-700 p-8 relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-amber-500 font-bold">⚠️</span>
              <h4 className="text-amber-500 text-[10px] font-bold uppercase tracking-widest font-mono">This is NOT for you if:</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              You do not have paying clients yet, you are still figuring out what you sell, you want a complex enterprise system for free, or you have no genuine intent to invest if the prototype delivers.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 grid md:grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className={`bg-white/[0.02] border border-white/10 p-8 hover:border-orange-500/50 transition-colors ${idx === 2 ? 'md:col-span-2' : ''}`}>
              <div className="w-10 h-10 bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 mb-6 group-hover:text-orange-500 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-200 mb-3">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
