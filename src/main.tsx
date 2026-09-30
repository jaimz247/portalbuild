import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceTracker } from './lib/performance';
import { LanguageProvider } from './context/LanguageContext';

initPerformanceTracker();

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
}

