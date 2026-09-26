import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LiveDemoPortal from './components/LiveDemoPortal';
import Problem from './components/Problem';
import Transformation from './components/Transformation';
import DeadlineGuarantee from './components/DeadlineGuarantee';
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
import ExitIntentTrigger from './components/ExitIntentTrigger';
import FadeIn from './components/FadeIn';
import CursorTracker from './components/CursorTracker';
import SEO from './components/SEO';
import ScrollProgressBar from './components/ScrollProgressBar';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LogosPage from './pages/LogosPage';
import PartnersPage from './pages/PartnersPage';
import AdminDashboard from './components/AdminDashboard';
import { closeAllModals, openAdminDashboard } from './lib/events';
import { initGA4 } from './lib/analytics';
import { initFirstPartyTracker } from './lib/tracker';

const Divider = () => (
  <div className="w-full flex justify-center opacity-60 my-4 lg:my-8 relative z-10">
    <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>
);

export default function App() {
  const getNormalizedRoute = () => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '/').replace(/\/+$/, '');
    
    if (rawPath === '/logos' || rawPath === '/brand' || hash === '/logos' || hash === '/brand') {
      return '/logos';
    }
    if (rawPath === '/privacy' || hash === '/privacy') {
      return '/privacy';
    }
    if (rawPath === '/terms' || hash === '/terms') {
      return '/terms';
    }
    if (rawPath === '/partners' || hash === '/partners' || hash === 'partners') {
      return '/partners';
    }
    if (rawPath === '/admin' || hash === '/admin' || hash === 'admin') {
      return '/admin';
    }
    return rawPath;
  };

  const [currentPath, setCurrentPath] = useState(getNormalizedRoute());
  const [programUrlFromQuery, setProgramUrlFromQuery] = useState<string>('');

  useEffect(() => {
    // Check for program URL parameter in query string & capture referral code
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get('programURL') || searchParams.get('url') || searchParams.get('site') || searchParams.get('program') || '';
      if (urlParam) {
        setProgramUrlFromQuery(urlParam);
      }

      // Referral capture: on first load of ANY page, if the URL has a ?ref= parameter,
      // store its value (uppercased, trimmed, maximum 20 characters, letters and numbers only) in sessionStorage under "pb_ref".
      // Do not change the URL or the page.
      const rawRef = searchParams.get('ref');
      if (rawRef) {
        const cleanRef = rawRef.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
        if (cleanRef) {
          sessionStorage.setItem('pb_ref', cleanRef);
        }
      }
    } catch {
      // safe fallback
    }

    // Deferred GA4 & First-Party Telemetry Initialization for Performance
    initGA4();
    initFirstPartyTracker();

    // Enforce dark mode #020617 background as per rules
    document.documentElement.classList.remove('theme-light-active');
    document.body.style.backgroundColor = '#020617';
    document.body.style.color = '#ffffff';

    const handleLocationChange = () => {
      setCurrentPath(getNormalizedRoute());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC to close all modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // Admin Dashboard shortcut: Shift + A or (Ctrl/Cmd + Shift + A)
      if ((e.shiftKey && (e.key === 'A' || e.key === 'a')) || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        const active = document.activeElement;
        const isTyping = active && (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT' ||
          active.hasAttribute('contenteditable')
        );
        if (!isTyping) {
          e.preventDefault();
          e.stopPropagation();
          openAdminDashboard();
        }
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
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (currentPath === '/privacy') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <ScrollProgressBar />
        <SEO 
          title="Privacy Policy — PortalBuild"
          description="Privacy policy, data handling, and regulatory compliance standards for PortalBuild cohort member portal services."
          url="https://getportalbuild.com/privacy"
        />
        <PrivacyPage />
        <Footer />
        <AdminDashboard />
      </div>
    );
  }

  if (currentPath === '/terms') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <ScrollProgressBar />
        <SEO 
          title="Terms of Service — PortalBuild"
          description="Terms of service, delivery timelines, and performance commitments for PortalBuild custom portal solutions."
          url="https://getportalbuild.com/terms"
        />
        <TermsPage />
        <Footer />
        <AdminDashboard />
      </div>
    );
  }

  if (currentPath === '/logos' || currentPath === '/brand') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <ScrollProgressBar />
        <SEO 
          title="Official Logo & Brand Asset Kit — PortalBuild"
          description="Official high-resolution vector logos, icons, badges, and brand assets for PortalBuild."
          url="https://getportalbuild.com/logos"
        />
        <LogosPage />
        <Footer />
        <AdminDashboard />
      </div>
    );
  }

  if (currentPath === '/partners') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <ScrollProgressBar />
        <SEO 
          title="Partner Programme · PortalBuild"
          description="Refer cohort-programme founders to PortalBuild. Free branded preview in 24 hours, 20% of the build and 10% monthly for a year. We never go around you."
          url="https://getportalbuild.com/partners"
          image="https://getportalbuild.com/images/cockpit-screenshot.png"
        />
        <PartnersPage />
        <Footer />
        <AdminDashboard />
      </div>
    );
  }

  if (currentPath === '/admin') {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased">
        <ScrollProgressBar />
        <SEO 
          title="Admin Control Center — PortalBuild"
          description="PortalBuild Admin Workspace and CRM intelligence engine."
          url="https://getportalbuild.com/admin"
        />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased relative overflow-x-hidden transition-colors duration-300">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <ScrollProgressBar />
      <SEO 
        title="PortalBuild — Member Retention Layer for Cohort Programs"
        description="One branded home for your program. One dashboard showing exactly who's falling behind. Live before your next cohort starts."
        url="https://getportalbuild.com"
      />
      <CursorTracker />
      
      {/* Background glow accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none -z-10"></div>

      {/* Navigation */}
      <Navigation />

      {/* Main Target Structure */}
      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <FadeIn><Hero /></FadeIn>
        <Divider />

        {/* 2. Interactive Demo */}
        <FadeIn><LiveDemoPortal programURL={programUrlFromQuery} /></FadeIn>
        <Divider />

        {/* 3. Problem / Core Argument */}
        <FadeIn><Problem /></FadeIn>
        <Divider />

        {/* 4. Operator Command Center */}
        <FadeIn><Transformation /></FadeIn>
        <FadeIn><DeadlineGuarantee /></FadeIn>
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

      {/* Exit Intent Trigger */}
      <ExitIntentTrigger />

      {/* Preview Request Modal Form */}
      <ApplicationForm />

      {/* Admin Dashboard */}
      <AdminDashboard />
    </div>
  );
}
