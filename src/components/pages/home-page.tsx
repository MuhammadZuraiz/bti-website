import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Landmark,
  Laptop,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { courses, featuredCourses } from "@/content/courses";
import { resources } from "@/content/resources";
import type { dictionaries } from "@/content/i18n";
import { getTrustItems } from "@/lib/trust";
import { localizePath, type Locale } from "@/lib/locale";
import {
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema
} from "@/lib/schema";

type HomePageProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

const categoryIcons: LucideIcon[] = [
  BookOpen,
  ClipboardCheck,
  BriefcaseBusiness,
  Calculator,
  Users,
  Landmark,
  Laptop,
  GraduationCap
];

const heroCards: { label: string; icon: LucideIcon }[] = [
  { label: "Course clarity", icon: BookOpen },
  { label: "Placement support", icon: ClipboardCheck },
  { label: "Corporate enquiries", icon: Building2 },
  { label: "CRM-ready forms", icon: ShieldCheck }
];

const homeFaq = [
  {
    question: "Which course should I choose?",
    answer:
      "Start with your goal and current level. Admissions can help you compare suitable options before you enrol."
  },
  {
    question: "How can I ask about schedules?",
    answer:
      "Use the enquiry form, phone, or WhatsApp to ask admissions for the latest schedule and availability."
  },
  {
    question: "Can I request a placement test?",
    answer:
      "Yes. Submit a placement-test request and wait for admissions to confirm the next step."
  },
  {
    question: "Are corporate training options available?",
    answer:
      "Yes. Organisations can request a conversation about training areas, learner numbers, and delivery mode."
  },
  {
    question: "How do I enquire about course fees?",
    answer:
      "Contact BTI admissions for current fee details. The website avoids publishing unverified fee information."
  },
  {
    question: "Where is BTI located in Sharjah?",
    answer: `BTI is listed here as a ${siteConfig.city}-based training centre in ${siteConfig.area}. Confirm directions before visiting.`
  }
];

