import { collection, doc, setDoc, getDocs, deleteDoc, query, where, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSession {
  id: string;
  sessionId: string;
  visitorId: string;
  isReturning: boolean;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ref: string;
  a: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  path: string;
  startedAt: string;
  lastActiveAt?: string;
  pageViews?: number;
  isInternal?: boolean;
  clientIp?: string;
}

export interface SiteEvent {
  id: string;
  sessionId: string;
  visitorId: string;
  eventType: string;
  eventCategory: 'conversion' | 'intent' | 'engagement' | 'discovery' | 'retention';
  label: string;
  path: string;
  timestamp: string;
  metadata?: string;
  isInternal?: boolean;
  clientIp?: string;
}

// Storage Keys
const VISITOR_KEY = 'pb_visitor_id';
const SESSION_KEY = 'pb_session_id';
const LOCAL_SESSIONS_KEY = 'portalbuild_local_sessions';
const LOCAL_EVENTS_KEY = 'portalbuild_local_events';
const EXCLUDED_IPS_KEY = 'pb_excluded_ips';
const EXCLUDE_DEVICE_KEY = 'pb_exclude_this_device';
const DNT_KEY = 'pb_dnt_active';
const CACHED_IP_KEY = 'pb_cached_client_ip';

// Safe ID generator adhering to isValidId /^[a-zA-Z0-9_\-\.\@]+$/
const generateId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

/* =========================================================================
   IP & DEVICE EXCLUSION ENGINE
   ========================================================================= */

// In-memory cached IP
let memoryClientIp: string = '';

export const getCachedClientIp = (): string => {
  if (memoryClientIp) return memoryClientIp;
  if (typeof window === 'undefined') return '';
  try {
    const cached = sessionStorage.getItem(CACHED_IP_KEY) || localStorage.getItem(CACHED_IP_KEY);
    if (cached) {
      memoryClientIp = cached;
      return cached;
    }
  } catch {
    // Storage restricted
  }
  return '';
};

export const fetchClientIp = async (): Promise<string> => {
  if (typeof window === 'undefined') return '';
  const cached = getCachedClientIp();
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      if (data?.ip && typeof data.ip === 'string') {
        const cleanIp = data.ip.trim();
        memoryClientIp = cleanIp;
        try {
          sessionStorage.setItem(CACHED_IP_KEY, cleanIp);
          localStorage.setItem(CACHED_IP_KEY, cleanIp);
        } catch {
          // ignore
        }
        return cleanIp;
      }
    }
  } catch (err) {
    console.debug('[Tracker] IP lookup silently bypassed:', err);
  }
  return '';
};

export const getExcludedIps = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EXCLUDED_IPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setExcludedIps = (ips: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const cleanList = Array.from(new Set(ips.map((ip) => ip.trim()).filter(Boolean)));
    localStorage.setItem(EXCLUDED_IPS_KEY, JSON.stringify(cleanList));
    window.dispatchEvent(new Event('portalbuild-exclusion-changed'));
  } catch {
    // Storage restricted
  }
};

export const addExcludedIp = (ip: string): void => {
  const list = getExcludedIps();
  if (ip && !list.includes(ip.trim())) {
    list.push(ip.trim());
    setExcludedIps(list);
  }
};

export const removeExcludedIp = (ip: string): void => {
  const list = getExcludedIps();
  setExcludedIps(list.filter((item) => item !== ip.trim()));
};

export const isThisDeviceExcluded = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(EXCLUDE_DEVICE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setThisDeviceExcluded = (excluded: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXCLUDE_DEVICE_KEY, excluded ? 'true' : 'false');
    window.dispatchEvent(new Event('portalbuild-exclusion-changed'));
  } catch {
    // Storage restricted
  }
};

export const isDoNotTrackActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DNT_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setDoNotTrackActive = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DNT_KEY, active ? 'true' : 'false');
  } catch {
    // Storage restricted
  }
};

