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
      title: "Two Revision Rounds",
      desc: "Includes two rounds of revisions. We adjust branding, module links, copy, and operator alerts until every single detail meets your exact standard."
    },
    {
      step: "05",
      title: "Live On Your Domain",
      desc: "Your portal deploys live on your domain before your cohort starts. Members log in seamlessly on day one."
    }
  ];

  return (
    <section className="py-16 md:py-28 px-6 max-w-6xl mx-auto relative" id="how-it-works">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-slate-900/60 backdrop-blur-md text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
          <span className="text-orange-400">Days, Not Weeks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight mb-4">
          Live before your next cohort starts. Under a week.
        </h2>
        <p className="text-slate-300/90 text-base md:text-lg leading-relaxed">
          Cohort launch dates are hard deadlines. Our 5-step process gets your program portal live fast without taking up your operator bandwidth.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/40 border border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between hover:border-white/[0.18] transition-all duration-300 backdrop-blur-md relative overflow-hidden group"
          >
            {/* Top specular hairline edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            <div>
              <div className="text-xs text-orange-400 font-mono font-bold mb-3 uppercase tracking-widest flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[10px]">
                  STEP {item.step}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400/80"></span>
              </div>
              <h3 className="text-slate-100 font-bold tracking-tight text-sm md:text-base mb-2 group-hover:text-orange-400 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300/80 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

