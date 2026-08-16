import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LiveDemoPortal from './components/LiveDemoPortal';
import Problem from './components/Problem';
import Transformation from './components/Transformation';
import Features from './components/Features';
import Sprint from './components/Sprint';
import WhyNotSkool from './components/WhyNotSkool';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import StickyMobileCTA from './components/StickyMobileCTA';
import ApplicationForm from './components/ApplicationForm';
import FadeIn from './components/FadeIn';
import CursorTracker from './components/CursorTracker';
import SEO from './components/SEO';
import ScrollProgressBar from './components/ScrollProgressBar';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LogosPage from './pages/LogosPage';
import { closeAllModals } from './lib/events';
import { initGA4 } from './lib/analytics';

const Divider = () => (
  <div className="w-full flex justify-center opacity-60 my-4 lg:my-8 relative z-10">
    <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Deferred GA4 Initialization for Performance
    initGA4();

    // Enforce dark mode #020617 background as per rules
    document.documentElement.classList.remove('theme-light-active');
    document.body.style.backgroundColor = '#020617';
    document.body.style.color = '#ffffff';

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC to close all modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // 2. SPACE to scroll to next section
      if (e.key === ' ' || e.key === 'Spacebar') {
        const active = document.activeElement;
        const isTyping = active && (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT' ||
          active.hasAttribute('contenteditable')
        );

        if (!isTyping) {
          e.preventDefault();
          const mainContainer = document.querySelector('main');
          if (mainContainer) {
            const sections = Array.from(mainContainer.querySelectorAll('section, main > div'));
            if (sections.length > 0) {
              const currentScroll = mainContainer.scrollTop || window.scrollY;
              const nextSection = sections.find((sec) => {
                const element = sec as HTMLElement;
                return element.offsetTop > currentScroll + 20;
              });

              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/privacy') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <SEO />
        <PrivacyPage />
        <Footer />
      </div>
    );
  }

  if (currentPath === '/terms') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <SEO />
        <TermsPage />
        <Footer />
      </div>
    );
  }

  if (currentPath === '/logos' || currentPath === '/brand') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <SEO />
        <LogosPage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased relative overflow-x-hidden transition-colors duration-300">
      <ScrollProgressBar />
      <SEO />
      <CursorTracker />
      
      {/* Background glow accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none -z-10"></div>

      {/* Navigation */}
      <Navigation />

      {/* Main Target Structure */}
      <main>
        {/* 1. Hero */}
        <FadeIn><Hero /></FadeIn>
        <Divider />

        {/* 2. Interactive Demo */}
        <FadeIn><LiveDemoPortal /></FadeIn>
        <Divider />

        {/* 3. Problem / Core Argument */}
        <FadeIn><Problem /></FadeIn>
        <Divider />

        {/* 4. Operator Command Center */}
        <FadeIn><Transformation /></FadeIn>
        <Divider />

        {/* 5. Member Experience / 9-Screen Grid */}
        <FadeIn><Features /></FadeIn>
        <Divider />

        {/* 6. 5-Step Sprint */}
        <FadeIn><Sprint /></FadeIn>
        <Divider />

        {/* 7. Why Not Skool / Circle / Kajabi? */}
        <FadeIn><WhyNotSkool /></FadeIn>
        <Divider />

        {/* 8. Founding Client Proof */}
        <FadeIn><SocialProof /></FadeIn>
        <Divider />

        {/* 9. Pricing */}
        <FadeIn><Pricing /></FadeIn>
        <Divider />

        {/* 10. FAQ */}
        <FadeIn><FAQ /></FadeIn>
        <Divider />

        {/* 11. Final CTA */}
        <FadeIn><FinalCTA /></FadeIn>
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />

      {/* Preview Request Modal Form */}
      <ApplicationForm />
    </div>
  );
}
