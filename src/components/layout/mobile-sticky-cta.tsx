"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import type { dictionaries } from "@/content/i18n";
import { trackEvent } from "@/lib/analytics";
import { localizePath, type Locale } from "@/lib/locale";

type Props = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

export function MobileStickyCta({ locale, dictionary }: Props) {
  const pathname = usePathname() ?? "";
  const route = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const isHiddenRoute = [
    "/contact",
    "/placement-test",
    "/corporate-training",
    "/accessibility",
    "/privacy",
    "/cookies",
    "/terms"
  ].includes(route);
  const isCourseDetail = /^\/courses\/[^/]+$/.test(route);
  const mode: "hidden" | "compact" | "full" = isHiddenRoute
    ? "hidden"
    : isCourseDetail
      ? "compact"
      : "full";

  useEffect(() => {
    const offset =
      mode === "hidden"
        ? "0px"
        : mode === "compact"
          ? "calc(58px + env(safe-area-inset-bottom))"
          : "calc(64px + env(safe-area-inset-bottom))";
    document.documentElement.style.setProperty("--mobile-sticky-offset", offset);

    return () => {
      document.documentElement.style.removeProperty("--mobile-sticky-offset");
    };
  }, [mode]);

  if (mode === "hidden") {
    return null;
  }

  if (mode === "compact") {
    return (
      <div className="mobile-sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-[var(--brand-border)] bg-white/96 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_24px_rgba(23,20,72,0.1)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-2">
          <a
            href={siteConfig.landlineHref}
            onClick={() => trackEvent("phone_click", { placement: "sticky_mobile_compact" })}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] text-xs font-semibold text-[var(--brand-navy)]"
          >
            <Phone size={16} aria-hidden="true" />
            {dictionary.common.call}
          </a>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            onClick={() => trackEvent("whatsapp_click", { placement: "sticky_mobile_compact" })}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand-green)] text-xs font-semibold text-white"
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-[var(--brand-border)] bg-white/96 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_24px_rgba(23,20,72,0.1)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href={siteConfig.landlineHref}
          onClick={() => trackEvent("phone_click", { placement: "sticky_mobile" })}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-[var(--brand-navy)]"
        >
          <Phone size={16} aria-hidden="true" />
          {dictionary.common.call}
        </a>
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          onClick={() => trackEvent("whatsapp_click", { placement: "sticky_mobile" })}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand-green)] text-xs font-semibold text-white"
        >
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          href={localizePath(locale, "/contact")}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand-red)] text-xs font-semibold text-white"
        >
          <Send size={16} aria-hidden="true" />
          {dictionary.common.enquire}
        </Link>
      </div>
    </div>
  );
}
