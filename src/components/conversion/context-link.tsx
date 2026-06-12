"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, type ReactNode } from "react";

const preservedParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];

const subscribeToNothing = () => () => {};

function useCurrentSearch() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => ""
  );
}

function withPreservedParams(href: string, currentSearch: string) {
  const [path, queryString = ""] = href.split("?");
  const params = new URLSearchParams(queryString);
  const currentParams = new URLSearchParams(currentSearch);

  preservedParams.forEach((key) => {
    const value = currentParams.get(key);
    if (value && !params.has(key)) {
      params.set(key, value);
    }
  });

  return params.size ? `${path}?${params.toString()}` : path;
}

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
  const currentSearch = useCurrentSearch();
  const nextHref = useMemo(
    () => withPreservedParams(href, currentSearch),
    [href, currentSearch]
  );

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
