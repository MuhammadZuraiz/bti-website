import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--brand-soft)] px-6 text-center">
      <div className="surface max-w-lg rounded-lg p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
          Page not found
        </p>
        <h1 className="mt-4 text-4xl font-black text-[var(--brand-navy)]">
          This page is not available.
        </h1>
        <p className="mt-3 leading-7 text-[var(--brand-muted)]">
          Return to the BTI homepage or browse the course catalogue.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-red)] px-4 py-2 text-sm font-extrabold text-white"
          >
            Home
          </Link>
          <Link
            href="/en/courses"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-extrabold text-[var(--brand-navy)]"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
