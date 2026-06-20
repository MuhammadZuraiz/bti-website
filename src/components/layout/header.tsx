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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { allDepartments, departmentHref } from "@/content/catalogue";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/button-link";
import { getAlternateEnabledLocale } from "@/lib/site-utils";

type HeaderProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

function switchLocalePath(pathname: string, locale: Locale) {
  const nextLocale = getAlternateEnabledLocale(locale);
  if (!nextLocale) {
    return "";
  }
  const withoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  return localizePath(nextLocale, withoutLocale);
}

export function Header({ locale, dictionary }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [menuPathname, setMenuPathname] = useState(pathname);

  // The homepage hero is dark, so the header floats transparent over it and
  // turns solid navy once scrolled. Every other page starts solid.
  const isHome = (pathname.replace(/^\/(en|ar)/, "") || "/") === "/";
  const solid = scrolled || open || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setOpen(false);
  }
  const alternateLocale = getAlternateEnabledLocale(locale);
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

  const closeMenu = useCallback(({ returnFocus = false } = {}) => {
    setOpen(false);
    if (returnFocus) {
      menuButtonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu({ returnFocus: true });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-white/10 bg-[var(--navy-900)]/95 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
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
            <span className="block text-sm font-extrabold leading-tight text-white">
              {siteConfig.businessName}
            </span>
            <span className="block text-xs font-semibold text-white/65">
              {siteConfig.city} Training Centre
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <details className="nav-dropdown relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 rounded-lg px-3 text-sm font-bold text-white/85 hover:bg-white/10 hover:text-white">
              {nav.courses}
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="surface absolute inset-inline-start-0 top-12 grid w-[360px] gap-1 rounded-lg p-3">
              <Link
                href={localizePath(locale, "/courses")}
                className="rounded-md px-3 py-2 text-sm font-extrabold text-[var(--brand-red)] hover:bg-[var(--brand-soft)]"
              >
                All departments &amp; courses
              </Link>
              {allDepartments.map((department) => (
                <Link
                  key={department.slug}
                  href={localizePath(locale, departmentHref(department))}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--brand-ink)] hover:bg-[var(--brand-soft)]"
                >
                  {department.name}
                </Link>
              ))}
            </div>
          </details>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {alternateLocale && languageHref ? (
            <Link
              href={languageHref}
              onClick={() => trackEvent("language_switch", { locale })}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-3 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              <Globe2 size={17} aria-hidden="true" />
              {alternateLocale.toUpperCase()}
            </Link>
          ) : null}
          <ButtonLink href={localizePath(locale, "/contact")}>
            {nav.admissions}
          </ButtonLink>
        </div>

        <button
          type="button"
          ref={menuButtonRef}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-primary-nav"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-white lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 top-20 z-40 border-t border-[var(--brand-border)] bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav
            id="mobile-primary-nav"
            className="container-page grid gap-2 py-4"
            aria-label="Mobile primary"
          >
            <Link
              href={localizePath(locale, "/courses")}
              onClick={() => closeMenu()}
              className="rounded-lg px-3 py-3 font-extrabold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]"
            >
              {nav.courses}
            </Link>
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => closeMenu()}
                className="rounded-lg px-3 py-3 font-extrabold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {alternateLocale && languageHref ? (
                <Link
                  href={languageHref}
                  onClick={() => {
                    trackEvent("language_switch", { locale });
                    closeMenu();
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] text-sm font-bold text-[var(--brand-navy)]"
                >
                  <Globe2 size={17} />
                  {alternateLocale.toUpperCase()}
                </Link>
              ) : null}
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
