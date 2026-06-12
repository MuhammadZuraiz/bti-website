import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const localDatabaseUrl =
  "postgresql://bti:bti_local_password@localhost:5432/bti_website?schema=public";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? localDatabaseUrl
});
const prisma = new PrismaClient({ adapter });

function csvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return `"${String(value).replaceAll('"', '""')}"`;
}

const columns = [
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
];

try {
  const leads = await prisma.leadSubmission.findMany({
    orderBy: { createdAt: "desc" }
  });
  const lines = [
    columns.join(","),
    ...leads.map((lead) =>
      columns.map((column) => csvValue(lead[column])).join(",")
    )
  ];
  const exportDir = path.join(process.cwd(), "exports");
  await mkdir(exportDir, { recursive: true });
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const exportPath = path.join(exportDir, `leads-${timestamp}.csv`);
  await writeFile(exportPath, `${lines.join("\n")}\n`, "utf8");
  console.info(`Exported ${leads.length} leads to ${exportPath}`);
} finally {
  await prisma.$disconnect();
}
