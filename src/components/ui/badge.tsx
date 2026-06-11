export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--brand-border)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand-muted)]">
      {children}
    </span>
  );
}
