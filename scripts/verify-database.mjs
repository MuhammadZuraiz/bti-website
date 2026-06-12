import { randomBytes } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const localDatabaseUrl =
  "postgresql://bti:bti_local_password@localhost:5432/bti_website?schema=public";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? localDatabaseUrl
});
const prisma = new PrismaClient({ adapter });

const expectedIndexes = [
  "LeadSubmission_pkey",
  "LeadSubmission_publicReference_key",
  "LeadSubmission_createdAt_idx",
  "LeadSubmission_deliveryStatus_idx",
  "LeadSubmission_leadType_idx"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const indexes = await prisma.$queryRaw`
    SELECT indexname FROM pg_indexes WHERE tablename = 'LeadSubmission'
  `;
  const indexNames = indexes.map((row) => row.indexname);
  const missingIndexes = expectedIndexes.filter(
    (name) => !indexNames.includes(name)
  );
  assert(
    missingIndexes.length === 0,
    `Missing indexes: ${missingIndexes.join(", ")}`
  );
  console.info(`Indexes verified: ${expectedIndexes.join(", ")}`);

  const reference = `BTI-VERIFY-${randomBytes(4).toString("hex").toUpperCase()}`;
  const created = await prisma.leadSubmission.create({
    data: {
      publicReference: reference,
      leadType: "general-enquiry",
      fullName: "Synthetic Verification Lead",
      phone: "+971500000000",
      email: "synthetic-verify@bti.invalid",
      preferredContact: "phone",
      message: "Synthetic db:verify round-trip record.",
      locale: "en",
      sourcePage: "/db-verify",
      consent: true
    }
  });
  console.info(`Inserted synthetic lead ${reference}`);

  const readBack = await prisma.leadSubmission.findUnique({
    where: { publicReference: reference }
  });
  assert(readBack, "Could not read back the synthetic lead.");
  assert(readBack.id === created.id, "Read-back id does not match.");
  assert(
    readBack.fullName === "Synthetic Verification Lead",
    "Read-back fullName does not match."
  );
  assert(readBack.leadType === "general-enquiry", "Read-back leadType does not match.");
  assert(readBack.deliveryStatus === "queued", "Default deliveryStatus should be queued.");
  assert(readBack.deliveryAttempts === 0, "Default deliveryAttempts should be 0.");
  assert(readBack.consent === true, "Read-back consent does not match.");
  assert(readBack.createdAt instanceof Date, "createdAt should be a Date.");
  console.info("Read-back fields verified.");

  await prisma.leadSubmission.delete({ where: { id: created.id } });
  const afterDelete = await prisma.leadSubmission.findUnique({
    where: { publicReference: reference }
  });
  assert(!afterDelete, "Synthetic lead was not deleted.");
  console.info(`Deleted synthetic lead ${reference}`);
  console.info("db:verify passed.");
} catch (error) {
  console.error(`db:verify failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
