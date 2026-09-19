export const OPEN_MODAL_EVENT = 'open-application-modal';
export const OPEN_DEMO_MODAL_EVENT = 'open-demo-modal';
export const CLOSE_MODALS_EVENT = 'close-all-modals';
export const OPEN_ADMIN_EVENT = 'open-admin-dashboard';

export const PRIMARY_CTA_INTERACTED_KEY = 'portalbuild_primary_cta_interacted';
export const EXIT_INTENT_TRIGGERED_KEY = 'portalbuild_exit_intent_triggered';

export const markPrimaryCTAInteracted = () => {
  try {
    sessionStorage.setItem(PRIMARY_CTA_INTERACTED_KEY, 'true');
  } catch {
    // SessionStorage may be restricted in sandboxed iframes
  }
};

export const hasInteractedWithPrimaryCTA = (): boolean => {
  try {
    return sessionStorage.getItem(PRIMARY_CTA_INTERACTED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markExitIntentTriggered = () => {
  try {
    sessionStorage.setItem(EXIT_INTENT_TRIGGERED_KEY, 'true');
  } catch {
    // SessionStorage may be restricted
  }
};

export const hasExitIntentTriggered = (): boolean => {
  try {
    return sessionStorage.getItem(EXIT_INTENT_TRIGGERED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const openApplicationModal = (e?: React.MouseEvent | React.SyntheticEvent | Event) => {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  markPrimaryCTAInteracted();

  // Try direct function invocation if ApplicationForm is mounted
  if (typeof window !== 'undefined' && typeof (window as any).__openPortalApplicationModal === 'function') {
    (window as any).__openPortalApplicationModal();
  }

  // Dispatch standard and custom window events
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(OPEN_MODAL_EVENT));
    } catch {
      window.dispatchEvent(new Event(OPEN_MODAL_EVENT));
    }
  }
};

export const openDemoModal = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  window.dispatchEvent(new Event(OPEN_DEMO_MODAL_EVENT));
};

export const closeAllModals = () => {
  window.dispatchEvent(new Event(CLOSE_MODALS_EVENT));
};

export const openAdminDashboard = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  window.dispatchEvent(new Event(OPEN_ADMIN_EVENT));
};


