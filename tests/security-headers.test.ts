import { describe, expect, it } from "vitest";
import {
  buildContentSecurityPolicy,
  buildSecurityHeaders,
  resolveSecurityHeaderOptions,
  type SecurityHeaderOptions
} from "@/config/security-headers";

function options(
  overrides: Partial<SecurityHeaderOptions> = {}
): SecurityHeaderOptions {
  return {
    environment: "production",
    analyticsConfigured: false,
    cspReportOnly: false,
    ...overrides
  };
}

function headerMap(opts: SecurityHeaderOptions) {
  return Object.fromEntries(
    buildSecurityHeaders(opts).map((header) => [header.key, header.value])
  );
}

describe("content security policy", () => {
  it("locks down production without dev allowances", () => {
    const csp = buildContentSecurityPolicy(options());

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("ws:");
  });

  it("allows HMR needs only in development", () => {
    const csp = buildContentSecurityPolicy(options({ environment: "development" }));

    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("ws:");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("adds analytics origins only when analytics is configured", () => {
    const without = buildContentSecurityPolicy(options());
    const withGa = buildContentSecurityPolicy(
      options({ analyticsConfigured: true })
    );

    expect(without).not.toContain("googletagmanager");
    expect(withGa).toContain("https://www.googletagmanager.com");
    expect(withGa).toContain("https://www.google-analytics.com");
  });
});

describe("security headers", () => {
  it("emits the full production header set without X-Robots-Tag", () => {
    const headers = headerMap(options());

    expect(headers["Content-Security-Policy"]).toBeDefined();
    expect(headers["Strict-Transport-Security"]).toBe(
      "max-age=63072000; includeSubDomains"
    );
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Robots-Tag"]).toBeUndefined();
  });

  it.each(["development", "preview", "staging"] as const)(
    "emits X-Robots-Tag noindex in %s",
    (environment) => {
      const headers = headerMap(options({ environment }));
      expect(headers["X-Robots-Tag"]).toBe("noindex, nofollow");
    }
  );

  it("omits HSTS only in development", () => {
    expect(
      headerMap(options({ environment: "development" }))["Strict-Transport-Security"]
    ).toBeUndefined();
    expect(
      headerMap(options({ environment: "staging" }))["Strict-Transport-Security"]
    ).toBeDefined();
  });

  it("supports report-only rollout for staging", () => {
    const headers = headerMap(options({ environment: "staging", cspReportOnly: true }));

    expect(headers["Content-Security-Policy-Report-Only"]).toBeDefined();
    expect(headers["Content-Security-Policy"]).toBeUndefined();
  });

  it("resolves options from the process environment", () => {
    const resolved = resolveSecurityHeaderOptions({
      NODE_ENV: "test",
      DEPLOYMENT_ENV: "staging",
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST",
      CSP_REPORT_ONLY: "true"
    } as NodeJS.ProcessEnv);

    expect(resolved).toEqual({
      environment: "staging",
      analyticsConfigured: true,
      cspReportOnly: true
    });
  });
});
