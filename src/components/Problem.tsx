export default function Problem() {
  const beats = [
    {
      step: "Beat 1",
      title: "The Stakes",
      headline: "Silent drop-offs cost you refund requests and non-renewals.",
      desc: "Members don't announce that they've checked out. They go quiet in week three, stop opening links, and surface as a refund request or a silent non-renewal. Scattered delivery doesn't just look unprofessional — it hides the people you're about to lose.",
      accent: "border-rose-500/25 bg-rose-500/10 text-rose-400"
    },
    {
      step: "Beat 2",
      title: "The Fix",
      headline: "Intervene in week three instead of finding out in week nine.",
      desc: "One branded portal where every member sees their cohort, their modules, their progress and what's next. And one operator screen where you see everyone's — so you intervene in week three instead of finding out in week nine.",
      accent: "border-orange-500/25 bg-orange-500/10 text-orange-400"
    },
    {
      step: "Beat 3",
      title: "The Window",
      headline: "You get one chance at the first 48 hours.",
      desc: "A cohort start date is a hard deadline. Members form their impression of your program in the first 48 hours and you only get one. Live before day one, or wait for the next cohort.",
      accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="argument">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
          Retention Dynamics
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Why high-ticket cohort programs lose members they could have saved.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        {beats.map((beat, idx) => (
          <div
            key={idx}
            className="p-6 md:p-8 rounded-xl bg-slate-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-400 font-medium">
                  0{idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {beat.title}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 leading-snug tracking-tight">
                {beat.headline}
              </h3>
              <p className="text-slate-300/80 text-sm leading-relaxed">
                {beat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