export function HomePage({ locale, dictionary }: HomePageProps) {
  const trustItems = getTrustItems();

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={websiteSchema(locale)} />
      <JsonLd data={faqSchema(homeFaq)} />

      <section className="bg-[var(--brand-soft)]">
        <div className="container-page grid min-h-[calc(100vh-80px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <Badge>{dictionary.home.eyebrow}</Badge>
            <h1 className="text-balance mt-5 text-4xl font-black leading-[1.05] text-[var(--brand-navy)] md:text-6xl">
              {dictionary.home.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
              {dictionary.home.intro}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={localizePath(locale, "/courses")}>
                {dictionary.common.findCourse}
                <ArrowRight size={18} className="rtl-flip" />
              </ButtonLink>
              <ButtonLink href={localizePath(locale, "/contact")} variant="secondary">
                {dictionary.common.speakAdmissions}
              </ButtonLink>
            </div>
            <p className="mt-5 max-w-xl text-sm font-semibold leading-6 text-[var(--brand-muted)]">
              {dictionary.home.microcopy}
            </p>
          </div>

          <div className="surface relative overflow-hidden rounded-lg p-6">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(23,20,72,0.08),rgba(181,31,54,0.07))]" />
            <div className="relative grid gap-5">
              <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
                <Image
                  src="/images/bti-logo.jpg"
                  width={120}
                  height={120}
                  alt="British Training Institute crest logo"
                  className="h-24 w-24 rounded-full border border-[var(--brand-border)] object-contain"
                  priority
                />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
                    {siteConfig.shortName}
                  </p>
                  <p className="mt-1 text-2xl font-black text-[var(--brand-navy)]">
                    Admissions-ready training website
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroCards.map(({ label, icon: Icon }) => (
                  <div key={label} className="rounded-lg bg-white p-4">
                    <Icon size={24} className="text-[var(--brand-red)]" />
                    <p className="mt-3 font-extrabold text-[var(--brand-navy)]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                      Built to turn visitor intent into a clear admissions next
                      step.
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-cream)] p-4 text-sm leading-6 text-[var(--brand-muted)]">
                Approved photography can replace this polished placeholder
                without changing the page layout.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white py-5">
        <div className="container-page grid gap-3 md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm font-extrabold text-[var(--brand-navy)]">
              <CheckCircle2 size={18} className="text-[var(--brand-green)]" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            title={dictionary.home.coursesTitle}
            intro={dictionary.home.coursesIntro}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => {
              const Icon = categoryIcons[index] ?? Sparkles;
              return (
                <Link
                  key={course.slug}
                  href={localizePath(locale, `/courses/${course.slug}`)}
                  className="surface group rounded-lg p-5 transition hover:-translate-y-1 hover:border-[var(--brand-red)]"
                >
                  <Icon size={28} className="text-[var(--brand-red)]" />
                  <h3 className="mt-4 text-lg font-extrabold text-[var(--brand-navy)]">
                    {course.category}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {course.shortDescription}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading title={dictionary.home.transformationTitle} />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              [
                "You are not sure which course or level fits your goal.",
                "Speak with admissions, compare your options, and begin with a clearer next step."
              ],
              [
                "You want to improve a practical skill but need a structured path.",
                "Explore focused programme options designed around specific learning goals."
              ],
              [
                "Your organisation needs training, but a one-size-fits-all option is not enough.",
                "Request a corporate-training conversation shaped around your team's needs."
              ]
            ].map(([before, after], index) => (
              <article key={before} className="surface rounded-lg p-6">
                <p className="text-sm font-extrabold text-[var(--brand-red)]">
                  Step {index + 1}
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
                  Before
                </p>
                <p className="mt-2 text-lg font-extrabold text-[var(--brand-navy)]">
                  {before}
                </p>
                <div className="my-5 h-px bg-[var(--brand-border)]" />
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--brand-green)]">
                  After
                </p>
                <p className="mt-2 text-base leading-7 text-[var(--brand-muted)]">
                  {after}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading title={dictionary.home.featuredTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCourses.map((course) => (
              <article key={course.slug} className="surface flex h-full flex-col rounded-lg p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
                  {course.category}
                </p>
                <h3 className="mt-3 text-xl font-extrabold text-[var(--brand-navy)]">
                  {course.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--brand-muted)]">
                  {course.shortDescription}
                </p>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand-muted)]">
                  For {course.audience[0]}
                </p>
                <div className="mt-5 grid gap-2">
                  <ButtonLink href={localizePath(locale, `/courses/${course.slug}`)} variant="dark">
                    Explore Programme
                  </ButtonLink>
                  <ButtonLink href={localizePath(locale, `/contact?course=${course.slug}`)} variant="secondary">
                    Ask Admissions
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-navy)] py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white/60">
              Admissions journey
            </p>
            <h2 className="text-balance text-3xl font-extrabold leading-tight text-white md:text-4xl">
              {dictionary.home.journeyTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72 md:text-lg">
              Browse courses based on the skills you want to build, ask about
              current schedules and availability, then confirm the right next
              step with admissions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Explore your options", "Browse courses based on the skills you want to build."],
              ["Speak with admissions", "Ask about current schedules, availability, and the most suitable starting point."],
              ["Begin your learning plan", "Confirm your preferred programme and take your next step with confidence."]
            ].map(([title, copy], index) => (
              <div key={title} className="rounded-lg border border-white/15 bg-white/8 p-5">
                <p className="text-3xl font-black text-white/35">0{index + 1}</p>
                <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/72">{copy}</p>
              </div>
            ))}
          </div>
          <ButtonLink href={localizePath(locale, "/contact")} className="lg:col-start-2">
            Request Course Guidance
          </ButtonLink>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="surface rounded-lg p-7">
            <ClipboardCheck size={34} className="text-[var(--brand-red)]" />
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--brand-navy)]">
              {dictionary.home.placementTitle}
            </h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              {dictionary.home.placementCopy}
            </p>
            <ButtonLink href={localizePath(locale, "/placement-test")} className="mt-6">
              Request a Placement Test
            </ButtonLink>
          </div>
          <div className="surface rounded-lg bg-[var(--brand-cream)] p-7">
            <Building2 size={34} className="text-[var(--brand-red)]" />
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--brand-navy)]">
              {dictionary.home.corporateTitle}
            </h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              {dictionary.home.corporateCopy}
            </p>
            <ButtonLink href={localizePath(locale, "/corporate-training")} className="mt-6">
              Request a Corporate Training Proposal
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading title={dictionary.home.resourcesTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {resources.slice(0, 4).map((resource) => (
              <article key={resource.slug} className="surface rounded-lg p-5">
                <FileText size={26} className="text-[var(--brand-red)]" />
                <h3 className="mt-4 text-lg font-extrabold text-[var(--brand-navy)]">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                  {resource.description}
                </p>
                {resource.isAvailable && resource.fileUrl ? (
                  <Link
                    href={resource.fileUrl}
                    className="mt-5 inline-flex text-sm font-extrabold text-[var(--brand-red)]"
                  >
                    Download guide
                  </Link>
                ) : (
                  <p className="mt-5 text-sm font-extrabold text-[var(--brand-navy)]">
                    Request this guide from admissions.
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading title={dictionary.home.faqTitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {homeFaq.map((item) => (
              <article key={item.question} className="surface rounded-lg p-5">
                <h3 className="font-extrabold text-[var(--brand-navy)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
          <ButtonLink href={localizePath(locale, "/faq")} variant="secondary" className="mt-6">
            View full FAQ
          </ButtonLink>
        </div>
      </section>

      <section className="bg-[var(--brand-soft)] py-16">
        <div className="container-page surface grid gap-6 rounded-lg p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--brand-navy)]">
              {dictionary.home.finalTitle}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--brand-muted)]">
              {dictionary.home.finalCopy}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localizePath(locale, "/contact")}>
              Speak to Admissions
            </ButtonLink>
            <ButtonLink href={`https://wa.me/${siteConfig.whatsappNumber}`} variant="secondary">
              <MessageCircle size={18} />
              WhatsApp BTI
            </ButtonLink>
            <ButtonLink href={localizePath(locale, "/courses")} variant="ghost">
              Browse Courses
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
