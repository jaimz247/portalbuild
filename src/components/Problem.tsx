import { ArrowRight } from 'lucide-react';

export default function Problem() {
  const panels = [
    {
      title: "Reality Gap",
      desc: "Clients cannot see the true value you are creating when it is buried inside a spreadsheet or an attached PDF report they will never open."
    },
    {
      title: "Perception Tax",
      desc: "You are charging premium fees, but your client delivery infrastructure looks like a messy link collection a beginner made on YouTube."
    },
    {
      title: "Retention Risk",
      desc: "When clients cancel, it is rarely because your strategy was bad. It is usually because they felt lost, confused, or lacked clear visibility into their progress."
    },
    {
      title: "Scaling Bottleneck",
      desc: "Your premium offer should not depend on a chaotic, manual system that forces you to repeat instructions and manually chase every client."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto" id="problem">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
            High-ticket experts are losing client retention over low-end presentation.
          </h2>
          <div className="text-slate-400 space-y-6 text-lg leading-relaxed">
            <p>
              You are delivering world-class value and real results to your clients. But the moment your client closes the Zoom call and has to search through email threads, WhatsApp messages, Google Drive folders, and confusing spreadsheets, the premium experience breaks down.
            </p>
            <p>
              <strong className="text-slate-200 font-medium">Presentation is trust.</strong> Right now, a messy backend system might be costing you the client retention and premium positioning you have already earned.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-7 grid md:grid-cols-2 gap-4">
          {panels.map((panel, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 flex flex-col gap-3 group hover:border-orange-500/50 hover:scale-[1.02] transform transition-all duration-300 relative overflow-hidden">
              <div className="text-[10px] text-orange-500 font-mono uppercase tracking-widest relative z-10">
                0{idx + 1} / {panel.title}
              </div>
              <p className="text-sm text-slate-300 leading-snug group-hover:text-white transition-colors relative z-10">
                {panel.desc}
              </p>
              <div className="absolute right-6 bottom-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-500">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
