"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  shouldLoadAnalytics,
  subscribeConsent
} from "@/lib/consent";

// Loads Google Analytics respecting the consent decision. When consent is not
// required this loads immediately; when required it loads only after the visitor
// grants consent (and reacts to the banner without a page reload).
export function AnalyticsLoader({
  measurementId,
  requireConsent
}: {
  measurementId: string;
  requireConsent: boolean;
}) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  if (!shouldLoadAnalytics({ measurementId, requireConsent, consent })) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
