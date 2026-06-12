import { NextResponse } from "next/server";
import { validateServerEnv } from "@/config/env.server";
import { leadPayloadSchema } from "@/lib/lead-schema";
import { logger } from "@/lib/server/logger";
import { submitLead, LeadPersistenceError } from "@/services/lead-processing";
import { protectLeadSubmission } from "@/services/spam-protection";
import type { LeadSubmissionResponse } from "@/types/leads";

const maxBodyBytes = 32 * 1024;

async function parseRequestBody(request: Request) {
  const text = await request.text();

  if (new TextEncoder().encode(text).byteLength > maxBodyBytes) {
    return { ok: false as const, status: 413, error: "Submission is too large." };
  }

  try {
    return { ok: true as const, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, status: 400, error: "Invalid JSON body." };
  }
}

export async function POST(request: Request) {
  const envResult = validateServerEnv();
  if (!envResult.ok) {
    logger.error("lead_environment_invalid", {
      persistenceResult: "not_attempted"
    });
    return NextResponse.json<LeadSubmissionResponse>(
      {
        ok: false,
        error:
          "Lead capture is not configured right now. Please call BTI or message admissions on WhatsApp."
      },
      { status: 503 }
    );
  }

  const bodyResult = await parseRequestBody(request);
  if (!bodyResult.ok) {
    return NextResponse.json<LeadSubmissionResponse>(
      { ok: false, error: bodyResult.error },
      { status: bodyResult.status }
    );
  }

  const parsed = leadPayloadSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const lead = parsed.data;
  const spamResult = await protectLeadSubmission({
    lead,
    request,
    env: envResult.env
  });

  if (!spamResult.ok) {
    logger.warn("lead_submission_blocked", {
      leadType: lead.leadType,
      blockReason: spamResult.reason
    });
    return NextResponse.json<LeadSubmissionResponse>(
      { ok: false, error: spamResult.publicError },
      { status: spamResult.status }
    );
  }

  try {
    const result = await submitLead(lead, {
      referrer: request.headers.get("referer"),
      requestFingerprint: spamResult.requestFingerprint
    });

    return NextResponse.json<LeadSubmissionResponse>(result);
  } catch (error) {
    if (error instanceof LeadPersistenceError) {
      return NextResponse.json<LeadSubmissionResponse>(
        {
          ok: false,
          error:
            "We could not send your enquiry right now. Please call BTI or message the admissions team on WhatsApp."
        },
        { status: 503 }
      );
    }

    logger.error("lead_submission_unhandled_error", {
      leadType: lead.leadType
    });
    return NextResponse.json<LeadSubmissionResponse>(
      {
        ok: false,
        error:
          "We could not send your enquiry right now. Please call BTI or message the admissions team on WhatsApp."
      },
      { status: 500 }
    );
  }
}
