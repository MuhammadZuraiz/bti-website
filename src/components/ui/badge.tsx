export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[rgba(181,31,54,0.18)] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand-red)]">
      {children}
    </span>
  );
}
