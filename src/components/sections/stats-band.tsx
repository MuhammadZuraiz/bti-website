"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { keyStats } from "@/content/institute";

// Split a stat like "10,000+" into its numeric target and trailing suffix so we
// can animate the number while preserving the "+", "K", etc.
function parseStat(value: string) {
  const match = value.match(/^([\d.,]+)(.*)$/);
  if (!match) {
    return { target: null as number | null, suffix: value };
  }
  const target = Number(match[1].replace(/,/g, ""));
  return {
    target: Number.isFinite(target) ? target : null,
    suffix: match[2]
  };
}

function CountUpStat({ value, label }: { value: string; label: string }) {
  const { target, suffix } = parseStat(value);
  // SSR / no-JS / reduced-motion all render the final value as-is.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (target === null || !node) {
      return;
    }
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      return;
    }

    // The first rAF frame renders ~0, so the count grows from zero on view
    // without an extra synchronous reset (which React flags in effect bodies).
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }
        observer.unobserve(node);

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          if (progress < 1) {
            setDisplay(`${current.toLocaleString("en-US")}${suffix}`);
            requestAnimationFrame(tick);
          } else {
            setDisplay(`${target.toLocaleString("en-US")}${suffix}`);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, suffix]);

  return (
    <div className="text-center">
      <p
        ref={ref}
        className="text-4xl font-black tracking-tight text-white tabular-nums md:text-5xl"
      >
        {display}
      </p>
      <p className="mt-2 text-sm font-semibold text-white/80">{label}</p>
    </div>
  );
}

// BTI-confirmed key statistics with a count-up on scroll. Rendered only when the
// showKeyStats flag is on.
export function StatsBand() {
  if (!siteConfig.featureFlags.showKeyStats) {
    return null;
  }

  return (
    <section className="band-dark py-14 text-white">
      <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {keyStats.map((stat) => (
          <CountUpStat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
