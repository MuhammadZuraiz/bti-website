import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/accessibility",
    title: "Accessibility Statement",
    description:
      "Accessibility statement for British Training Institute Sharjah website."
  });
}

export default async function AccessibilityPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return (
    <section className="py-14">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Accessibility"
          title="Accessibility Statement"
          intro="BTI should target WCAG AA accessibility for public admissions and training information."
        />
        <div className="surface mt-8 grid gap-4 rounded-lg p-6 leading-7 text-[var(--brand-muted)]">
          <p>
            The site includes semantic landmarks, skip-to-content navigation,
            visible focus states, labelled forms, accessible error messaging,
            reduced-motion support, and RTL-ready layout foundations.
          </p>
          <p>
            Final accessibility QA should include keyboard testing, screen
            reader spot checks, colour contrast checks, Arabic layout review and
            form submission testing.
          </p>
        </div>
      </div>
    </section>
  );
}
