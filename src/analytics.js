const eventName = "mid-south-analytics";

export function initializeAnalytics() {
  const containerId = import.meta.env.VITE_GTM_ID?.trim();
  if (!/^GTM-[A-Z0-9]+$/.test(containerId || "")) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}

export function trackEvent(name, parameters = {}) {
  const detail = {
    event: name,
    page_path: `${window.location.pathname}${window.location.search}`,
    ...parameters,
  };

  window.dispatchEvent(new CustomEvent(eventName, { detail }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(detail);
  }
}

export function trackPageView(path) {
  trackEvent("page_view", { page_path: path });
}

export const analyticsEventName = eventName;
