import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red-dark)] shadow-sm",
  secondary:
    "border border-[var(--brand-border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-red)]",
  dark:
    "bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-purple)]",
  ghost:
    "text-[var(--brand-navy)] hover:bg-[var(--brand-soft)] border border-transparent"
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
  onClick
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
