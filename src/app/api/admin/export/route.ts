import { NextResponse } from "next/server";
import { leadsToCsv } from "@/lib/server/lead-csv";
import { prismaLeadRepository } from "@/services/lead-repository";

// Auth is enforced by the proxy (HTTP Basic on /api/admin/*). This handler
// streams all leads as CSV for authenticated staff. Node runtime for Prisma.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { records } = await prismaLeadRepository.list({
    limit: 100000,
    offset: 0
  });

  const timestamp = new Date().toISOString().replaceAll(":", "-");
  return new NextResponse(leadsToCsv(records), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bti-leads-${timestamp}.csv"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow"
    }
  });
}
