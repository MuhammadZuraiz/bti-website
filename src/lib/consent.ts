export const CONSENT_COOKIE = "bti_analytics_consent";
export const CONSENT_EVENT = "bti:consent-change";

export type ConsentState = "granted" | "denied" | "unset";

// Pure decision helpers (no DOM) — unit tested.

/** Analytics may load when configured and either consent isn't required or it was granted. */
export function shouldLoadAnalytics(input: {
  measurementId?: string;
  requireConsent: boolean;
  consent: ConsentState;
}): boolean {
  if (!input.measurementId) {
    return false;
  }
  if (!input.requireConsent) {
    return true;
  }
  return input.consent === "granted";
}

/** The banner shows only when analytics is configured, consent is required, and not yet decided. */
export function shouldShowConsentBanner(input: {
  measurementId?: string;
  requireConsent: boolean;
  consent: ConsentState;
}): boolean {
  return (
    Boolean(input.measurementId) &&
    input.requireConsent &&
    input.consent === "unset"
  );
}

// DOM helpers (browser only).

export function readConsent(): ConsentState {
  if (typeof document === "undefined") {
    return "unset";
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "granted" || value === "denied" ? value : "unset";
}

export function writeConsent(state: "granted" | "denied") {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  document.cookie = `${CONSENT_COOKIE}=${state}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

// useSyncExternalStore wiring so components read consent without setState-in-effect.
export function subscribeConsent(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

export function getConsentSnapshot(): ConsentState {
  return readConsent();
}

export function getServerConsentSnapshot(): ConsentState {
  return "unset";
}
