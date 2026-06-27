"use client";

import { useEffect, useRef, useState } from "react";

type ParsedStat = {
  prefix: string;
  suffix: string;
  target: number;
};

// Splits a display value like "10,000+" into { prefix:"", target:10000, suffix:"+" }.
// Returns null for anything that is not a (optionally affixed) number so the
// caller can fall back to rendering the raw string.
function parseStat(value: string): ParsedStat | null {
  const match = value.match(/^(\D*)([\d,]+)(\D*)$/);
  if (!match) {
    return null;
  }
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) {
    return null;
  }
  return { prefix, suffix, target };
}

function format(value: number, { prefix, suffix }: ParsedStat): string {
  return `${prefix}${Math.round(value).toLocaleString("en-US")}${suffix}`;
}

const DURATION_MS = 1300;

// Counts up to the stat value the first time it scrolls into view. The final
// value is server-rendered (good for no-JS and SEO); JS only animates it.
export function StatCounter({ value }: { value: string }) {
  const parsed = parseStat(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !parsed) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(format(parsed.target * eased, parsed));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // parsed is derived from `value`; depend on the stable string instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
