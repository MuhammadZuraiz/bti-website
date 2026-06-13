// Imported by next.config.ts — keep imports relative, not path-aliased.
import {
  getDeploymentEnvironment,
  isIndexingAllowed,
  type DeploymentEnvironment
} from "./deployment";

export type SecurityHeader = { key: string; value: string };

export type SecurityHeaderOptions = {
  environment: DeploymentEnvironment;
  /** Adds Google Analytics origins to the CSP. */
  analyticsConfigured: boolean;
  /** Emits the CSP as report-only (staging rollout aid). */
  cspReportOnly: boolean;
};

export function resolveSecurityHeaderOptions(
  env: NodeJS.ProcessEnv = process.env
): SecurityHeaderOptions {
  return {
    environment: getDeploymentEnvironment(env),
    analyticsConfigured: Boolean(env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    cspReportOnly: env.CSP_REPORT_ONLY === "true"
  };
}

// Centralised third-party origins. Extend here — never inline origins in
// page code — so the CSP stays reviewable.
const turnstileOrigin = "https://challenges.cloudflare.com";
const gaScriptOrigins = ["https://www.googletagmanager.com"];
const gaConnectOrigins = [
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://www.googletagmanager.com"
];

export function buildContentSecurityPolicy(options: SecurityHeaderOptions) {
  const { environment, analyticsConfigured } = options;
  const isDevelopment = environment === "development";

  // Compromise (documented): Next.js App Router emits inline bootstrap
  // scripts and inline style attributes. Nonce-based CSP only works for
  // fully dynamic rendering; this site is mostly static, so
  // 'unsafe-inline' is required for script-src and style-src.
  // 'unsafe-eval' is needed only by the dev-mode HMR runtime.
  // Note: Zod v4 attempts one JIT `new Function` call on form pages; the
  // CSP blocks it and Zod silently falls back to interpreted validation.
  // This logs a single DevTools issue and is intentional — do not add
  // 'unsafe-eval' to silence it.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
    turnstileOrigin,
    ...(analyticsConfigured ? gaScriptOrigins : [])
  ];

  const connectSrc = [
    "'self'",
    turnstileOrigin,
    ...(isDevelopment ? ["ws:"] : []),
    ...(analyticsConfigured ? gaConnectOrigins : [])
  ];

  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${turnstileOrigin}`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"])
  ];

  return directives.join("; ");
}

export function buildSecurityHeaders(
  options: SecurityHeaderOptions = resolveSecurityHeaderOptions()
): SecurityHeader[] {
  const { environment, cspReportOnly } = options;
  const headers: SecurityHeader[] = [
    {
      key: cspReportOnly
        ? "Content-Security-Policy-Report-Only"
        : "Content-Security-Policy",
      value: buildContentSecurityPolicy(options)
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
    },
    // Legacy fallback for browsers without frame-ancestors support.
    { key: "X-Frame-Options", value: "DENY" }
  ];

  if (environment !== "development") {
    // No `preload` until the canonical domain is confirmed — preload listing
    // is effectively irreversible.
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains"
    });
  }

  if (!isIndexingAllowed(environment)) {
    headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  }

  return headers;
}
