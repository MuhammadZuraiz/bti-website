"use client";

import { useSyncExternalStore } from "react";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
  writeConsent
} from "@/lib/consent";

// Rendered only when analytics is configured AND consent is required (decided in
// AnalyticsScripts). Shows until the visitor accepts or declines optional
// analytics. Declining still lets the visitor use the site fully.
export function ConsentBanner() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  if (consent !== "unset") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--brand-border)] bg-white p-4 shadow-[0_-12px_30px_rgba(23,20,72,0.12)]"
    >
      <div className="container-page flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-[var(--brand-ink)]">
          We use optional analytics cookies to understand how this website is used
          and improve it. You can decline and still use the site normally.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--brand-border)] px-4 text-sm font-bold text-[var(--brand-navy)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-red)] px-4 text-sm font-extrabold text-white hover:bg-[var(--brand-red-dark)]"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
