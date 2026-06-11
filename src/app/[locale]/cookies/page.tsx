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
    path: "/cookies",
    title: "Cookie Notice",
    description: "Cookie notice placeholder for British Training Institute."
  });
}

export default async function CookiesPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return (
    <section className="py-14">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Legal review required"
          title="Cookie Notice"
          intro="Analytics and advertising cookies should remain conditional until BTI approves the cookie policy and consent approach."
        />
        <div className="surface mt-8 rounded-lg p-6 leading-7 text-[var(--brand-muted)]">
          <p>
            The current implementation includes a safe analytics helper that
            does nothing unless analytics is configured. Add a consent banner if
            BTI enables non-essential tracking.
          </p>
        </div>
      </div>
    </section>
  );
}
