// GA4 Analytics Event Tracking Utility (Deferred loading)

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-PORTALBUILD2026';

let isInitialized = false;

export const initGA4 = () => {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // Initialize dataLayer and window.gtag array queue
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  // Defer script injection until idle or after window load for LCP performance
  const loadScript = () => {
    if (document.getElementById('ga4-script')) return;
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(loadScript, { timeout: 3000 });
  } else {
    setTimeout(loadScript, 2000);
  }
};

// Custom GA4 Event Trackers
export const trackFormSubmission = (formData?: { email?: string; programUrl?: string }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'form',
      event_label: 'preview_request',
      value: 100,
    });
    window.gtag('event', 'submit_form', {
      form_name: 'preview_request_form',
      program_url: formData?.programUrl || 'unspecified',
    });
  }
  console.log('📊 [GA4] Form Submission Tracked:', formData);
};

export const trackPricingView = (tierName?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      item_category: 'pricing',
      item_name: tierName || 'Founding Cohort Partner',
      value: 1000,
      currency: 'USD',
    });
    window.gtag('event', 'view_pricing', {
      section: 'pricing_table',
      tier: tierName || 'Founding Partner',
    });
  }
  console.log('📊 [GA4] Pricing View Tracked:', tierName);
};

export const trackDemoInteraction = (tabName: string, actionDetails?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_content', {
      content_type: 'demo_screen',
      item_id: tabName,
    });
    window.gtag('event', 'demo_interaction', {
      action: actionDetails || 'switch_tab',
      screen: tabName,
    });
  }
  console.log('📊 [GA4] Demo Interaction Tracked:', tabName);
};
