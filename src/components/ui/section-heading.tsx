type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left"
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-extrabold leading-tight text-[var(--brand-navy)] md:text-4xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-base leading-7 text-[var(--brand-muted)] md:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
