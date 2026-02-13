// Google Analytics tracking
// Add your Google Analytics tracking ID here

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
