import { z } from "zod";
import { getCourseBySlug } from "@/content/courses";
import { getResourceBySlug } from "@/content/resources";

export const leadTypes = [
  "general-enquiry",
  "course-enquiry",
  "placement-test-request",
  "corporate-training-enquiry",
  "resource-request"
] as const;

export type LeadType = (typeof leadTypes)[number];

export const preferredContactMethods = ["phone", "whatsapp", "email"] as const;

const requiredText = (message: string, max = 160) =>
  z.string().trim().min(2, message).max(max, "Please keep this shorter.");

const optionalText = (max = 160) =>
  z
    .string()
    .trim()
    .max(max, "Please keep this shorter.")
    .optional()
    .or(z.literal("").transform(() => undefined));

const optionalLongText = optionalText(1200);

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .optional()
  .or(z.literal("").transform(() => undefined));

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeUaePhoneNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  const digits = digitsOnly(trimmed);

  if (!digits) {
    return undefined;
  }

  if (digits.startsWith("971") && digits.length >= 11) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length >= 9) {
    return `+971${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith("5")) {
    return `+971${digits}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  return trimmed;
}

const optionalPhone = z
  .string()
  .trim()
  .transform(normalizeUaePhoneNumber)
  .refine((value) => !value || digitsOnly(value).length >= 7, {
    message: "Enter a valid phone number."
  })
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalKnownCourseSlug = z
  .string()
  .trim()
  .refine((slug) => Boolean(getCourseBySlug(slug)), {
    message: "Choose a valid course."
  })
  .optional()
  .or(z.literal("").transform(() => undefined));

const knownResourceSlug = z
  .string()
  .trim()
  .refine((slug) => Boolean(getResourceBySlug(slug)), {
    message: "Choose a valid resource."
  });

const optionalKnownResourceSlug = knownResourceSlug
  .optional()
  .or(z.literal("").transform(() => undefined));

const baseFields = {
  fullName: requiredText("Enter your full name.", 120),
  phone: optionalPhone,
  email: optionalEmail,
  preferredContactMethod: z.enum(preferredContactMethods),
  courseInterest: optionalText(160),
  courseSlug: optionalKnownCourseSlug,
  resourceInterest: optionalText(160),
  resourceSlug: optionalKnownResourceSlug,
  companyName: optionalText(160),
  jobTitle: optionalText(160),
  learnerCount: z.coerce
    .number()
    .int("Enter a whole number.")
    .min(1, "Enter the number of learners.")
    .max(10000, "Please enter a realistic learner count.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  trainingArea: optionalText(160),
  preferredDeliveryMode: optionalText(120),
  englishLearningGoal: optionalText(240),
  preferredTime: optionalText(160),
  message: optionalLongText,
  consent: z.literal(true, {
    error: "Please confirm BTI may contact you about this enquiry."
  }),
  locale: z.enum(["en", "ar"]).default("en"),
  sourcePage: z.string().trim().max(240).default("/"),
  utmSource: optionalText(120),
  utmMedium: optionalText(120),
  utmCampaign: optionalText(120),
  utmContent: optionalText(120),
  utmTerm: optionalText(120),
  turnstileToken: optionalText(2048),
  website: z.string().trim().max(0, "We could not accept this submission.").optional()
};

const generalEnquirySchema = z.object({
  ...baseFields,
  leadType: z.literal("general-enquiry")
});

const courseEnquirySchema = z.object({
  ...baseFields,
  leadType: z.literal("course-enquiry")
});

const placementTestSchema = z.object({
  ...baseFields,
  leadType: z.literal("placement-test-request"),
  englishLearningGoal: requiredText("Tell us your English-learning goal.", 240)
});

const corporateTrainingSchema = z.object({
  ...baseFields,
  leadType: z.literal("corporate-training-enquiry"),
  companyName: requiredText("Enter your company name.", 160),
  learnerCount: z.coerce
    .number()
    .int("Enter a whole number.")
    .min(1, "Enter the number of learners.")
    .max(10000, "Please enter a realistic learner count."),
  trainingArea: requiredText("Enter the training area.", 160),
  message: requiredText("Tell us what the team needs.", 1200)
});

const resourceRequestSchema = z.object({
  ...baseFields,
  leadType: z.literal("resource-request"),
  resourceSlug: knownResourceSlug
});

export const leadPayloadSchema = z
  .discriminatedUnion("leadType", [
    generalEnquirySchema,
    courseEnquirySchema,
    placementTestSchema,
    corporateTrainingSchema,
    resourceRequestSchema
  ])
  .superRefine((lead, ctx) => {
    if (!lead.phone && !lead.email) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a phone number or email address."
      });
    }

    if (lead.preferredContactMethod === "email" && !lead.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter an email address for email follow-up."
      });
    }

    if (
      lead.leadType === "general-enquiry" &&
      !lead.courseInterest &&
      !lead.message
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Tell us what you would like to ask about."
      });
    }

    if (
      lead.leadType === "course-enquiry" &&
      !lead.courseSlug &&
      !lead.courseInterest
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["courseInterest"],
        message: "Tell us which course you are interested in."
      });
    }

    if (
      lead.leadType === "placement-test-request" &&
      !lead.preferredTime &&
      !lead.message
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredTime"],
        message: "Share a preferred date, time range, or contact note."
      });
    }
  });

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
