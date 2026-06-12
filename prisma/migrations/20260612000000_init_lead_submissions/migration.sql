CREATE TABLE "LeadSubmission" (
  "id" TEXT NOT NULL,
  "publicReference" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "leadType" TEXT NOT NULL,
  "deliveryStatus" TEXT NOT NULL DEFAULT 'queued',
  "deliveryAttempts" INTEGER NOT NULL DEFAULT 0,
  "lastDeliveryAttemptAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "failureReason" TEXT,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "preferredContact" TEXT,
  "courseInterest" TEXT,
  "courseSlug" TEXT,
  "resourceSlug" TEXT,
  "companyName" TEXT,
  "jobTitle" TEXT,
  "learnerCount" INTEGER,
  "trainingArea" TEXT,
  "preferredDeliveryMode" TEXT,
  "englishLearningGoal" TEXT,
  "preferredTime" TEXT,
  "message" TEXT,
  "locale" TEXT NOT NULL,
  "sourcePage" TEXT NOT NULL,
  "referrer" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmContent" TEXT,
  "utmTerm" TEXT,
  "consent" BOOLEAN NOT NULL,
  "requestFingerprint" TEXT,
  "webhookDeliveryId" TEXT,

  CONSTRAINT "LeadSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeadSubmission_publicReference_key" ON "LeadSubmission"("publicReference");
CREATE INDEX "LeadSubmission_createdAt_idx" ON "LeadSubmission"("createdAt");
CREATE INDEX "LeadSubmission_deliveryStatus_idx" ON "LeadSubmission"("deliveryStatus");
CREATE INDEX "LeadSubmission_leadType_idx" ON "LeadSubmission"("leadType");
