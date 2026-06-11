import type { Metadata } from "next";
import { Building2, CheckCircle2, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/corporate-training",
    title: "Corporate Training in Sharjah | British Training Institute",
    description:
      "Explore corporate training options for teams and organisations in Sharjah and across the UAE. Request a tailored discussion with British Training Institute."
  });
}

export default async function CorporateTrainingPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  const trainingAreas = [
    "Business and management",
    "English communication",
    "HR and administration",
    "Accounting and finance",
    "Technical and computer skills",
    "Professional skills workshops"
  ];

  return (
    <>
      <section className="bg-[var(--brand-navy)] py-14 text-white">
        <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
              Corporate training
            </p>
            <h1 className="text-balance mt-4 text-4xl font-black leading-tight md:text-5xl">
              Develop your team with training aligned to real workplace needs.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Explore corporate-training options for organisations, teams, and
              institutions in Sharjah and across the UAE. Tell BTI what skills
              your team wants to strengthen and request a tailored discussion.
            </p>
            <ButtonLink href="#corporate-form" className="mt-7">
              Request a Corporate Training Conversation
            </ButtonLink>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/8 p-6">
            <Building2 size={44} className="text-white" />
            <h2 className="mt-4 text-2xl font-extrabold">Built for B2B enquiry clarity</h2>
            <p className="mt-3 leading-7 text-white/72">
              Capture team size, training area, preferred mode, and business
              context before a proposal conversation begins.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-start gap-8">
            <SectionHeading
              title="Training areas and potential use cases"
              intro="BTI can discuss skills-based training needs for organisations, teams, and institutions."
            />
            <div className="surface rounded-lg p-6">
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">Training areas</h2>
              <div className="mt-4 grid gap-3">
                {trainingAreas.map((area) => (
                  <p key={area} className="flex gap-2 text-[var(--brand-muted)]">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                    {area}
                  </p>
                ))}
              </div>
            </div>
            <div className="surface rounded-lg p-6">
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">How the process works</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                <li>1. Share your organisation, learner count, and training goal.</li>
                <li>2. BTI reviews the request and discusses current options.</li>
                <li>3. Admissions or corporate training staff respond with suitable next steps.</li>
              </ol>
            </div>
            <div className="surface rounded-lg p-6">
              <FileText size={28} className="text-[var(--brand-red)]" />
              <h2 className="mt-3 text-xl font-extrabold text-[var(--brand-navy)]">
                Corporate profile placeholder
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                A downloadable corporate profile can be added once BTI approves
                final training areas, credentials, and photography.
              </p>
            </div>
          </div>
          <div id="corporate-form">
            <LeadForm
              leadType="corporate-training-enquiry"
              locale={locale}
              corporate
              title="Request a corporate training conversation"
              submitLabel="Request a Corporate Training Conversation"
            />
          </div>
        </div>
      </section>
    </>
  );
}
