"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// No testimonials are fabricated. BTI supplies real, attributable quotes here;
// until then (and while showTestimonials is off) the section renders nothing.
const testimonials: Testimonial[] = [];

const AUTOPLAY_MS = 7000;

// Accessible quote carousel. Built and ready, but dormant: it returns null
// unless the feature flag is on AND real testimonials exist.
export function Testimonials() {
  const [active, setActive] = useState(0);
  const enabled =
    siteConfig.featureFlags.showTestimonials && testimonials.length > 0;
  const count = testimonials.length;

  useEffect(() => {
    if (!enabled || count < 2) {
      return;
    }
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      return;
    }
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % count),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(timer);
  }, [enabled, count]);

  if (!enabled) {
    return null;
  }

  const current = testimonials[active];

  return (
    <section className="bg-white py-16" aria-roledescription="carousel" aria-label="What learners say">
      <div className="container-page max-w-3xl text-center">
        <Quote
          size={36}
          className="mx-auto text-[var(--brand-red)]"
          aria-hidden="true"
        />
        <blockquote className="section-title mt-6 text-balance font-semibold">
          “{current.quote}”
        </blockquote>
        <p className="mt-6 font-bold text-[var(--brand-navy)]">{current.name}</p>
        <p className="helper-text">{current.role}</p>

        {count > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setActive((index) => (index - 1 + count) % count)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--brand-border)] text-[var(--brand-navy)] transition hover:border-[var(--brand-red)]"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === active
                      ? "bg-[var(--brand-red)]"
                      : "bg-[var(--brand-border)]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setActive((index) => (index + 1) % count)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--brand-border)] text-[var(--brand-navy)] transition hover:border-[var(--brand-red)]"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
