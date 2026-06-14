import Link from "next/link";
import { notFound } from "next/navigation";
import type { LeadDeliveryRecord } from "@/services/lead-repository";
import { prismaLeadRepository } from "@/services/lead-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fieldGroups: { heading: string; keys: (keyof LeadDeliveryRecord)[] }[] = [
  {
    heading: "Enquiry",
    keys: ["publicReference", "leadType", "createdAt", "locale", "sourcePage"]
  },
  {
    heading: "Contact",
    keys: ["fullName", "email", "phone", "preferredContact", "consent"]
  },
  {
    heading: "Course / resource",
    keys: ["courseInterest", "courseSlug", "resourceSlug"]
  },
  {
    heading: "Corporate",
    keys: ["companyName", "jobTitle", "learnerCount", "trainingArea", "preferredDeliveryMode"]
  },
  {
    heading: "Placement / message",
    keys: ["englishLearningGoal", "preferredTime", "message"]
  },
  {
    heading: "Delivery",
    keys: [
      "deliveryStatus",
      "deliveryAttempts",
      "lastDeliveryAttemptAt",
      "deliveredAt",
      "failureReason",
      "webhookDeliveryId"
    ]
  },
  {
    heading: "Attribution",
    keys: ["referrer", "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm"]
  }
];

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return value.toISOString().replace("T", " ").slice(0, 19);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

export default async function AdminLeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prismaLeadRepository.findById(id);
  if (!lead) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/leads" style={{ color: "#b51f36", fontWeight: 700 }}>
        ← Back to enquiries
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#171448", margin: "12px 0 20px" }}>
        {lead.publicReference}
      </h1>

      <div style={{ display: "grid", gap: 16 }}>
        {fieldGroups.map((group) => (
          <section
            key={group.heading}
            style={{
              background: "#fff",
              border: "1px solid #e5e7ee",
              borderRadius: 10,
              padding: 16
            }}
          >
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5e6472", margin: "0 0 10px" }}>
              {group.heading}
            </h2>
            <dl style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "6px 12px", margin: 0 }}>
              {group.keys.map((key) => (
                <div key={String(key)} style={{ display: "contents" }}>
                  <dt style={{ color: "#5e6472", fontSize: 13 }}>{String(key)}</dt>
                  <dd style={{ margin: 0, fontSize: 13, color: "#151525", wordBreak: "break-word" }}>
                    {display(lead[key])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
