/**
 * Lightweight performance tracking module for Core Web Vitals.
 * Logs metrics in a beautifully polished console layout during development.
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

export function initPerformanceTracker() {
  // Only execute in development or preview mode (or when explicitly testing)
  const isDev = 
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('ais-dev') || 
    window.location.hostname.includes('127.0.0.1');

  if (!isDev) return;

  console.log(
    '%c⚡ PortalBuild Performance Monitor Active %c[Development Mode]',
    'background: #ea580c; color: #ffffff; padding: 3px 6px; font-weight: bold; border-radius: 3px;',
    'color: #94a3b8; font-weight: normal;'
  );

  const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (name) {
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const logMetric = (metric: WebVitalMetric) => {
    const ratingColors = {
      good: 'background: #22c55e; color: #ffffff;',
      'needs-improvement': 'background: #eab308; color: #1e293b;',
      poor: 'background: #ef4444; color: #ffffff;',
    };

    const ratingEmoji = {
      good: '🟢 PASS',
      'needs-improvement': '🟡 WARN',
      poor: '🔴 FAIL',
    };

    console.groupCollapsed(
      `%c ${metric.name} %c ${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'} %c ${ratingEmoji[metric.rating]} `,
      'background: #1e293b; color: #cbd5e1; padding: 2px 4px; font-weight: bold; border-radius: 3px 0 0 3px;',
      'background: rgba(249, 115, 22, 0.1); color: #f97316; padding: 2px 4px; font-weight: bold;',
      `${ratingColors[metric.rating]} padding: 2px 4px; font-weight: bold; border-radius: 0 3px 3px 0;`
    );
    console.log(`%cMetric Name:%c ${metric.name}`, 'color: #94a3b8;', 'color: #f1f5f9; font-weight: bold;');
    console.log(`%cValue:%c ${metric.value.toFixed(4)} ${metric.name === 'CLS' ? 'units' : 'ms'}`, 'color: #94a3b8;', 'color: #f1f5f9; font-weight: bold;');
    console.log(`%cStatus:%c ${metric.rating.toUpperCase()}`, 'color: #94a3b8;', `${metric.rating === 'good' ? 'color: #22c55e' : metric.rating === 'needs-improvement' ? 'color: #eab308' : 'color: #ef4444'}; font-weight: bold;`);
    console.log(`%cDescription:%c ${metric.description}`, 'color: #94a3b8;', 'color: #cbd5e1; font-style: italic;');
    console.groupEnd();
  };

  // 1. First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('first-contentful-paint');
      if (entries.length > 0) {
        const val = entries[0].startTime;
        logMetric({
          name: 'FCP',
          value: val,
          rating: getRating('FCP', val),
          description: 'First Contentful Paint measures the time from when the page starts loading to when any part of the page’s content is rendered on the screen.',
        });
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Suppress if api not fully supported
  }

  // 2. Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        const val = lastEntry.startTime;
        logMetric({
          name: 'LCP',
          value: val,
          rating: getRating('LCP', val),
          description: 'Largest Contentful Paint measures when the largest text block or image element is rendered on screen.',
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // Suppress
  }

  // 3. Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShift = entry as any;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Log cumulative layout shift on page hide/leave/unload which completes the accumulation
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        logMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          description: 'Cumulative Layout Shift measures visual stability by quantifying how often elements move unexpectedly during loading and interaction stages.',
        });
      }
    }, { once: true });
  } catch (e) {
    // Suppress
  }

  // 4. First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fidEntry = entries[0] as any;
        const val = fidEntry.processingStart - fidEntry.startTime;
        logMetric({
          name: 'FID',
          value: val,
          rating: getRating('FID', val),
          description: 'First Input Delay measures the time from when a user first interacts with your site to the time when the browser is actually able to respond.',
        });
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // Suppress
  }

  // 5. Time to First Byte (TTFB)
  try {
    const ttfb = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (ttfb) {
      const val = ttfb.responseStart;
      logMetric({
        name: 'TTFB',
        value: val,
        rating: getRating('TTFB', val),
        description: 'Time to First Byte is the foundational metric that measures the response time of the web server for the first returned data packet.',
      });
    }
  } catch (e) {
    // Suppress
  }
}