/**
 * Checks if the current visitor is an internal developer/admin session.
 * Considers:
 * 1. Explicit "Exclude This Device" flag on device
 * 2. Client IP matching excluded list
 * 3. URL path being /admin
 * 4. Localhost or dev preview container flag
 */
export const checkIsInternalTraffic = (overrideIp?: string): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. Explicit device exclusion
  if (isThisDeviceExcluded()) return true;

  // 2. Route is Admin
  if (window.location.pathname.startsWith('/admin')) return true;

  // 3. IP in excluded list
  const currentIp = overrideIp || getCachedClientIp();
  if (currentIp) {
    const excludedIps = getExcludedIps();
    if (excludedIps.includes(currentIp)) return true;
  }

  return false;
};

/* =========================================================================
   SESSION & VISITOR IDENTIFICATION
   ========================================================================= */

export const getVisitorId = (): { visitorId: string; isReturning: boolean } => {
  if (typeof window === 'undefined') return { visitorId: 'vis_srv', isReturning: false };
  let visitorId = localStorage.getItem(VISITOR_KEY);
  let isReturning = true;

  if (!visitorId) {
    visitorId = generateId('vis');
    try {
      localStorage.setItem(VISITOR_KEY, visitorId);
    } catch {
      // Storage restricted
    }
    isReturning = false;
  }
  return { visitorId, isReturning };
};

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'sess_srv';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId('sess');
    try {
      sessionStorage.setItem(SESSION_KEY, sessionId);
    } catch {
      // Storage restricted
    }
  }
  return sessionId;
};

export const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua);
  const isTablet = /tablet|ipad|android(?!.*mobile)/i.test(ua);

  if (isMobile || width < 768) return 'mobile';
  if (isTablet || (width >= 768 && width <= 1024)) return 'tablet';
  return 'desktop';
};

export const getCleanReferrer = (): string => {
  if (typeof window === 'undefined') return 'Direct / None';
  const ref = document.referrer;
  if (!ref) return 'Direct / None';
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, '');
    if (host.includes('google')) return 'Google Organic';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) return 'Twitter / X';
    if (host.includes('youtube')) return 'YouTube';
    if (host.includes('skool')) return 'Skool Community';
    if (host.includes('notion')) return 'Notion';
    if (host.includes('substack') || host.includes('beehiiv')) return 'Newsletter';
    return host;
  } catch {
    return 'Referral (External)';
  }
};

/* =========================================================================
   TELEMETRY INITIALIZATION & LOGGING
   ========================================================================= */

let trackerInitialized = false;

export const initFirstPartyTracker = () => {
  if (trackerInitialized || typeof window === 'undefined') return;
  trackerInitialized = true;

  // If Do Not Track is toggled on this browser, bypass logging entirely
  if (isDoNotTrackActive()) {
    console.debug('[Tracker] Do Not Track active. Telemetry suppressed.');
    return;
  }

  try {
    const { visitorId, isReturning } = getVisitorId();
    const sessionId = getSessionId();
    const params = new URLSearchParams(window.location.search);
    const initialIp = getCachedClientIp();
    const isInternal = checkIsInternalTraffic(initialIp);

    const sessionPayload: SiteSession = {
      id: sessionId,
      sessionId,
      visitorId,
      isReturning,
      referrer: getCleanReferrer(),
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      ref: params.get('ref') || '',
      a: params.get('a') || '',
      deviceType: getDeviceType(),
      path: window.location.pathname || '/',
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      pageViews: 1,
      isInternal,
      ...(initialIp ? { clientIp: initialIp } : {}),
    };

    // Save to local cache
    saveLocalSession(sessionPayload);

    // Save to Firestore site_sessions asynchronously
    setDoc(doc(collection(db, 'site_sessions'), sessionId), sessionPayload).catch((err) => {
      console.debug('[Tracker] Firestore session notice:', err);
    });

    // Record initial page view event
    trackAction('page_view', {
      category: 'discovery',
      label: `Page View: ${document.title || window.location.pathname}`,
      metadata: { referrer: sessionPayload.referrer, path: sessionPayload.path },
    });

    // Setup interactive trackers
    setupScrollTracking();
    setupClickTracking();
    setupHeartbeatTracker(sessionId);

    // Asynchronously resolve IP if not already cached and re-validate internal status
    if (!initialIp) {
      fetchClientIp().then((resolvedIp) => {
        if (resolvedIp) {
          const updatedIsInternal = checkIsInternalTraffic(resolvedIp);
          const updateData: Partial<SiteSession> = {
            clientIp: resolvedIp,
            isInternal: updatedIsInternal,
          };
          updateLocalSession(sessionId, updateData);
          setDoc(doc(collection(db, 'site_sessions'), sessionId), updateData, { merge: true }).catch(() => {});
        }
      });
    }
  } catch (err) {
    console.debug('[Tracker] Initialization suppressed:', err);
  }
};

