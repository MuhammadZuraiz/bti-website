export const analyticsEvents = [
  "course_card_click",
  "course_filter_use",
  "course_enquiry_submit",
  "general_enquiry_submit",
  "placement_test_request_submit",
  "corporate_enquiry_submit",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "resource_download",
  "language_switch",
  "map_directions_click"
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEvent,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
