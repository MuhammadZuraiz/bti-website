import type { ServerEnv } from "@/config/env.server";
import { isDevBypassEnabled } from "@/config/env.server";
import type { LeadPayload } from "@/lib/lead-schema";
import {
  createContactFingerprint,
  createDuplicateFingerprint,
  getHashedClientIp
} from "@/lib/server/lead-security";

export type SpamProtectionResult =
  | { ok: true; requestFingerprint: string }
  | {
      ok: false;
      status: 400 | 429 | 503;
      publicError: string;
      reason: "honeypot" | "turnstile" | "rate-limit" | "duplicate" | "configuration";
    };

export interface RateLimitStore {
  increment(key: string, ttlSeconds: number): Promise<number>;
}

type TurnstileFetch = typeof fetch;

const memoryCounters = new Map<string, { count: number; expiresAt: number }>();

export const inMemoryRateLimitStore: RateLimitStore = {
  async increment(key, ttlSeconds) {
    const now = Date.now();
    const current = memoryCounters.get(key);

    if (!current || current.expiresAt <= now) {
      memoryCounters.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
      return 1;
    }

    current.count += 1;
    return current.count;
  }
};

export function clearInMemoryRateLimitStore() {
  memoryCounters.clear();
}

export function createUpstashRateLimitStore(
  env: Partial<ServerEnv>,
  fetcher: TurnstileFetch = fetch
): RateLimitStore | undefined {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return undefined;
  }

  const baseUrl = env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "");

  return {
    async increment(key, ttlSeconds) {
      const response = await fetcher(`${baseUrl}/pipeline`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
          "content-type": "application/json"
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, ttlSeconds, "NX"]
        ])
      });

      if (!response.ok) {
        throw new Error("Redis rate limit request failed.");
      }

      const body = (await response.json()) as [{ result?: number }];
      return Number(body[0]?.result ?? 0);
    }
  };
}

async function verifyTurnstile(
  token: string | undefined,
  env: Partial<ServerEnv>,
  fetcher: TurnstileFetch
) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return isDevBypassEnabled("ALLOW_DEV_TURNSTILE_BYPASS", env);
  }

  if (!token) {
    return false;
  }

  const body = new URLSearchParams();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);

  const response = await fetcher(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export async function protectLeadSubmission({
  lead,
  request,
  env = process.env,
  store,
  fetcher = fetch
}: {
  lead: LeadPayload;
  request: Request;
  env?: Partial<ServerEnv>;
  store?: RateLimitStore;
  fetcher?: TurnstileFetch;
}): Promise<SpamProtectionResult> {
  if (lead.website) {
    return {
      ok: false,
      status: 400,
      publicError: "We could not accept this submission.",
      reason: "honeypot"
    };
  }

  const salt = env.LEAD_HASH_SALT ?? env.LEAD_RETRY_CRON_SECRET;
  const duplicateFingerprint = createDuplicateFingerprint(lead, salt);

  if (isDevBypassEnabled("ALLOW_DEV_SPAM_PROTECTION_BYPASS", env)) {
    return { ok: true, requestFingerprint: duplicateFingerprint };
  }

  const turnstileOk = await verifyTurnstile(lead.turnstileToken, env, fetcher);
  if (!turnstileOk) {
    return {
      ok: false,
      status: 400,
      publicError: "We could not verify this submission. Please try again.",
      reason: "turnstile"
    };
  }

  const limiter =
    store ??
    createUpstashRateLimitStore(env, fetcher) ??
    (isDevBypassEnabled("ALLOW_DEV_LOCAL_RATE_LIMIT", env)
      ? inMemoryRateLimitStore
      : undefined);

  if (!limiter) {
    return {
      ok: false,
      status: 503,
      publicError: "Enquiry protection is not configured right now.",
      reason: "configuration"
    };
  }

  const ipHash = getHashedClientIp(request, salt);
  const contactFingerprint = createContactFingerprint(lead, salt);

  try {
    const [ipTenMinute, ipDaily, contactHourly, duplicateCount] =
      await Promise.all([
        limiter.increment(`lead:ip10:${ipHash}`, 10 * 60),
        limiter.increment(`lead:ipday:${ipHash}`, 24 * 60 * 60),
        limiter.increment(`lead:contact:${contactFingerprint}`, 60 * 60),
        limiter.increment(`lead:duplicate:${duplicateFingerprint}`, 5 * 60)
      ]);

    if (duplicateCount > 1) {
      return {
        ok: false,
        status: 429,
        publicError: "This enquiry was already submitted. Please wait before trying again.",
        reason: "duplicate"
      };
    }

    if (ipTenMinute > 5 || ipDaily > 15 || contactHourly > 3) {
      return {
        ok: false,
        status: 429,
        publicError: "Too many submissions. Please try again later.",
        reason: "rate-limit"
      };
    }

    return { ok: true, requestFingerprint: duplicateFingerprint };
  } catch {
    return {
      ok: false,
      status: 503,
      publicError: "Enquiry protection is not available right now.",
      reason: "configuration"
    };
  }
}
