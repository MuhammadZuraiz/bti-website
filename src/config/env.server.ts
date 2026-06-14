import { z } from "zod";
import {
  getDeploymentEnvironment,
  parseDeploymentEnvironment
} from "@/config/deployment";

const optionalString = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalUrl = optionalString.refine(
  (value) => !value || URL.canParse(value),
  "Must be a valid URL."
);

const environmentSchema = z.object({
  NODE_ENV: z.string().optional(),
  NEXT_PHASE: z.string().optional(),
  DEPLOYMENT_ENV: z.string().optional(),
  DATABASE_URL: optionalString,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  LEAD_RETRY_CRON_SECRET: optionalString,
  LEAD_HASH_SALT: optionalString,
  LEAD_ADMIN_USER: optionalString,
  LEAD_ADMIN_PASSWORD: optionalString,
  ODOO_LEAD_WEBHOOK_URL: optionalUrl,
  ODOO_LEAD_WEBHOOK_SECRET: optionalString,
  GENERIC_LEAD_WEBHOOK_URL: optionalUrl,
  GENERIC_LEAD_WEBHOOK_SECRET: optionalString,
  ALLOW_DEV_SPAM_PROTECTION_BYPASS: optionalString,
  ALLOW_DEV_TURNSTILE_BYPASS: optionalString,
  ALLOW_DEV_LOCAL_RATE_LIMIT: optionalString
});

export const devBypassFlags = [
  "ALLOW_DEV_SPAM_PROTECTION_BYPASS",
  "ALLOW_DEV_TURNSTILE_BYPASS",
  "ALLOW_DEV_LOCAL_RATE_LIMIT"
] as const;

export type DevBypassFlag = (typeof devBypassFlags)[number];

export type ServerEnv = z.infer<typeof environmentSchema>;

export type EnvironmentValidationResult =
  | { ok: true; env: ServerEnv }
  | { ok: false; errors: string[] };

function isHttpsUrl(value?: string) {
  return Boolean(value && URL.canParse(value) && new URL(value).protocol === "https:");
}

function usesExampleDomain(value?: string) {
  return Boolean(value && URL.canParse(value) && new URL(value).hostname.includes("example.com"));
}

export function isProductionRuntime(
  env: { NODE_ENV?: string; NEXT_PHASE?: string } = process.env
) {
  return env.NODE_ENV === "production" && env.NEXT_PHASE !== "phase-production-build";
}

/**
 * Development-only bypasses must be opted into explicitly and can never
 * activate in a production runtime, even if the variable is set.
 */
export function isDevBypassEnabled(
  flag: DevBypassFlag,
  env: Partial<Record<DevBypassFlag, string>> & {
    NODE_ENV?: string;
    NEXT_PHASE?: string;
  } = process.env
) {
  return !isProductionRuntime(env) && env[flag] === "true";
}

export function validateServerEnv(
  rawEnv: NodeJS.ProcessEnv = process.env
): EnvironmentValidationResult {
  const parsed = environmentSchema.safeParse(rawEnv);

  if (!parsed.success) {
    return { ok: false, errors: ["Server environment contains invalid values."] };
  }

  const env = parsed.data;
  const errors: string[] = [];

  if (env.DEPLOYMENT_ENV && !parseDeploymentEnvironment(env.DEPLOYMENT_ENV)) {
    errors.push(
      "DEPLOYMENT_ENV must be one of development, preview, staging, production."
    );
    return { ok: false, errors };
  }

  const deploymentEnvironment = getDeploymentEnvironment(env);

  // Staging mirrors production infrastructure: its canonical URL must be a
  // real HTTPS staging hostname, never a placeholder domain.
  if (deploymentEnvironment === "staging") {
    if (!env.NEXT_PUBLIC_SITE_URL) {
      errors.push("NEXT_PUBLIC_SITE_URL is required in staging.");
    } else {
      if (!isHttpsUrl(env.NEXT_PUBLIC_SITE_URL)) {
        errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in staging.");
      }
      if (usesExampleDomain(env.NEXT_PUBLIC_SITE_URL)) {
        errors.push("NEXT_PUBLIC_SITE_URL must not use example.com.");
      }
    }
  }

  const productionRules =
    deploymentEnvironment === "production" || isProductionRuntime(env);

  if (!productionRules) {
    return errors.length ? { ok: false, errors } : { ok: true, env };
  }

  const requiredKeys: (keyof ServerEnv)[] = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "LEAD_RETRY_CRON_SECRET",
    "LEAD_ADMIN_PASSWORD"
  ];

  requiredKeys.forEach((key) => {
    if (!env[key]) {
      errors.push(`${key} is required in production.`);
    }
  });

  if (!env.ODOO_LEAD_WEBHOOK_URL && !env.GENERIC_LEAD_WEBHOOK_URL) {
    errors.push("At least one lead webhook URL is required in production.");
  }

  if (!isHttpsUrl(env.NEXT_PUBLIC_SITE_URL)) {
    errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }

  if (usesExampleDomain(env.NEXT_PUBLIC_SITE_URL)) {
    errors.push("NEXT_PUBLIC_SITE_URL must not use example.com.");
  }

  [
    env.ODOO_LEAD_WEBHOOK_URL,
    env.GENERIC_LEAD_WEBHOOK_URL,
    env.UPSTASH_REDIS_REST_URL
  ].forEach((url) => {
    if (url && !isHttpsUrl(url)) {
      errors.push("Webhook and Redis URLs must use HTTPS in production.");
    }
  });

  if (env.LEAD_RETRY_CRON_SECRET && env.LEAD_RETRY_CRON_SECRET.length < 16) {
    errors.push("LEAD_RETRY_CRON_SECRET must be at least 16 characters.");
  }

  if (env.LEAD_ADMIN_PASSWORD && env.LEAD_ADMIN_PASSWORD.length < 12) {
    errors.push("LEAD_ADMIN_PASSWORD must be at least 12 characters.");
  }

  devBypassFlags.forEach((flag) => {
    if (env[flag] === "true") {
      errors.push(`${flag} must not be enabled in production.`);
    }
  });

  return errors.length ? { ok: false, errors } : { ok: true, env };
}

export function requireValidServerEnv(rawEnv: NodeJS.ProcessEnv = process.env) {
  const result = validateServerEnv(rawEnv);
  if (!result.ok) {
    throw new Error(result.errors.join(" "));
  }

  return result.env;
}
