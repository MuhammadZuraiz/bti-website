import { NextResponse } from "next/server";
import { leadPayloadSchema } from "@/lib/lead-schema";
import {
  developmentRateLimitAdapter,
  leadIntegrationAdapter
} from "@/services/leads";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const lead = parsed.data;

  if (lead.website) {
    return NextResponse.json({ error: "Spam submission rejected." }, { status: 400 });
  }

  const allowed = await developmentRateLimitAdapter.allow(
    `${lead.leadType}:${lead.sourcePage}`
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const result = await leadIntegrationAdapter.submit({
      ...lead,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      ok: result.ok,
      delivery: result.delivery,
      message:
        result.delivery === "development-log"
          ? "Lead captured in development fallback. Configure a webhook before production."
          : "Lead submitted."
    });
  } catch {
    return NextResponse.json(
      { error: "Lead delivery failed. Please use phone or WhatsApp." },
      { status: 502 }
    );
  }
}
