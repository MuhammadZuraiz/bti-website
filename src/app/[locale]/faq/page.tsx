import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { faqSchema } from "@/lib/schema";
import { localizedMetadata } from "@/lib/metadata";
import { isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string }>;

const faq = [
  {
    question: "Which course should I choose?",
    answer:
      "Tell admissions your learning goal, current level, and preferred timing. They can help you compare current options."
  },
  {
    question: "How can I ask about schedules?",
    answer:
      "Use the enquiry form, call BTI, or send a WhatsApp message for the latest schedule and availability."
  },
  {
    question: "Can I request a placement test?",
    answer:
      "Yes. Use the placement-test request page. BTI will confirm the next step after reviewing your request."
  },
  {
    question: "Are corporate training options available?",
    answer:
      "Yes. Organisations can request a training conversation based on team needs, learner numbers, and delivery mode."
  },
  {
    question: "How do I enquire about course fees?",
    answer:
      "Contact admissions for current fee details and available payment options."
  },
  {
    question: "Where is BTI located in Sharjah?",
    answer: `${siteConfig.businessName} is located in ${siteConfig.area}, ${siteConfig.city}. Confirm directions before visiting.`
  }
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/faq",
    title: "BTI Course Enquiry FAQ",
    description:
      "Find answers about BTI course choice, schedules, placement-test requests, corporate training and fee enquiries."
  });
}

export default async function FaqPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <section className="py-14">
        <div className="container-page grid gap-8">
          <SectionHeading
            as="h1"
            eyebrow="FAQ"
            title="Useful answers before you enquire."
            intro="Find quick answers about course choice, schedules, placement-test guidance, corporate training and fee enquiries."
          />
          <div className="split-panel grid gap-6 rounded-lg p-5 md:p-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Common questions</p>
              <h2 className="section-title mt-3">Scan the essentials, then ask admissions for current details.</h2>
            </div>
            <div className="grid gap-1">
            {faq.map((item) => (
              <article key={item.question} className="text-row first:border-t-0">
                <h3 className="card-title">{item.question}</h3>
                <p className="helper-text mt-2">{item.answer}</p>
              </article>
            ))}
            </div>
          </div>
          <div className="muted-panel grid gap-4 rounded-lg p-5 md:grid-cols-[1fr_auto] md:items-center">
            <p className="supporting-copy">
              Tell admissions your learning goal, current level, and preferred timing.
            </p>
            <ButtonLink href={localizePath(locale, "/contact")}>
              Speak to Admissions
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
