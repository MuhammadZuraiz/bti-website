"use client";

import { FileText, Send } from "lucide-react";
import Link from "next/link";
import { ContextLink } from "@/components/conversion/context-link";
import { trackEvent } from "@/lib/analytics";
import type { Resource } from "@/content/resources";
import { type Locale, localizePath } from "@/lib/locale";
import { isResourcePublished } from "@/lib/site-utils";

export function ResourceGrid({
  resources,
  locale
}: {
  resources: Resource[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource, index) => (
        <article
          key={resource.slug}
          className={`${index === 0 ? "featured-card md:col-span-2 xl:col-span-1" : "compact-card"} flex h-full flex-col rounded-lg p-5`}
        >
          <div className={`${index === 0 ? "bg-[var(--brand-navy)] text-white" : "bg-[var(--brand-soft)] text-[var(--brand-red)]"} grid h-24 place-items-center rounded-lg`}>
            <FileText size={30} aria-hidden="true" />
          </div>
          <h2 className="card-title mt-4">
            {resource.title}
          </h2>
          <p className="helper-text mt-3 flex-1">
            {resource.description}
          </p>
          {isResourcePublished(resource) ? (
            <Link
              href={resource.fileUrl as string}
              onClick={() => trackEvent("resource_download", { resource: resource.slug })}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-purple)]"
            >
              <FileText size={17} aria-hidden="true" />
              Download guide
            </Link>
          ) : (
            <ContextLink
              href={localizePath(locale, `/contact?resource=${resource.slug}`)}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-red)]"
            >
              <Send size={17} aria-hidden="true" />
              Request this guide from admissions
            </ContextLink>
          )}
        </article>
      ))}
    </div>
  );
}
