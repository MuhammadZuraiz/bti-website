import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { courseCategories } from "@/content/courses";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type FooterProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

export function Footer({ locale, dictionary }: FooterProps) {
  const legalLinks = [
    ["Privacy", "/privacy"],
    ["Cookies", "/cookies"],
    ["Terms", "/terms"],
    ["Accessibility", "/accessibility"]
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

  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-navy)] text-white">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/bti-logo.jpg"
              width={68}
              height={68}
              alt="British Training Institute crest logo"
              className="h-16 w-16 rounded-full bg-white object-contain"
            />
            <div>
              <p className="font-extrabold">{siteConfig.businessName}</p>
              <p className="text-sm text-white/72">
                {siteConfig.city}-based training centre
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Explore English, IELTS preparation, business, accounting, HR and
            professional training options. Speak with admissions to find a
            suitable starting point.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-white/85">
            <p className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <span>{siteConfig.address}</span>
            </p>
            <a
              className="flex gap-2 hover:text-white"
              href={siteConfig.landlineHref}
            >
              <Phone size={18} /> {siteConfig.landlineDisplay}
            </a>
            <a
              className="flex gap-2 hover:text-white"
              href={siteConfig.mobileHref}
            >
              <MessageCircle size={18} /> {siteConfig.mobileDisplay}
            </a>
            <a className="flex gap-2 hover:text-white" href={`mailto:${siteConfig.email}`}>
              <Mail size={18} /> {siteConfig.email}
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
            Course Areas
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-white/82">
            {courseCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
            Useful Links
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-white/82">
            {usefulLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={localizePath(locale, href)} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
            Legal & Local SEO
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-white/82">
            {legalLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={localizePath(locale, href)} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg border border-white/15 bg-white/8 p-4 text-sm leading-6 text-white/78">
            <p className="font-bold text-white">{siteConfig.businessName}</p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.landlineDisplay}</p>
            <p>{siteConfig.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            Copyright {new Date().getFullYear()} {siteConfig.businessName}. All
            rights reserved.
          </p>
          <p>{dictionary.common.professionalReview}</p>
        </div>
      </div>
    </footer>
  );
}
