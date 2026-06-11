"use client";

import {
  ChevronDown,
  Globe2,
  Menu,
  MessageCircle,
  Phone,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import type { dictionaries } from "@/content/i18n";
import { alternateLocale, localizePath, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/button-link";

type HeaderProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

function switchLocalePath(pathname: string, locale: Locale) {
  const nextLocale = alternateLocale(locale);
  const withoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  return localizePath(nextLocale, withoutLocale);
}

export function Header({ locale, dictionary }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const languageHref = useMemo(
    () => switchLocalePath(pathname, locale),
    [locale, pathname]
  );
  const nav = dictionary.nav;

  const mainLinks = [
    { href: localizePath(locale, "/placement-test"), label: nav.placement },
    { href: localizePath(locale, "/corporate-training"), label: nav.corporate },
    { href: localizePath(locale, "/about"), label: nav.about },
    { href: localizePath(locale, "/contact"), label: nav.contact }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link
          href={localizePath(locale)}
          className="flex min-w-0 items-center gap-3"
          aria-label={`${siteConfig.businessName} home`}
        >
          <Image
            src="/images/bti-logo.jpg"
            width={56}
            height={56}
            alt="British Training Institute crest logo"
            className="h-14 w-14 rounded-full border border-[var(--brand-border)] bg-white object-contain"
            priority
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-extrabold leading-tight text-[var(--brand-navy)]">
              {siteConfig.businessName}
            </span>
            <span className="block text-xs font-semibold text-[var(--brand-muted)]">
              {siteConfig.city} Training Centre
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <details className="nav-dropdown relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 rounded-lg px-3 text-sm font-bold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]">
              {nav.courses}
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="surface absolute inset-inline-start-0 top-12 grid w-[360px] gap-1 rounded-lg p-3">
              <Link
                href={localizePath(locale, "/courses")}
                className="rounded-md px-3 py-2 text-sm font-extrabold text-[var(--brand-red)] hover:bg-[var(--brand-soft)]"
              >
                View all programmes
              </Link>
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={localizePath(locale, `/courses/${course.slug}`)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--brand-ink)] hover:bg-[var(--brand-soft)]"
                >
                  {course.category}
                </Link>
              ))}
            </div>
          </details>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={languageHref}
            onClick={() => trackEvent("language_switch", { locale })}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--brand-border)] px-3 text-sm font-bold text-[var(--brand-navy)]"
          >
            <Globe2 size={17} aria-hidden="true" />
            {alternateLocale(locale).toUpperCase()}
          </Link>
          <ButtonLink href={localizePath(locale, "/contact")}>
            {nav.admissions}
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--brand-border)] text-[var(--brand-navy)] lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--brand-border)] bg-white lg:hidden">
          <nav
            className="container-page grid gap-2 py-4"
            aria-label="Mobile primary"
          >
            <Link
              href={localizePath(locale, "/courses")}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 font-extrabold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]"
            >
              {nav.courses}
            </Link>
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-extrabold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={languageHref}
                onClick={() => {
                  trackEvent("language_switch", { locale });
                  setOpen(false);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] text-sm font-bold text-[var(--brand-navy)]"
              >
                <Globe2 size={17} />
                {alternateLocale(locale).toUpperCase()}
              </Link>
              <Link
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                onClick={() => trackEvent("whatsapp_click", { placement: "mobile_menu" })}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-green)] text-sm font-bold text-white"
              >
                <MessageCircle size={17} />
                WhatsApp
              </Link>
            </div>
            <a
              href={siteConfig.landlineHref}
              onClick={() => trackEvent("phone_click", { placement: "mobile_menu" })}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] text-sm font-bold text-white"
            >
              <Phone size={17} />
              {siteConfig.landlineDisplay}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
