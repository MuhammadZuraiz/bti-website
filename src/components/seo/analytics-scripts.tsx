import { siteConfig } from "@/config/site";
import { AnalyticsLoader } from "@/components/consent/analytics-loader";
import { ConsentBanner } from "@/components/consent/consent-banner";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Analytics + consent entry point.
 * - No measurement ID (the default) → renders nothing; no third-party request.
 * - ID set, requireCookieConsent false → analytics loads (anonymised IP), no banner.
 * - ID set, requireCookieConsent true → banner shown; analytics loads only after consent.
 *
 * Keep NEXT_PUBLIC_GA_MEASUREMENT_ID unset until BTI approves analytics and the
 * cookie-consent approach — see docs/analytics-events.md.
 */
export function AnalyticsScripts() {
  if (!measurementId) {
    return null;
  }

  const requireConsent = siteConfig.featureFlags.requireCookieConsent;

  return (
    <>
      <AnalyticsLoader measurementId={measurementId} requireConsent={requireConsent} />
      {requireConsent ? <ConsentBanner /> : null}
    </>
  );
}
