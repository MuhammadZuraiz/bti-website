import { createHash, randomBytes } from "node:crypto";
import type { LeadPayload } from "@/lib/lead-schema";

export function generatePublicReference() {
  return `BTI-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function hashIdentifier(value: string, salt = process.env.LEAD_HASH_SALT ?? "bti-development-salt") {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    firstForwardedIp ??
    "unknown"
  );
}

export function getHashedClientIp(request: Request, salt?: string) {
  return hashIdentifier(getClientIp(request), salt);
}

export function sanitizePath(value?: string | null) {
  if (!value) {
    return "/";
  }

  try {
    const parsed = URL.canParse(value)
      ? new URL(value)
      : new URL(value, "https://bti.local");
    return `${parsed.pathname}${parsed.search}`.slice(0, 240) || "/";
  } catch {
    return "/";
  }
}

export function sanitizeReferrer(value?: string | null) {
  if (!value || !URL.canParse(value)) {
    return undefined;
  }

  const parsed = new URL(value);
  return `${parsed.origin}${parsed.pathname}`.slice(0, 240);
}

function normalizedContact(lead: LeadPayload) {
  return [lead.email ?? "", lead.phone ?? ""].filter(Boolean).join("|");
}

export function createContactFingerprint(lead: LeadPayload, salt?: string) {
  return hashIdentifier(normalizedContact(lead) || lead.fullName, salt);
}

export function createDuplicateFingerprint(lead: LeadPayload, salt?: string) {
  const material = [
    lead.leadType,
    lead.email ?? "",
    lead.phone ?? "",
    lead.courseSlug ?? "",
    lead.resourceSlug ?? "",
    lead.message ?? ""
  ].join("|");

  return hashIdentifier(material, salt);
}
