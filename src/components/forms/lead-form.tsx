"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { siteConfig } from "@/config/site";
import { confirmedEventByLeadType } from "@/lib/lead-analytics";
import { leadPayloadSchema, type LeadType } from "@/lib/lead-schema";
import { parseLeadSubmissionResponse } from "@/lib/lead-response";
import { localizePath, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { isLegalPagePublished } from "@/lib/site-utils";

type LeadFormProps = {
  leadType: LeadType;
  locale: Locale;
  courseInterest?: string;
  courseSlug?: string;
  resourceInterest?: string;
  resourceSlug?: string;
  showCourseInterestField?: boolean;
  compact?: boolean;
  corporate?: boolean;
  placement?: boolean;
  title?: string;
  submitLabel: string;
};

type LeadFormFields = {
  fullName: string;
  phone?: string;
  email?: string;
  preferredContactMethod: "phone" | "whatsapp" | "email";
  courseInterest?: string;
  courseSlug?: string;
  resourceInterest?: string;
  resourceSlug?: string;
  companyName?: string;
  jobTitle?: string;
  learnerCount?: string;
  trainingArea?: string;
  preferredDeliveryMode?: string;
  englishLearningGoal?: string;
  preferredTime?: string;
  message?: string;
  consent: boolean;
  turnstileToken?: string;
  website?: string;
};

declare global {
  interface Window {
    btiTurnstileCallback?: (token: string) => void;
  }
}

function getUtmValue(key: string) {
  if (typeof window === "undefined") {
    return "";
  }
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function LeadForm({
  leadType,
  locale,
  courseInterest,
  courseSlug,
  resourceInterest,
  resourceSlug,
  showCourseInterestField = false,
  compact = false,
  corporate = false,
  placement = false,
  title,
  submitLabel
}: LeadFormProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormFields>({
    defaultValues: {
      preferredContactMethod: "phone",
      courseInterest: courseInterest ?? "",
      courseSlug: courseSlug ?? "",
      resourceInterest: resourceInterest ?? "",
      resourceSlug: resourceSlug ?? "",
      consent: false,
      turnstileToken: ""
    }
  });

  useEffect(() => {
    window.btiTurnstileCallback = (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    };

    return () => {
      window.btiTurnstileCallback = undefined;
    };
  }, [setValue]);

  async function onSubmit(rawValues: LeadFormFields) {
    setStatus("idle");
    setMessage("");
    setReferenceId("");

    const payload = {
      ...rawValues,
      leadType,
      courseInterest: courseInterest ?? rawValues.courseInterest ?? "",
      courseSlug: courseSlug ?? rawValues.courseSlug ?? "",
      resourceInterest: resourceInterest ?? rawValues.resourceInterest ?? "",
      resourceSlug: resourceSlug ?? rawValues.resourceSlug ?? "",
      locale,
      sourcePage: pathname,
      utmSource: getUtmValue("utm_source"),
      utmMedium: getUtmValue("utm_medium"),
      utmCampaign: getUtmValue("utm_campaign"),
      utmContent: getUtmValue("utm_content"),
      utmTerm: getUtmValue("utm_term")
    };

    const parsed = leadPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LeadFormFields | undefined;
        if (field) {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const data = await parseLeadSubmissionResponse(response);

      if (!data) {
        trackEvent("lead_submission_failed", {
          lead_type: parsed.data.leadType,
          course_slug: parsed.data.courseSlug,
          resource_slug: parsed.data.resourceSlug,
          locale,
          source_page: pathname
        });
        setStatus("error");
        setMessage(
          "We could not send your enquiry right now. Please call BTI or message the admissions team on WhatsApp."
        );
        return;
      }

      trackEvent(confirmedEventByLeadType[leadType], {
        lead_type: parsed.data.leadType,
        course_slug: parsed.data.courseSlug,
        resource_slug: parsed.data.resourceSlug,
        locale,
        source_page: pathname,
        delivery_status: data.deliveryStatus
      });
      setStatus("success");
      setReferenceId(data.referenceId);
      setMessage(
        "Thank you. Your enquiry has been received. The admissions team will review your request and contact you using your preferred method."
      );
      reset({
        preferredContactMethod: "phone",
        courseInterest: courseInterest ?? "",
        courseSlug: courseSlug ?? "",
        resourceInterest: resourceInterest ?? "",
        resourceSlug: resourceSlug ?? "",
        consent: false,
        turnstileToken: ""
      });
    } catch {
      trackEvent("lead_submission_failed", {
        lead_type: leadType,
        course_slug: courseSlug,
        resource_slug: resourceSlug,
        locale,
        source_page: pathname
      });
      setStatus("error");
      setMessage(
        "We could not send your enquiry right now. Please call BTI or message the admissions team on WhatsApp."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`form-panel grid gap-4 rounded-lg p-5 ${compact ? "" : "md:p-7"}`}
      noValidate
    >
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      {title ? (
        <div>
          <h2 className="card-title text-xl">
            {title}
          </h2>
          <p className="helper-text mt-2">
            BTI will use these details to respond to your enquiry and guide you
            toward the most relevant next step.
          </p>
        </div>
      ) : null}

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...register("website")}
      />
      <input type="hidden" {...register("courseSlug")} />
      <input type="hidden" {...register("resourceInterest")} />
      <input type="hidden" {...register("resourceSlug")} />
      <input type="hidden" {...register("turnstileToken")} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Full name
          <input className="field-control" autoComplete="name" {...register("fullName")} />
          {errors.fullName?.message ? (
            <span className="form-error" role="alert">
              {errors.fullName.message}
            </span>
          ) : null}
        </label>
        <label className="field-label">
          Phone number
          <input className="field-control" autoComplete="tel" {...register("phone")} />
          {errors.phone?.message ? (
            <span className="form-error" role="alert">
              {errors.phone.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Email
          <input className="field-control" type="email" autoComplete="email" {...register("email")} />
          {errors.email?.message ? (
            <span className="form-error" role="alert">
              {errors.email.message}
            </span>
          ) : null}
        </label>
        <label className="field-label">
          Preferred contact
          <select className="field-control" {...register("preferredContactMethod")}>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>

      {showCourseInterestField && !corporate ? (
        <label className="field-label">
          Course interest
          <input
            className="field-control"
            placeholder="English, IELTS, accounting, HR..."
            {...register("courseInterest")}
          />
          {errors.courseInterest?.message ? (
            <span className="form-error" role="alert">
              {errors.courseInterest.message}
            </span>
          ) : null}
        </label>
      ) : null}

      {corporate ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Company name
            <input className="field-control" autoComplete="organization" {...register("companyName")} />
            {errors.companyName?.message ? (
              <span className="form-error" role="alert">
                {errors.companyName.message}
              </span>
            ) : null}
          </label>
          <label className="field-label">
            Job title
            <input className="field-control" autoComplete="organization-title" {...register("jobTitle")} />
          </label>
          <label className="field-label">
            Number of learners
            <input className="field-control" type="number" min="1" {...register("learnerCount")} />
            {errors.learnerCount?.message ? (
              <span className="form-error" role="alert">
                {errors.learnerCount.message}
              </span>
            ) : null}
          </label>
          <label className="field-label">
            Training area
            <input className="field-control" {...register("trainingArea")} />
            {errors.trainingArea?.message ? (
              <span className="form-error" role="alert">
                {errors.trainingArea.message}
              </span>
            ) : null}
          </label>
          <label className="field-label md:col-span-2">
            Preferred delivery mode
            <select className="field-control" {...register("preferredDeliveryMode")}>
              <option value="">Not sure yet</option>
              <option value="Classroom">Classroom</option>
              <option value="Corporate workshop">Corporate workshop</option>
              <option value="Blended">Blended</option>
            </select>
          </label>
        </div>
      ) : null}

      {placement ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Current English-learning goal
            <input className="field-control" {...register("englishLearningGoal")} />
            {errors.englishLearningGoal?.message ? (
              <span className="form-error" role="alert">
                {errors.englishLearningGoal.message}
              </span>
            ) : null}
          </label>
          <label className="field-label">
            Preferred date or time range
            <input className="field-control" {...register("preferredTime")} />
            {errors.preferredTime?.message ? (
              <span className="form-error" role="alert">
                {errors.preferredTime.message}
              </span>
            ) : null}
          </label>
        </div>
      ) : null}

      <label className="field-label">
        Message
        <textarea
          className="field-control min-h-28 resize-y"
          placeholder="Tell admissions what you would like to learn or ask."
          {...register("message")}
        />
        {errors.message?.message ? (
          <span className="form-error" role="alert">
            {errors.message.message}
          </span>
        ) : null}
      </label>

      {turnstileSiteKey ? (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-callback="btiTurnstileCallback"
        />
      ) : null}

      <label className="flex gap-3 rounded-lg bg-[var(--brand-soft)] p-3 text-sm font-semibold leading-6 text-[var(--brand-ink)]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--brand-red)]"
          {...register("consent")}
        />
        <span>
          By submitting, you agree that {siteConfig.shortName} may contact you
          about your enquiry. This is not a confirmed booking until admissions
          responds.
          {isLegalPagePublished("privacy") ? (
            <>
              {" "}
              <Link
                href={localizePath(locale, "/privacy")}
                className="font-extrabold text-[var(--brand-red)] underline underline-offset-2"
              >
                Privacy notice
              </Link>
            </>
          ) : null}
        </span>
      </label>
      {errors.consent?.message ? (
        <span className="form-error" role="alert">
          {errors.consent.message}
        </span>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,#c5293f,var(--brand-red-dark))] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-red)] transition hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(181,31,54,0.34)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send size={18} aria-hidden="true" />
        {isSubmitting ? "Sending..." : submitLabel}
      </button>

      <div aria-live="polite" className="text-sm font-semibold">
        {status === "success" ? (
          <div className="grid gap-1 rounded-lg bg-green-50 p-3 text-[var(--brand-green)]">
            <span>{message}</span>
            <span>Reference: {referenceId}</span>
          </div>
        ) : null}
        {status === "error" ? (
          <div
            className="grid gap-3 rounded-lg bg-red-50 p-3 text-[var(--brand-red-dark)]"
            role="alert"
          >
            <span>{message}</span>
            <span className="flex flex-wrap gap-2">
              <a
                href={siteConfig.landlineHref}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-extrabold text-[var(--brand-navy)]"
              >
                <Phone size={16} aria-hidden="true" />
                Call {siteConfig.landlineDisplay}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-extrabold text-[var(--brand-navy)]"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp admissions
              </a>
            </span>
          </div>
        ) : null}
      </div>
    </form>
  );
}
