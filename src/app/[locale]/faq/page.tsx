import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/lib/locale";
import { faqSchema } from "@/lib/schema";
import { localizedMetadata } from "@/lib/metadata";

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
      "Contact admissions for current fee details. Fees are not published here until BTI approves exact values."
  },
  {
    question: "Where is BTI located in Sharjah?",
    answer: `${siteConfig.businessName} is configured at ${siteConfig.address}. Confirm directions before visiting.`
  }
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
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
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <section className="py-14">
        <div className="container-page grid gap-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Useful answers before you enquire."
            intro="These answers are intentionally careful. Admissions should confirm current schedules, fees, and availability."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <article key={item.question} className="surface rounded-lg p-5">
                <h2 className="text-lg font-extrabold text-[var(--brand-navy)]">{item.question}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
