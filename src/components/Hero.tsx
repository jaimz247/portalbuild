import { openApplicationModal } from '../lib/events';

interface HeroProps {
  onOpenModal?: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const handlePrimaryCTA = (e?: React.MouseEvent) => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal(e);
    }
  };

  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoSection = document.getElementById('live-demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-24 px-6 max-w-6xl mx-auto text-center flex flex-col items-center relative">
      {/* Category Descriptor - Refined Editorial Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-slate-900/40 text-xs text-slate-300 mb-8">
        <span className="text-[11px] font-mono tracking-wide text-slate-300">
          The member retention layer for high-ticket cohort programs
        </span>
      </div>

      {/* H1 Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-[-0.03em] text-white mb-6 leading-[1.06] max-w-4xl">
        Every cohort, you lose members you could have saved.
      </h1>

      {/* Hero Subhead */}
      <p className="text-lg md:text-xl text-slate-300/90 max-w-2xl mb-10 leading-relaxed font-normal">
        One branded home for your program. One dashboard showing exactly who's falling behind. Live before your next cohort starts.
      </p>

      {/* Primary CTA & Microcopy */}
      <div className="flex flex-col items-center w-full max-w-md">
        <button
          onClick={handlePrimaryCTA}
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-8 py-4 text-base md:text-lg font-semibold tracking-tight rounded-xl border border-orange-400/30 shadow-sm transition-colors w-full cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span>Get my free portal preview</span>
        </button>

        {/* Microcopy Reassurance */}
        <div className="flex flex-col items-center mt-3.5 gap-1">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Free. No call required. No card. You keep the preview.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-medium">
            <span>Live 7 days before your start date, or you don't pay.</span>
          </div>
        </div>

        {/* Secondary Text Link */}
        <a
          href="#live-demo"
          onClick={scrollToDemo}
          className="mt-6 inline-flex items-center gap-1 text-xs font-mono tracking-wider text-slate-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
        >
          <span>SEE LIVE DEMO PORTAL</span>
          <span className="text-orange-400">↓</span>
        </a>
      </div>

      {/* Hero Portal High-Performance Asset Frame */}
      <div className="mt-12 md:mt-16 w-full max-w-5xl rounded-2xl border border-white/[0.08] bg-slate-900/40 p-2 md:p-3 shadow-2xl relative overflow-hidden group">
        {/* Obsidian Window Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] mb-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-0.5 rounded-md bg-slate-950/60 border border-white/[0.06] text-[11px] text-slate-400">
            <span className="text-emerald-400">●</span>
            <span>portal.yourbrand.com</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span>MEMBER HOME</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/[0.06] bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none opacity-30"></div>
          <picture>
            <source
              type="image/avif"
              srcSet="/images/hero-portal.avif 1x, /images/hero-portal-2x.avif 2x"
            />
            <source
              type="image/webp"
              srcSet="/images/hero-portal.webp 1x, /images/hero-portal-2x.webp 2x"
            />
            <img
              src="/images/hero-portal.webp"
              width={1200}
              height={675}
              alt="PortalBuild Branded Cohort Member Portal Interface Preview"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.008]"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

