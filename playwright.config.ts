import { defineConfig, devices } from "@playwright/test";

const e2ePort = 3100;
const webhookPort = 4567;

export const e2eBaseUrl = `http://localhost:${e2ePort}`;

const baseDatabaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://bti:bti_local_password@localhost:5433/bti_website?schema=public";

function deriveE2eDatabaseUrl() {
  if (process.env.E2E_DATABASE_URL) {
    return process.env.E2E_DATABASE_URL;
  }

  // Dedicated E2E database on the same PostgreSQL server.
  const url = new URL(baseDatabaseUrl);
  url.pathname = "/bti_website_e2e";
  return url.toString();
}

export const e2eDatabaseUrl = deriveE2eDatabaseUrl();

export default defineConfig({
  testDir: "e2e",
  globalSetup: "./e2e/global-setup.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  // The dev server compiles routes on demand; too many parallel cold compiles
  // cause flaky timeouts (worse on 2-core CI runners). 2 workers is a stable
  // balance across the mobile/tablet/desktop projects.
  workers: 2,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: e2eBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 }
      }
    }
  ],
  webServer: [
    {
      command: "node scripts/test-webhook-server.mjs",
      port: webhookPort,
      reuseExistingServer: !process.env.CI,
      env: {
        TEST_WEBHOOK_PORT: String(webhookPort),
        GENERIC_LEAD_WEBHOOK_SECRET: "local-test-secret"
      }
    },
    {
      command: `pnpm dev --port ${e2ePort}`,
      url: `${e2eBaseUrl}/en`,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: {
        DATABASE_URL: e2eDatabaseUrl,
        // E2E exercises the real persistence and webhook flow; only the
        // bot-protection layers are bypassed, via the explicit dev flags
        // that production rejects.
        ALLOW_DEV_SPAM_PROTECTION_BYPASS: "true",
        ALLOW_DEV_TURNSTILE_BYPASS: "true",
        ALLOW_DEV_LOCAL_RATE_LIMIT: "true",
        GENERIC_LEAD_WEBHOOK_URL: `http://localhost:${webhookPort}/test-webhook`,
        GENERIC_LEAD_WEBHOOK_SECRET: "local-test-secret",
        LEAD_RETRY_CRON_SECRET: "e2e-retry-secret-0123",
        NEXT_PUBLIC_SITE_URL: e2eBaseUrl
      }
    }
  ]
});
