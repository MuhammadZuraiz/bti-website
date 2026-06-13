"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { hasValidBusinessEmail, hasValidMapUrl } from "@/lib/site-utils";

export function ContactActions() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <a
        href={siteConfig.landlineHref}
        onClick={() => trackEvent("phone_click", { placement: "contact_actions" })}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-4 py-2 text-sm font-semibold text-white"
      >
        <Phone size={18} aria-hidden="true" />
        Call {siteConfig.landlineDisplay}
      </a>
      <a
        href={`https://wa.me/${siteConfig.whatsappNumber}`}
        onClick={() => trackEvent("whatsapp_click", { placement: "contact_actions" })}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]"
      >
        <MessageCircle size={18} aria-hidden="true" />
        WhatsApp BTI
      </a>
      {hasValidBusinessEmail() ? (
        <a
          href={`mailto:${siteConfig.email}`}
          onClick={() => trackEvent("email_click", { placement: "contact_actions" })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]"
        >
          <Mail size={18} aria-hidden="true" />
          Email Admissions
        </a>
      ) : null}
      {hasValidMapUrl() ? (
        <a
          href={siteConfig.mapUrl}
          onClick={() => trackEvent("map_directions_click", { placement: "contact_actions" })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]"
        >
          <MapPin size={18} aria-hidden="true" />
          Directions
        </a>
      ) : null}
    </div>
  );
}
