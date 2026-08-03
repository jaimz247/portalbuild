export default function Sprint() {
  const steps = [
    {
      step: "01",
      title: "Free Preview Built From Your Page",
      desc: "Paste your program sales page URL. We build a real, high-fidelity portal preview within 24 hours — no call required."
    },
    {
      step: "02",
      title: "30-Min Intake Call",
      desc: "We walk through your preview, review your exact cohort dates, module schedule, assets, and operator health rules."
    },
    {
      step: "03",
      title: "The Rapid Build",
      desc: "We build your complete 9-screen member home, operator dashboard, database architecture, and onboarding automations."
    },
    {
      step: "04",
      title: "One Revision Round",
      desc: "We adjust branding, module links, copy, and operator alerts until every single detail meets your exact standard."
    },
    {
      step: "05",
      title: "Live On Your Domain",
      desc: "Your portal deploys live on your domain before your cohort starts. Members log in seamlessly on day one."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto relative" id="how-it-works">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
          <span>Days, Not Weeks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Live before your next cohort starts. Under a week.
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
          Cohort launch dates are hard deadlines. Our 5-step process gets your program portal live fast without taking up your operator bandwidth.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-white/10 p-5 rounded-xl flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 group"
          >
            <div>
              <div className="text-xs text-orange-400 font-mono font-bold mb-3 uppercase tracking-widest flex items-center justify-between">
                <span>Step {item.step}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              </div>
              <h3 className="text-slate-100 font-bold tracking-tight text-sm md:text-base mb-2 group-hover:text-orange-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

