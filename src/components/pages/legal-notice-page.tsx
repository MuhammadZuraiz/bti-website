import { SectionHeading } from "@/components/ui/section-heading";
import type { LegalPageContent } from "@/content/legal";
import type { LegalPageKey } from "@/lib/site-utils";
import { isLegalPagePublished } from "@/lib/site-utils";

export function LegalNoticePage({
  pageKey,
  content
}: {
  pageKey: LegalPageKey;
  content: LegalPageContent;
}) {
  if (!isLegalPagePublished(pageKey)) {
    return (
      <section className="py-14">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={`${content.title} is being prepared`}
            intro="This information is not published yet. Contact BTI admissions if you need help with an enquiry."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          intro={content.description}
        />
        <div className="surface mt-8 grid gap-6 rounded-lg p-6 leading-7 text-[var(--brand-muted)]">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">
                {section.heading}
              </h2>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
