import { openApplicationModal } from '../lib/events';

interface HeroProps {
  onOpenModal?: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const handlePrimaryCTA = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      openApplicationModal();
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
    <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
      {/* Category Descriptor */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs md:text-sm font-medium tracking-wide mb-8">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        <span>The member retention layer for high-ticket cohort programs</span>
      </div>

      {/* H1 Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl">
        Every cohort, you lose members you could have saved.
      </h1>

      {/* Hero Subhead */}
      <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-normal">
        One branded home for your program. One dashboard showing exactly who's falling behind. Live before your next cohort starts.
      </p>

      {/* Primary CTA & Microcopy */}
      <div className="flex flex-col items-center w-full max-w-md">
        <button
          onClick={handlePrimaryCTA}
          className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 text-base md:text-lg font-bold tracking-tight rounded-md shadow-lg shadow-orange-600/25 transition-all duration-300 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] w-full cursor-pointer min-h-[48px]"
        >
          Get my free portal preview
        </button>

        {/* Microcopy Reassurance */}
        <p className="text-xs md:text-sm text-slate-400 mt-3 font-medium tracking-wide">
          Free. No call required. No card. You keep the preview.
        </p>
        <p className="text-xs md:text-sm text-orange-400 mt-1.5 font-medium tracking-wide">
          Live 7 days before your start date, or you don't pay.
        </p>

        {/* Secondary Text Link */}
        <a
          href="#live-demo"
          onClick={scrollToDemo}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
        >
          <span>See a live demo portal ↓</span>
        </a>
      </div>

      {/* Hero Portal High-Performance Asset (AVIF/WebP with srcset, explicit width/height to eliminate CLS and maximize LCP) */}
      <div className="mt-12 md:mt-16 w-full max-w-5xl rounded-2xl border border-white/15 bg-slate-950 p-2 md:p-3 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none opacity-40"></div>
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
            className="w-full h-auto rounded-xl border border-white/10 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </picture>
      </div>
    </section>
  );
}

