import { NextResponse } from "next/server";
import { handleRetryLeads } from "@/services/lead-retry";

export async function POST(request: Request) {
  const result = await handleRetryLeads(request);
  return NextResponse.json(result.body, { status: result.status });
}
