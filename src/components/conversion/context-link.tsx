"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const preservedParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];

export function ContextLink({
  href,
  className,
  children,
  onClick,
  ariaLabel
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const [nextHref, setNextHref] = useState(href);

  useEffect(() => {
    const [path, queryString = ""] = href.split("?");
    const params = new URLSearchParams(queryString);
    const currentParams = new URLSearchParams(window.location.search);

    preservedParams.forEach((key) => {
      const value = currentParams.get(key);
      if (value && !params.has(key)) {
        params.set(key, value);
      }
    });

    setNextHref(params.size ? `${path}?${params.toString()}` : path);
  }, [href]);

  return (
    <Link
      href={nextHref}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
