type AnalyticsCommand =
  | ['js', Date]
  | ['config', string, { send_page_view: false }]
  | ['event', string, Record<string, string | number>];

declare global {
  interface Window {
    dataLayer?: AnalyticsCommand[];
    gtag?: (...args: AnalyticsCommand) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
let analyticsInitialized = false;
let lastPageViewPath: string | null = null;

function getGtag(): NonNullable<Window['gtag']> {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];

    window.gtag = function (...args) {
      window.dataLayer?.push(arguments as unknown as AnalyticsCommand);
    };
  }

  return window.gtag;
}

export function initializeAnalytics(): void {
  if (!measurementId) {
    console.warn('Google Analytics is not configured. Set VITE_GA_MEASUREMENT_ID to enable it.');
    return;
  }

  const gtag = getGtag();

  if (!analyticsInitialized) {
    analyticsInitialized = true;
    gtag('js', new Date());
    gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onerror = () => {
      console.error('Unable to load Google Analytics.');
    };
    document.head.append(script);
  }

  trackPageView();
}

export function trackPageView(): void {
  if (!analyticsInitialized || !window.gtag) return;

  const path = window.location.pathname;
  if (path === lastPageViewPath) return;

  lastPageViewPath = path;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackAnalyticsEvent(
  eventName: 'qr_code_generated' | 'qr_code_downloaded',
  parameters: { qr_type: string; qr_size: number },
): void {
  if (!analyticsInitialized || !window.gtag) return;

  window.gtag('event', eventName, parameters);
}
