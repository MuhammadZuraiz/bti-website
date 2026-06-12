import type { LeadSubmissionResponse } from "@/types/leads";

export function isSuccessfulLeadResponse(
  value: unknown
): value is Extract<LeadSubmissionResponse, { ok: true }> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Partial<Extract<LeadSubmissionResponse, { ok: true }>>;
  return (
    data.ok === true &&
    typeof data.referenceId === "string" &&
    (data.deliveryStatus === "delivered" || data.deliveryStatus === "queued")
  );
}

export async function parseLeadSubmissionResponse(response: Response) {
  try {
    const data = (await response.json()) as unknown;
    return isSuccessfulLeadResponse(data) ? data : undefined;
  } catch {
    return undefined;
  }
}
