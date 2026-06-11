import { z } from "zod";

export const leadTypes = [
  "general-enquiry",
  "course-enquiry",
  "placement-test-request",
  "corporate-training-enquiry",
  "resource-download"
] as const;

export type LeadType = (typeof leadTypes)[number];

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .or(z.literal(""))
  .optional();

export const leadPayloadSchema = z.object({
  leadType: z.enum(leadTypes),
  fullName: z.string().trim().min(2, "Enter your full name."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  email: optionalEmail,
  preferredContactMethod: z
    .enum(["phone", "whatsapp", "email"])
    .default("phone"),
  courseInterest: z.string().trim().max(160).optional().or(z.literal("")),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(160).optional().or(z.literal("")),
  numberOfLearners: z.string().trim().max(80).optional().or(z.literal("")),
  trainingArea: z.string().trim().max(160).optional().or(z.literal("")),
  preferredDeliveryMode: z.string().trim().max(120).optional().or(z.literal("")),
  currentGoal: z.string().trim().max(240).optional().or(z.literal("")),
  preferredDateTime: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  consent: z.literal(true, {
    error: "Please confirm BTI may contact you about this enquiry."
  }),
  locale: z.enum(["en", "ar"]).default("en"),
  sourcePage: z.string().trim().max(240).default("/"),
  utmSource: z.string().trim().max(120).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(120).optional().or(z.literal("")),
  utmContent: z.string().trim().max(120).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().max(0, "Spam submission rejected.").optional()
});

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
