/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Problem from './components/Problem';
import Sprint from './components/Sprint';
import Features from './components/Features';
import Transformation from './components/Transformation';
import Audience from './components/Audience';
import MidPageIntercept from './components/MidPageIntercept';
import ClientSuccessStories from './components/ClientSuccessStories';
import Guarantee from './components/Guarantee';
import Pricing from './components/Pricing';
import ApplicationForm from './components/ApplicationForm';
import AdminDashboard from './components/AdminDashboard';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import FadeIn from './components/FadeIn';
import CursorTracker from './components/CursorTracker';
import SEO from './components/SEO';
import ExitIntentModal from './components/ExitIntentModal';
import FloatingChat from './components/FloatingChat';
import ScrollProgressBar from './components/ScrollProgressBar';
import { closeAllModals } from './lib/events';

const Divider = () => (
  <div className="w-full flex justify-center opacity-60 my-4 lg:my-8 relative z-10">
    <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>
);

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('pb_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('pb_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light-active');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      document.documentElement.classList.remove('theme-light-active');
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#ffffff';
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC to close all modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // 2. SPACE to scroll to the next section
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
              const currentScroll = mainContainer.scrollTop;
              // Find the first section whose offset top is strictly greater than currentScroll + 20
              const nextSection = sections.find((sec) => {
                const element = sec as HTMLElement;
                return element.offsetTop > currentScroll + 20;
              });

              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                // If we is at bottom, loop back to top
                mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'} selection:bg-orange-500/30 selection:text-orange-50 font-sans antialiased relative overflow-hidden transition-colors duration-300`}>
      <ScrollProgressBar />
      <SEO />
      <CursorTracker />
      <ExitIntentModal />
      <div className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] ${theme === 'light' ? 'bg-orange-500/5' : 'bg-orange-500/10'} blur-[120px] rounded-full pointer-events-none -z-10`}></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none -z-10"></div>
      <Topbar />
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <main>
        <FadeIn><Hero /></FadeIn>
        <Divider />
        <FadeIn><SocialProof /></FadeIn>
        <Divider />
        <FadeIn><Problem /></FadeIn>
        <Divider />
        <FadeIn><Sprint /></FadeIn>
        <Divider />
        <FadeIn><Features /></FadeIn>
        <Divider />
        <FadeIn><Transformation /></FadeIn>
        <Divider />
        <FadeIn><Audience /></FadeIn>
        <Divider />
        <FadeIn><MidPageIntercept /></FadeIn>
        <Divider />
        <FadeIn><ClientSuccessStories /></FadeIn>
        <Divider />
        <FadeIn><Guarantee /></FadeIn>
        <Divider />
        <FadeIn><Pricing /></FadeIn>
        <Divider />
        <FadeIn><FAQ /></FadeIn>
        <Divider />
        <FadeIn><FinalCTA /></FadeIn>
      </main>
      <ApplicationForm />
      <AdminDashboard />
      <FloatingChat />
      <Footer />
    </div>
  );
}
