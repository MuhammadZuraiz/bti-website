import type { LeadDeliveryRecord } from "@/services/lead-repository";

// Column order mirrors scripts/export-leads.mjs so the admin download and the
// CLI export produce identical CSVs.
export const leadCsvColumns = [
  "publicReference",
  "createdAt",
  "leadType",
  "deliveryStatus",
  "deliveryAttempts",
  "deliveredAt",
  "fullName",
  "phone",
  "email",
  "preferredContact",
  "courseInterest",
  "courseSlug",
  "resourceSlug",
  "companyName",
  "jobTitle",
  "learnerCount",
  "trainingArea",
  "preferredDeliveryMode",
  "englishLearningGoal",
  "preferredTime",
  "message",
  "locale",
  "sourcePage",
  "referrer",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm"
] as const;

function csvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const text = value instanceof Date ? value.toISOString() : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function leadsToCsv(records: LeadDeliveryRecord[]): string {
  const lines = [
    leadCsvColumns.join(","),
    ...records.map((record) =>
      leadCsvColumns
        .map((column) => csvValue((record as Record<string, unknown>)[column]))
        .join(",")
    )
  ];
  return `${lines.join("\n")}\n`;
}
