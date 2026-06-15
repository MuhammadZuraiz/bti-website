import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-[linear-gradient(180deg,#c5293f,var(--brand-red-dark))] text-white shadow-[var(--shadow-red)] hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(181,31,54,0.34)] active:translate-y-0",
  secondary:
    "border border-[var(--brand-border)] bg-white text-[var(--brand-navy)] shadow-[var(--shadow-sm)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-soft)]",
  dark:
    "bg-[var(--brand-navy)] text-white shadow-[var(--shadow-sm)] hover:-translate-y-px hover:bg-[var(--brand-purple)] active:translate-y-0",
  ghost:
    "border border-transparent text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]",
  outline:
    "border border-[var(--brand-border)] bg-transparent text-[var(--brand-navy)] hover:border-[var(--brand-red)] hover:bg-white",
  text:
    "border border-transparent px-1 text-[var(--brand-red)] hover:text-[var(--brand-red-dark)]"
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
