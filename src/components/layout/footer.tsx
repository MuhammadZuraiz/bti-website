import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { courseCategories } from "@/content/courses";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";
import {
  getAlternateEnabledLocale,
  getPublishedLegalPages,
  hasValidBusinessEmail,
  hasValidSocialUrl
} from "@/lib/site-utils";

type FooterProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

export function Footer({ locale, dictionary }: FooterProps) {
  const legalLinks = [
    ["privacy", "Privacy", "/privacy"],
    ["cookies", "Cookies", "/cookies"],
    ["terms", "Terms", "/terms"],
    ["accessibility", "Accessibility", "/accessibility"]
  ] as const;
  const publishedLegalPages = getPublishedLegalPages();
  const alternateLocale = getAlternateEnabledLocale(locale);
  const socialLinks = [
    ["Instagram", siteConfig.socialLinks.instagram],
    ["Facebook", siteConfig.socialLinks.facebook],
    ["LinkedIn", siteConfig.socialLinks.linkedin]
  ] as const;

  const usefulLinks = [
    [dictionary.nav.courses, "/courses"],
    [dictionary.nav.placement, "/placement-test"],
    [dictionary.nav.corporate, "/corporate-training"],
    [dictionary.nav.about, "/about"],
    [dictionary.nav.contact, "/contact"],
    ["FAQ", "/faq"],
    ["Resources", "/resources"]
  ] as const;
  const hasHelpfulLinks =
    Boolean(publishedLegalPages.length || alternateLocale) ||
    socialLinks.some(([, url]) => hasValidSocialUrl(url));

  return (
    <footer className="section-navy border-t border-[var(--brand-border)] text-white">
      <div className="container-page py-5 md:hidden">
        <div className="flex items-center gap-3">
          <Image
            src="/images/bti-logo.jpg"
            width={48}
            height={48}
            alt="British Training Institute crest logo"
            className="h-11 w-11 rounded-full bg-white object-contain"
          />
          <div>
            <p className="text-sm font-semibold leading-tight">
              {siteConfig.businessName}
            </p>
            <p className="text-xs leading-5 text-white/66">
              {siteConfig.city}-based training centre
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-white/72">
          Speak with admissions to find a suitable starting point.
        </p>

        <div className="mt-4 grid gap-2 text-sm text-white/82">
          <p className="flex gap-2 leading-5">
            <MapPin size={17} className="mt-0.5 shrink-0" />
            <span>{siteConfig.address}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] px-3 text-sm font-semibold hover:text-white"
              href={siteConfig.landlineHref}
            >
              <Phone size={17} aria-hidden="true" />
              {siteConfig.landlineDisplay}
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] px-3 text-sm font-semibold hover:text-white"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
          {hasValidBusinessEmail() ? (
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm hover:text-white"
              href={`mailto:${siteConfig.email}`}
            >
              <Mail size={17} aria-hidden="true" />
              {siteConfig.email}
            </a>
          ) : null}
        </div>

        <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
          <details className="footer-mobile-details">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/66">
              Course Areas
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="footer-mobile-chevron shrink-0 transition"
              />
            </summary>
            <ul className="grid gap-1.5 pb-3 text-sm leading-5 text-white/78">
              {courseCategories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </details>

          <details className="footer-mobile-details">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/66">
              Useful Links
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="footer-mobile-chevron shrink-0 transition"
              />
            </summary>
            <ul className="grid gap-1.5 pb-3 text-sm leading-5 text-white/78">
              {usefulLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={localizePath(locale, href)}
                    className="inline-flex min-h-8 items-center transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {hasHelpfulLinks ? (
            <details className="footer-mobile-details">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/66">
                Helpful Information
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="footer-mobile-chevron shrink-0 transition"
                />
              </summary>
              <div className="grid gap-3 pb-3">
                {publishedLegalPages.length || alternateLocale ? (
                  <ul className="grid gap-1.5 text-sm leading-5 text-white/78">
                    {legalLinks
                      .filter(([key]) => publishedLegalPages.includes(key))
                      .map(([, label, href]) => (
                        <li key={href}>
                          <Link
                            href={localizePath(locale, href)}
                            className="inline-flex min-h-8 items-center transition-colors hover:text-white"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    {alternateLocale ? (
                      <li>
                        <Link
                          href={localizePath(alternateLocale)}
                          className="inline-flex min-h-8 items-center transition-colors hover:text-white"
                        >
                          {alternateLocale.toUpperCase()}
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {socialLinks.some(([, url]) => hasValidSocialUrl(url)) ? (
                  <div className="flex gap-2">
                    {socialLinks.map(([label, url]) =>
                      hasValidSocialUrl(url) ? (
                        <a
                          key={label}
                          href={url}
                          aria-label={label}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white/78 transition-colors hover:text-white"
                        >
                          <ExternalLink size={17} aria-hidden="true" />
                        </a>
                      ) : null
                    )}
                  </div>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>
      </div>

      <div className="container-page hidden gap-8 py-9 md:grid md:py-10 lg:grid-cols-[1.25fr_0.9fr_0.9fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/bti-logo.jpg"
              width={56}
              height={56}
              alt="British Training Institute crest logo"
              className="h-12 w-12 rounded-full bg-white object-contain"
            />
            <div>
              <p className="font-semibold">{siteConfig.businessName}</p>
              <p className="text-sm text-white/68">
                {siteConfig.city}-based training centre
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
            Explore English, IELTS preparation, business, accounting, HR and
            professional training options. Speak with admissions to find a
            suitable starting point.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-white/82">
            <p className="flex gap-2 leading-6">
              <MapPin size={17} className="mt-0.5 shrink-0" />
              <span>{siteConfig.address}</span>
            </p>
            <a
              className="flex gap-2 hover:text-white"
              href={siteConfig.landlineHref}
            >
              <Phone size={17} /> {siteConfig.landlineDisplay}
            </a>
            <a
              className="flex gap-2 hover:text-white"
              href={siteConfig.mobileHref}
            >
              <Phone size={18} /> {siteConfig.mobileDisplay}
            </a>
            <a
              className="flex gap-2 hover:text-white"
              href={siteConfig.tollFreeHref}
            >
              <Phone size={18} /> Toll-free {siteConfig.tollFreeDisplay}
            </a>
            <a
              className="flex gap-2 hover:text-white"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
            >
              <MessageCircle size={18} /> WhatsApp BTI
            </a>
            {hasValidBusinessEmail() ? (
              <a className="flex gap-2 hover:text-white" href={`mailto:${siteConfig.email}`}>
                <Mail size={17} /> {siteConfig.email}
              </a>
            ) : null}
          </div>
          {siteConfig.openingHours.length ? (
            <div className="mt-4 text-sm text-white/72">
              <p className="font-semibold text-white/82">Opening hours</p>
              {siteConfig.openingHours.map((line) => (
                <p key={line} className="leading-6">{line}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/62">
            Course Areas
          </h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/78">
            {courseCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/62">
            Useful Links
          </h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/78">
            {usefulLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={localizePath(locale, href)} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {publishedLegalPages.length || alternateLocale ? (
            <>
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/62">
                Helpful Information
              </h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/78">
                {legalLinks
                  .filter(([key]) => publishedLegalPages.includes(key))
                  .map(([, label, href]) => (
                    <li key={href}>
                      <Link href={localizePath(locale, href)} className="transition-colors hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                {alternateLocale ? (
                  <li>
                    <Link
                      href={localizePath(alternateLocale)}
                      className="transition-colors hover:text-white"
                    >
                      {alternateLocale.toUpperCase()}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </>
          ) : null}
          {socialLinks.some(([, url]) => hasValidSocialUrl(url)) ? (
            <div className="mt-5 flex gap-2">
              {socialLinks.map(([label, url]) =>
                hasValidSocialUrl(url) ? (
                  <a
                    key={label}
                    href={url}
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/78 transition-colors hover:text-white"
                  >
                    <ExternalLink size={17} aria-hidden="true" />
                  </a>
                ) : null
              )}
            </div>
          ) : null}
          <div className="mt-5 rounded-lg border border-white/12 bg-white/[0.06] p-3 text-sm leading-6 text-white/72">
            <p className="font-semibold text-white">{siteConfig.businessName}</p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.landlineDisplay}</p>
            {hasValidBusinessEmail() ? <p>{siteConfig.email}</p> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-3 text-xs leading-5 text-white/58 md:flex-row md:items-center md:justify-between md:py-4">
          <p>
            Copyright {new Date().getFullYear()} {siteConfig.businessName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