export const trackAction = (
  eventType: string,
  options?: {
    category?: 'conversion' | 'intent' | 'engagement' | 'discovery' | 'retention';
    label?: string;
    metadata?: Record<string, any> | string;
  }
) => {
  if (typeof window === 'undefined') return;
  if (isDoNotTrackActive()) return;

  try {
    const sessionId = getSessionId();
    const { visitorId } = getVisitorId();
    const eventId = generateId('evt');
    const clientIp = getCachedClientIp();
    const isInternal = checkIsInternalTraffic(clientIp);

    const metaString =
      typeof options?.metadata === 'object'
        ? JSON.stringify(options.metadata).substring(0, 1000)
        : (options?.metadata || '').substring(0, 1000);

    const eventPayload: SiteEvent = {
      id: eventId,
      sessionId,
      visitorId,
      eventType: eventType.substring(0, 100),
      eventCategory: options?.category || 'engagement',
      label: (options?.label || eventType).substring(0, 300),
      path: (window.location.pathname || '/').substring(0, 300),
      timestamp: new Date().toISOString(),
      isInternal,
      ...(clientIp ? { clientIp } : {}),
      ...(metaString ? { metadata: metaString } : {}),
    };

    // Save to local cache
    saveLocalEvent(eventPayload);

    // Dispatch custom browser event for live reactive dashboard updating
    window.dispatchEvent(
      new CustomEvent('portalbuild-tracker-event', {
        detail: eventPayload,
      })
    );

    // Save to Firestore site_events
    setDoc(doc(collection(db, 'site_events'), eventId), eventPayload).catch((err) => {
      console.debug('[Tracker] Event logging notice:', err);
    });
  } catch (err) {
    console.debug('[Tracker] Action tracking notice:', err);
  }
};

// Scroll tracking for 25%, 50%, 75%, 90%
const setupScrollTracking = () => {
  if (typeof window === 'undefined') return;
  const milestonesLogged = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const progress = Math.round((window.scrollY / scrollHeight) * 100);

    const thresholds = [25, 50, 75, 90];
    for (const t of thresholds) {
      if (progress >= t && !milestonesLogged.has(t)) {
        milestonesLogged.add(t);
        trackAction('scroll_depth', {
          category: 'engagement',
          label: `Scrolled ${t}% of page`,
          metadata: { depth: t, path: window.location.pathname },
        });
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};

// Global click tracking for high-intent links (Cal.com, Live Demo external links)
const setupClickTracking = () => {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') || '';

    if (href.includes('cal.com')) {
      trackAction('cal_fit_call_click', {
        category: 'conversion',
        label: 'Cal.com 20-min Fit Call Clicked',
        metadata: { targetUrl: href, text: target.innerText?.trim()?.substring(0, 60) },
      });
    } else if (href.includes('cohortroom.com')) {
      trackAction('sample_portal_outbound_click', {
        category: 'intent',
        label: `Sample Portal Outbound: ${href}`,
        metadata: { targetUrl: href },
      });
    }
  });
};

