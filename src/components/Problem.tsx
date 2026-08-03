export default function Problem() {
  const beats = [
    {
      step: "Beat 1",
      title: "The Stakes",
      headline: "Silent drop-offs cost you refund requests and non-renewals.",
      desc: "Members don't announce that they've checked out. They go quiet in week three, stop opening links, and surface as a refund request or a silent non-renewal. Scattered delivery doesn't just look unprofessional — it hides the people you're about to lose.",
      accent: "border-rose-500/30 bg-rose-950/20 text-rose-400"
    },
    {
      step: "Beat 2",
      title: "The Fix",
      headline: "Intervene in week three instead of finding out in week nine.",
      desc: "One branded portal where every member sees their cohort, their modules, their progress and what's next. And one operator screen where you see everyone's — so you intervene in week three instead of finding out in week nine.",
      accent: "border-orange-500/30 bg-orange-950/20 text-orange-400"
    },
    {
      step: "Beat 3",
      title: "The Window",
      headline: "You get one chance at the first 48 hours.",
      desc: "A cohort start date is a hard deadline. Members form their impression of your program in the first 48 hours and you only get one. Live before day one, or wait for the next cohort.",
      accent: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="argument">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Why high-ticket cohort programs lose members they could have saved.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {beats.map((beat, idx) => (
          <div
            key={idx}
            className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${beat.accent}`}>
                  0{idx + 1} · {beat.title}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                {beat.headline}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {beat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

