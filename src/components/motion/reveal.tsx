"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Element tag to render as. Defaults to a <div>. */
  as?: ElementType;
  /** Stagger delay (ms) before the reveal transition runs. */
  delay?: number;
  className?: string;
  // Any extra props (e.g. href when `as={Link}`) are forwarded to the element.
} & Record<string, unknown>;

// Fades + slides its children up the first time they scroll into view. The base
// `.reveal` styles (and a reduced-motion / no-JS guard) live in globals.css;
// this component only toggles `.is-visible`. Content is server-rendered inside
// `.reveal` (hidden by CSS), so there is no layout shift — JS just reveals it.
export function Reveal({
  children,
  as,
  delay = 0,
  className = "",
  ...rest
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    // Reduced motion: the CSS guard in globals.css already keeps `.reveal`
    // content fully visible, so skip the observer entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      {...rest}
      ref={ref}
      className={["reveal", visible ? "is-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
