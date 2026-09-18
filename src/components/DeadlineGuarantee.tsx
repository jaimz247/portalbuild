export default function DeadlineGuarantee() {
  return (
    <section 
      id="deadline-guarantee"
      className="w-full py-12 md:py-16 px-6 bg-gradient-to-r from-orange-950/40 via-slate-900 to-orange-950/40 border-y border-orange-500/30 text-center relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-snug">
          Live 7 days before your start date, or you don't pay.
        </h3>
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Your cohort start date is a hard deadline. If your portal is not live on your domain a full week before day one, the build is free.
        </p>
      </div>
    </section>
  );
}
