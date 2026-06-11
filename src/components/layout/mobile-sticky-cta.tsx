"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { dictionaries } from "@/content/i18n";
import { trackEvent } from "@/lib/analytics";
import { localizePath, type Locale } from "@/lib/locale";

type Props = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

export function MobileStickyCta({ locale, dictionary }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--brand-border)] bg-white px-3 py-2 shadow-[0_-12px_30px_rgba(23,20,72,0.12)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href={siteConfig.landlineHref}
          onClick={() => trackEvent("phone_click", { placement: "sticky_mobile" })}
          className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-extrabold text-[var(--brand-navy)]"
        >
          <Phone size={18} aria-hidden="true" />
          {dictionary.common.call}
        </a>
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          onClick={() => trackEvent("whatsapp_click", { placement: "sticky_mobile" })}
          className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg bg-[var(--brand-green)] text-xs font-extrabold text-white"
        >
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          href={localizePath(locale, "/contact")}
          className="inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg bg-[var(--brand-red)] text-xs font-extrabold text-white"
        >
          <Send size={18} aria-hidden="true" />
          {dictionary.common.enquire}
        </Link>
      </div>
    </div>
  );
}
