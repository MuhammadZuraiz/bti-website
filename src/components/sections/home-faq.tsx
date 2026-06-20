"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { homeFaq } from "@/content/home-faq";
import { localizePath, type Locale } from "@/lib/locale";

type HomeFaqProps = {
  locale: Locale;
  title: string;
  viewAllLabel: string;
};

// Single-open accordion fed by the shared homeFaq source (which also powers the
// faqSchema JSON-LD on the page). Each trigger wires aria-expanded/aria-controls.
export function HomeFaq({ locale, title, viewAllLabel }: HomeFaqProps) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="py-16">
      <div className="container-page max-w-3xl">
        <h2 className="section-title text-balance">{title}</h2>

        <div className="mt-8 grid gap-3">
          {homeFaq.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-bold text-[var(--brand-navy)] transition hover:bg-[var(--brand-soft)]"
                  >
                    {item.question}
                    <Plus
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 text-[var(--brand-red)] transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-5"
                  >
                    <p className="supporting-copy">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <Link
          href={localizePath(locale, "/faq")}
          className="mt-6 inline-flex text-sm font-extrabold text-[var(--brand-red)] hover:text-[var(--brand-red-dark)]"
        >
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
