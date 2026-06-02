export const OPEN_MODAL_EVENT = 'open-application-modal';
export const OPEN_DEMO_MODAL_EVENT = 'open-demo-modal';
export const CLOSE_MODALS_EVENT = 'close-all-modals';
export const OPEN_ADMIN_EVENT = 'open-admin-dashboard';

export const openApplicationModal = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  window.dispatchEvent(new Event(OPEN_MODAL_EVENT));
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

