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
import { ContextLink } from "@/components/conversion/context-link";
import { OptionalImagePanel } from "@/components/media/optional-image-panel";
import { StatsBand } from "@/components/sections/stats-band";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import {
  allDepartments,
  departmentHref,
  featuredDepartments,
  getCoursesByDepartment
} from "@/content/catalogue";
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
import { isResourcePublished } from "@/lib/site-utils";

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
  { label: "Admissions enquiries", icon: ShieldCheck }
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
      "Contact BTI admissions for current fee details and available options."
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

      <section className="hero-surface">
        <div className="container-page grid min-h-[calc(100vh-80px)] items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div>
            <Badge>{dictionary.home.eyebrow}</Badge>
            <h1 className="hero-title text-balance mt-5">
              {dictionary.home.headline}
            </h1>
            <p className="body-large mt-5 max-w-2xl">
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
            <p className="helper-text mt-5 max-w-xl font-semibold">
              {dictionary.home.microcopy}
            </p>
          </div>

          <div className="featured-card relative min-h-[460px] overflow-hidden rounded-lg">
            <OptionalImagePanel
              src="/images/hero-training.jpg"
              alt="Professional training and admissions guidance at a Sharjah training centre"
              fallbackTitle="Training guidance in Sharjah"
              fallbackCopy="A focused admissions experience for learners, parents, professionals and corporate teams."
              fallbackPosition="top"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,72,0.05),rgba(23,20,72,0.78))]" />
            <div className="absolute inset-x-5 bottom-5 grid gap-4">
              <div className="flex max-w-xl items-center gap-4 rounded-lg bg-white/95 p-4 shadow-sm backdrop-blur">
                <Image
                  src="/images/bti-logo.jpg"
                  width={82}
                  height={82}
                  alt="British Training Institute crest logo"
                  className="h-16 w-16 shrink-0 rounded-full border border-[var(--brand-border)] object-contain"
                  priority
                />
                <div>
                  <p className="meta-label text-[var(--brand-red)]">
                    {siteConfig.shortName}
                  </p>
                  <p className="card-title mt-1 text-xl">
                    Practical course guidance, clearer next steps.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {heroCards.map(({ label, icon: Icon }) => (
                  <div key={label} className="rounded-lg border border-white/18 bg-white/92 p-4 backdrop-blur">
                    <Icon size={22} className="text-[var(--brand-red)]" />
                    <p className="mt-2 text-sm font-semibold text-[var(--brand-navy)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white py-5">
        <div className="container-page grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm font-extrabold text-[var(--brand-navy)]">
              <CheckCircle2 size={18} className="shrink-0 text-[var(--brand-green)]" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <StatsBand />

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            title={dictionary.home.coursesTitle}
            intro={dictionary.home.coursesIntro}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {allDepartments.map((department, index) => {
              const Icon = categoryIcons[index] ?? Sparkles;
              return (
                <Link
                  key={department.slug}
                  href={localizePath(locale, departmentHref(department))}
                  className={`${index < 2 ? "featured-card" : "compact-card"} group rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand-red)]`}
                >
                  <Icon size={28} className="text-[var(--brand-red)]" />
                  <h3 className="card-title mt-4">{department.name}</h3>
                  <p className="helper-text mt-2">{department.shortDescription}</p>
                  <p className="meta-label mt-3 text-[var(--brand-red)]">
                    {getCoursesByDepartment(department.slug).length} courses
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
              <article key={before} className="timeline-item rounded-lg p-6">
                <p className="meta-label text-[var(--brand-red)]">
                  Step {index + 1}
                </p>
                <p className="meta-label mt-4">
                  Before
                </p>
                <p className="card-title mt-2">
                  {before}
                </p>
                <div className="my-5 h-px bg-[var(--brand-border)]" />
                <p className="meta-label text-[var(--brand-green)]">
                  After
                </p>
                <p className="supporting-copy mt-2">
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
            {featuredDepartments.map((department) => (
              <article key={department.slug} className="compact-card flex h-full flex-col rounded-lg p-5">
                <p className="meta-label text-[var(--brand-red)]">Department</p>
                <h3 className="card-title mt-3">{department.name}</h3>
                <p className="helper-text mt-3 flex-1">{department.shortDescription}</p>
                <p className="meta-label mt-4">
                  {getCoursesByDepartment(department.slug).length} courses
                </p>
                <div className="mt-5 grid gap-2">
                  <ButtonLink href={localizePath(locale, departmentHref(department))} variant="dark">
                    Explore Department
                  </ButtonLink>
                  <ContextLink
                    href={localizePath(locale, "/contact")}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[var(--brand-red)] transition hover:bg-[var(--brand-soft)]"
                  >
                    Ask Admissions
                  </ContextLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white/60">
              Admissions journey
            </p>
            <h2 className="section-title on-dark text-balance">
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
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
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
          <div className="featured-card rounded-lg p-7">
            <ClipboardCheck size={34} className="text-[var(--brand-red)]" />
            <h2 className="section-title mt-4">
              {dictionary.home.placementTitle}
            </h2>
            <p className="supporting-copy mt-3">
              {dictionary.home.placementCopy}
            </p>
            <ButtonLink href={localizePath(locale, "/placement-test")} className="mt-6">
              Request a Placement Test
            </ButtonLink>
          </div>
          <div className="split-panel rounded-lg p-7">
            <Building2 size={34} className="text-[var(--brand-red)]" />
            <h2 className="section-title mt-4">
              {dictionary.home.corporateTitle}
            </h2>
            <p className="supporting-copy mt-3">
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
              <article key={resource.slug} className="compact-card rounded-lg p-5">
                <FileText size={26} className="text-[var(--brand-red)]" />
                <h3 className="card-title mt-4">
                  {resource.title}
                </h3>
                <p className="helper-text mt-2">
                  {resource.description}
                </p>
                {isResourcePublished(resource) ? (
                  <Link
                    href={resource.fileUrl as string}
                    className="mt-5 inline-flex text-sm font-extrabold text-[var(--brand-red)]"
                  >
                    Download guide
                  </Link>
                ) : (
                  <ContextLink
                    href={localizePath(locale, `/contact?resource=${resource.slug}`)}
                    className="mt-5 inline-flex text-sm font-extrabold text-[var(--brand-red)]"
                  >
                    Request this guide from admissions.
                  </ContextLink>
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
              <article key={item.question} className="text-row">
                <h3 className="card-title">
                  {item.question}
                </h3>
                <p className="helper-text mt-2">
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
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-border)] border-l-4 border-l-[var(--brand-red)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-9">
            {/* Soft burgundy glow behind the action panel */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(181,31,54,0.12),transparent_70%)] lg:block"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h2 className="section-title">
                  {dictionary.home.finalTitle}
                </h2>
                <p className="supporting-copy mt-3 max-w-xl">
                  {dictionary.home.finalCopy}
                </p>
                <ul className="mt-6 grid gap-2.5">
                  {dictionary.home.finalPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm font-semibold text-[var(--brand-ink)]">
                      <CheckCircle2 size={18} className="shrink-0 text-[var(--brand-green)]" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-5 md:p-6">
                <p className="meta-label text-[var(--brand-red)]">
                  {dictionary.home.finalActionLabel}
                </p>
                <div className="mt-4 grid gap-2.5">
                  <ButtonLink href={localizePath(locale, "/contact")} className="w-full">
                    Speak to Admissions
                  </ButtonLink>
                  <ButtonLink
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    variant="secondary"
                    className="w-full"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    WhatsApp BTI
                  </ButtonLink>
                  <ButtonLink
                    href={localizePath(locale, "/courses")}
                    variant="outline"
                    className="w-full"
                  >
                    Browse Courses
                  </ButtonLink>
                </div>
                <p className="mt-4 text-xs font-semibold text-[var(--brand-muted)]">
                  {dictionary.home.finalNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
