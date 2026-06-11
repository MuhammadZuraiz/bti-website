"use client";

import { Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { siteConfig } from "@/config/site";
import { leadPayloadSchema, type LeadType } from "@/lib/lead-schema";
import { type Locale } from "@/lib/locale";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type LeadFormProps = {
  leadType: LeadType;
  locale: Locale;
  courseInterest?: string;
  compact?: boolean;
  corporate?: boolean;
  placement?: boolean;
  title?: string;
  submitLabel: string;
};

type LeadFormFields = {
  fullName: string;
  phone: string;
  email?: string;
  preferredContactMethod: "phone" | "whatsapp" | "email";
  courseInterest?: string;
  companyName?: string;
  jobTitle?: string;
  numberOfLearners?: string;
  trainingArea?: string;
  preferredDeliveryMode?: string;
  currentGoal?: string;
  preferredDateTime?: string;
  message?: string;
  consent: boolean;
  website?: string;
};

const eventByLeadType: Record<LeadType, AnalyticsEvent> = {
  "general-enquiry": "general_enquiry_submit",
  "course-enquiry": "course_enquiry_submit",
  "placement-test-request": "placement_test_request_submit",
  "corporate-training-enquiry": "corporate_enquiry_submit",
  "resource-download": "resource_download"
};

function getUtmValue(key: string) {
  if (typeof window === "undefined") {
    return "";
  }
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export function LeadForm({
  leadType,
  locale,
  courseInterest,
  compact = false,
  corporate = false,
  placement = false,
  title,
  submitLabel
}: LeadFormProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormFields>({
    defaultValues: {
      preferredContactMethod: "phone",
      courseInterest: courseInterest ?? "",
      consent: false
    }
  });

  async function onSubmit(rawValues: LeadFormFields) {
    setStatus("idle");
    setMessage("");

    const payload = {
      ...rawValues,
      leadType,
      courseInterest: courseInterest ?? rawValues.courseInterest ?? "",
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

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data)
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("We could not send your enquiry. Please call or WhatsApp BTI.");
      return;
    }

    trackEvent(eventByLeadType[leadType], {
      locale,
      course_interest: parsed.data.courseInterest
    });
    setStatus("success");
    setMessage(
      "Thank you. Your enquiry has been received and admissions can follow up with the latest options."
    );
    reset({
      preferredContactMethod: "phone",
      courseInterest: courseInterest ?? "",
      consent: false
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`surface grid gap-4 rounded-lg p-5 ${compact ? "" : "md:p-7"}`}
      noValidate
    >
      {title ? (
        <div>
          <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            BTI will use these details only to respond to your enquiry. This
            form is CRM-ready and can connect to Odoo when approved.
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

      {!courseInterest && !corporate ? (
        <label className="field-label">
          Course interest
          <input
            className="field-control"
            placeholder="English, IELTS, accounting, HR..."
            {...register("courseInterest")}
          />
        </label>
      ) : null}

      {corporate ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Company name
            <input className="field-control" autoComplete="organization" {...register("companyName")} />
          </label>
          <label className="field-label">
            Job title
            <input className="field-control" autoComplete="organization-title" {...register("jobTitle")} />
          </label>
          <label className="field-label">
            Number of learners
            <input className="field-control" {...register("numberOfLearners")} />
          </label>
          <label className="field-label">
            Training area
            <input className="field-control" {...register("trainingArea")} />
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
            <input className="field-control" {...register("currentGoal")} />
          </label>
          <label className="field-label">
            Preferred date or time range
            <input className="field-control" {...register("preferredDateTime")} />
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
      </label>

      <label className="flex gap-3 rounded-lg bg-[var(--brand-soft)] p-3 text-sm font-semibold leading-6 text-[var(--brand-ink)]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--brand-red)]"
          {...register("consent")}
        />
        <span>
          I agree that {siteConfig.shortName} may contact me about this enquiry.
          This is not a confirmed booking until admissions responds.
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
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--brand-red)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[var(--brand-red-dark)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send size={18} aria-hidden="true" />
        {isSubmitting ? "Sending..." : submitLabel}
      </button>

      <p aria-live="polite" className="text-sm font-semibold">
        {status === "success" ? (
          <span className="text-[var(--brand-green)]">{message}</span>
        ) : null}
        {status === "error" ? (
          <span className="text-[var(--brand-red-dark)]">{message}</span>
        ) : null}
      </p>
    </form>
  );
}
