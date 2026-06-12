import { describe, expect, it } from "vitest";
import { validateServerEnv } from "@/config/env.server";

const productionEnv = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://user:pass@db.example.com:5432/bti",
  NEXT_PUBLIC_SITE_URL: "https://bti.example",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
  TURNSTILE_SECRET_KEY: "secret-key",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "redis-token",
  LEAD_RETRY_CRON_SECRET: "a-very-long-secret",
  ODOO_LEAD_WEBHOOK_URL: "https://odoo.example.com/leads"
} as NodeJS.ProcessEnv;

describe("server environment validation", () => {
  it("accepts complete production configuration", () => {
    expect(validateServerEnv(productionEnv).ok).toBe(true);
  });

  it("requires database URL in production", () => {
    const result = validateServerEnv({
      ...productionEnv,
      DATABASE_URL: ""
    });
    expect(result.ok).toBe(false);
  });

  it("requires at least one webhook URL in production", () => {
    const result = validateServerEnv({
      ...productionEnv,
      ODOO_LEAD_WEBHOOK_URL: "",
      GENERIC_LEAD_WEBHOOK_URL: ""
    });
    expect(result.ok).toBe(false);
  });

  it("rejects example.com as the canonical production URL", () => {
    const result = validateServerEnv({
      ...productionEnv,
      NEXT_PUBLIC_SITE_URL: "https://example.com"
    });
    expect(result.ok).toBe(false);
  });

  it("requires HTTPS URLs in production", () => {
    const result = validateServerEnv({
      ...productionEnv,
      NEXT_PUBLIC_SITE_URL: "http://bti.example"
    });
    expect(result.ok).toBe(false);
  });

  it.each([
    "ALLOW_DEV_SPAM_PROTECTION_BYPASS",
    "ALLOW_DEV_TURNSTILE_BYPASS",
    "ALLOW_DEV_LOCAL_RATE_LIMIT"
  ])("rejects %s enabled in production", (flag) => {
    const result = validateServerEnv({
      ...productionEnv,
      [flag]: "true"
    });
    expect(result.ok).toBe(false);
  });

  it("accepts dev bypass flags that are present but disabled in production", () => {
    const result = validateServerEnv({
      ...productionEnv,
      ALLOW_DEV_TURNSTILE_BYPASS: "false"
    });
    expect(result.ok).toBe(true);
  });
});