// Active Time On Page (Heartbeat) - fires milestones at 15s, 30s, 60s, 120s, 300s
const setupHeartbeatTracker = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  const milestones = [15, 30, 60, 120, 300];
  const logged = new Set<number>();
  let seconds = 0;

  const interval = setInterval(() => {
    seconds += 5;
    for (const m of milestones) {
      if (seconds >= m && !logged.has(m)) {
        logged.add(m);
        trackAction('time_on_page', {
          category: 'retention',
          label: `Active time reached ${m}s`,
          metadata: { seconds: m },
        });
      }
    }

    // Keep session active timestamp fresh
    if (seconds % 30 === 0) {
      const nowStr = new Date().toISOString();
      updateLocalSession(sessionId, { lastActiveAt: nowStr });
      setDoc(doc(collection(db, 'site_sessions'), sessionId), { lastActiveAt: nowStr }, { merge: true }).catch(() => {});
    }

    // Stop after 20 minutes of continuous presence
    if (seconds >= 1200) {
      clearInterval(interval);
    }
  }, 5000);
};

/* =========================================================================
   LOCAL CACHE & DATA MANAGEMENT
   ========================================================================= */

const saveLocalSession = (session: SiteSession) => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    const list: SiteSession[] = raw ? JSON.parse(raw) : [];
    const existingIdx = list.findIndex((s) => s.sessionId === session.sessionId);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...session };
    } else {
      list.unshift(session);
    }
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list.slice(0, 200)));
  } catch {
    // storage restricted
  }
};

const updateLocalSession = (sessionId: string, data: Partial<SiteSession>) => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    if (!raw) return;
    const list: SiteSession[] = JSON.parse(raw);
    const idx = list.findIndex((s) => s.sessionId === sessionId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
};

const saveLocalEvent = (event: SiteEvent) => {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const list: SiteEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(event);
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list.slice(0, 500)));
  } catch {
    // storage restricted
  }
};

export const getLocalSessions = (): SiteSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getLocalEvents = (): SiteEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Purges internal test data from local storage and attempts cleanup of Firestore records
 */
export const purgeInternalTestData = async (): Promise<{ sessionsPurged: number; eventsPurged: number }> => {
  let sessionsPurged = 0;
  let eventsPurged = 0;

  try {
    // 1. Clean local sessions
    const localSess = getLocalSessions();
    const keptSessions = localSess.filter((s) => !s.isInternal);
    sessionsPurged = localSess.length - keptSessions.length;
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(keptSessions));

    // 2. Clean local events
    const localEvts = getLocalEvents();
    const keptEvents = localEvts.filter((e) => !e.isInternal);
    eventsPurged = localEvts.length - keptEvents.length;
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(keptEvents));

    // 3. Firestore remote cleanup (batch of internal sessions & events)
    try {
      const sessQuery = query(collection(db, 'site_sessions'), where('isInternal', '==', true), limit(100));
      const evtQuery = query(collection(db, 'site_events'), where('isInternal', '==', true), limit(200));

      const [sessSnap, evtSnap] = await Promise.all([
        getDocs(sessQuery).catch(() => null),
        getDocs(evtQuery).catch(() => null),
      ]);

      if (sessSnap && !sessSnap.empty) {
        sessSnap.docs.forEach((d) => deleteDoc(d.ref).catch(() => {}));
      }

      if (evtSnap && !evtSnap.empty) {
        evtSnap.docs.forEach((d) => deleteDoc(d.ref).catch(() => {}));
      }
    } catch (e) {
      console.debug('Firestore internal purge notice:', e);
    }
  } catch (err) {
    console.warn('Error purging internal test data:', err);
  }

  return { sessionsPurged, eventsPurged };
};

