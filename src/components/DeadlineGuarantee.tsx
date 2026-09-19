export default function DeadlineGuarantee() {
  return (
    <section 
      id="deadline-guarantee"
      className="w-full py-12 md:py-16 px-6 bg-slate-950/80 border-y border-white/[0.08] text-center relative overflow-hidden"
    >
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-2xl pointer-events-none -z-10" 
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
          <span>Delivery Guarantee // Day-7 SLA</span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-[-0.03em] mb-4 leading-snug">
          Live 7 days before your start date, or you don't pay.
        </h3>
        <p className="text-slate-300/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Your cohort start date is a hard deadline. If your portal is not live on your domain a full week before day one, the build is free.
        </p>
      </div>
    </section>
  );
}
