type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** Use "h1" when this heading is the page title. */
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Heading = "h2"
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p className="eyebrow mb-3">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={`text-balance ${Heading === "h1" ? "page-title" : "section-title"}`}
      >
        {title}
      </Heading>
      {intro ? (
        <p className="body-large mt-4">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