// Seeding realistic demonstration data for immediate management visibility
export const seedSampleAnalyticsIfEmpty = () => {
  if (typeof window === 'undefined') return;
  const sessions = getLocalSessions();
  if (sessions.length > 0) return;

  const now = Date.now();
  const sampleReferrers = [
    'LinkedIn',
    'Direct / None',
    'Twitter / X',
    'Google Organic',
    'Skool Community',
    'Newsletter',
  ];
  const sampleDevices: Array<'desktop' | 'mobile' | 'tablet'> = ['desktop', 'desktop', 'mobile', 'desktop', 'tablet'];

  const generatedSessions: SiteSession[] = [];
  const generatedEvents: SiteEvent[] = [];

  for (let i = 0; i < 34; i++) {
    const timeOffset = (34 - i) * 45 * 60 * 1000 + Math.random() * 30000;
    const time = new Date(now - timeOffset).toISOString();
    const sId = `sess_seed_${i + 100}`;
    const vId = `vis_seed_${Math.floor(i / 1.8)}`;
    const ref = sampleReferrers[i % sampleReferrers.length];
    const dev = sampleDevices[i % sampleDevices.length];
    // Seed 4 test records so user can see internal vs prospect separation immediately
    const isInternal = i >= 30;

    generatedSessions.push({
      id: sId,
      sessionId: sId,
      visitorId: vId,
      isReturning: i % 3 === 0,
      referrer: isInternal ? 'Internal Dev' : ref,
      utmSource: ref.toLowerCase().includes('linkedin') ? 'linkedin' : ref.toLowerCase().includes('twitter') ? 'x' : '',
      utmMedium: 'social',
      utmCampaign: 'q1_cohort_scale',
      ref: i % 4 === 0 ? 'accelerator' : '',
      a: i % 2 === 0 ? 'leadership' : 'agency',
      deviceType: dev,
      path: '/',
      startedAt: time,
      lastActiveAt: time,
      pageViews: Math.floor(Math.random() * 3) + 1,
      isInternal,
      clientIp: isInternal ? '192.168.1.55' : undefined,
    });

    // Accompanying events
    generatedEvents.push({
      id: `evt_seed_pv_${i}`,
      sessionId: sId,
      visitorId: vId,
      eventType: 'page_view',
      eventCategory: 'discovery',
      label: 'Page View: Portalbuild · Bespoke Executive Portals',
      path: '/',
      timestamp: time,
      isInternal,
      clientIp: isInternal ? '192.168.1.55' : undefined,
    });

    if (i % 2 === 0) {
      generatedEvents.push({
        id: `evt_seed_demo_${i}`,
        sessionId: sId,
        visitorId: vId,
        eventType: 'demo_interaction',
        eventCategory: 'engagement',
        label: i % 3 === 0 ? 'Explored Harbourline Institute' : 'Explored The Growth Collective',
        path: '/',
        timestamp: new Date(new Date(time).getTime() + 45000).toISOString(),
        isInternal,
        clientIp: isInternal ? '192.168.1.55' : undefined,
      });
    }

    if (i % 3 === 0) {
      generatedEvents.push({
        id: `evt_seed_modal_${i}`,
        sessionId: sId,
        visitorId: vId,
        eventType: 'preview_modal_opened',
        eventCategory: 'intent',
        label: 'Preview Modal Opened via Hero CTA',
        path: '/',
        timestamp: new Date(new Date(time).getTime() + 90000).toISOString(),
        isInternal,
        clientIp: isInternal ? '192.168.1.55' : undefined,
      });
    }

    if (i % 6 === 0) {
      generatedEvents.push({
        id: `evt_seed_cal_${i}`,
        sessionId: sId,
        visitorId: vId,
        eventType: 'cal_fit_call_click',
        eventCategory: 'conversion',
        label: 'Cal.com 20-min Fit Call Clicked',
        path: '/',
        timestamp: new Date(new Date(time).getTime() + 140000).toISOString(),
        isInternal,
        clientIp: isInternal ? '192.168.1.55' : undefined,
      });
    }
  }

  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(generatedSessions));
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(generatedEvents));
};
