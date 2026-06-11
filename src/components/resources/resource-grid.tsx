"use client";

import { FileText, Send } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { Resource } from "@/content/resources";
import { type Locale, localizePath } from "@/lib/locale";

export function ResourceGrid({
  resources,
  locale
}: {
  resources: Resource[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <article key={resource.slug} className="surface flex h-full flex-col rounded-lg p-5">
          <FileText size={28} className="text-[var(--brand-red)]" />
          <h2 className="mt-4 text-xl font-extrabold text-[var(--brand-navy)]">
            {resource.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-6 text-[var(--brand-muted)]">
            {resource.description}
          </p>
          {resource.isAvailable && resource.fileUrl ? (
            <Link
              href={resource.fileUrl}
              onClick={() => trackEvent("resource_download", { resource: resource.slug })}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-4 py-2 text-sm font-extrabold text-white"
            >
              <FileText size={17} aria-hidden="true" />
              Download guide
            </Link>
          ) : (
            <Link
              href={localizePath(locale, `/contact?resource=${resource.slug}`)}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm font-extrabold text-[var(--brand-navy)]"
            >
              <Send size={17} aria-hidden="true" />
              Request this guide
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
