// Scripted verification of security headers, robots, sitemap and metadata
// against a running server.
//
// Usage:
//   node scripts/check-seo-headers.mjs <baseUrl> <environment>
//   pnpm check:seo-headers http://localhost:3000 production
//
// <environment> is the DEPLOYMENT_ENV the server was BUILT with:
// development | preview | staging | production

const [baseUrl, environment] = process.argv.slice(2);

const environments = ["development", "preview", "staging", "production"];
if (!baseUrl || !environments.includes(environment)) {
  console.error(
    "Usage: node scripts/check-seo-headers.mjs <baseUrl> <development|preview|staging|production>"
  );
  process.exit(2);
}

const indexable = environment === "production";
const failures = [];

function check(label, condition, detail = "") {
  if (condition) {
    console.info(`  ok: ${label}`);
  } else {
    failures.push(label);
    console.error(`  FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const home = await fetch(`${baseUrl}/en`);
const homeHtml = await home.text();
const headers = home.headers;

console.info(`Checking ${baseUrl} as "${environment}"`);

console.info("Security headers:");
const csp =
  headers.get("content-security-policy") ??
  headers.get("content-security-policy-report-only");
check("Content-Security-Policy present", Boolean(csp));
check(
  "CSP restricts framing",
  Boolean(csp?.includes("frame-ancestors 'none'"))
);
check(
  "CSP allows Turnstile",
  Boolean(csp?.includes("challenges.cloudflare.com"))
);
check(
  "X-Content-Type-Options: nosniff",
  headers.get("x-content-type-options") === "nosniff"
);
check(
  "Referrer-Policy set",
  headers.get("referrer-policy") === "strict-origin-when-cross-origin"
);
check(
  "Permissions-Policy set",
  Boolean(headers.get("permissions-policy")?.includes("camera=()"))
);
if (environment === "development") {
  check(
    "HSTS omitted in development",
    !headers.get("strict-transport-security")
  );
} else {
  check(
    "Strict-Transport-Security set",
    Boolean(headers.get("strict-transport-security")?.includes("max-age="))
  );
}

console.info("Indexing protection:");
const xRobots = headers.get("x-robots-tag");
if (indexable) {
  check("X-Robots-Tag absent in production", !xRobots);
  check(
    "no robots noindex meta in production",
    !/name="robots"[^>]*noindex/i.test(homeHtml)
  );
} else {
  check("X-Robots-Tag: noindex, nofollow", xRobots === "noindex, nofollow");
  check(
    "robots noindex meta present",
    /name="robots"[^>]*noindex/i.test(homeHtml)
  );
}

const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
const robotsText = await robotsResponse.text();
if (indexable) {
  check("robots.txt allows crawling", /Allow:\s*\//.test(robotsText));
  check("robots.txt blocks /api/", /Disallow:\s*\/api\//.test(robotsText));
  check("robots.txt lists sitemap", /Sitemap:/.test(robotsText));
} else {
  check(
    "robots.txt disallows everything",
    /Disallow:\s*\/\s*$/m.test(robotsText)
  );
  check("robots.txt omits sitemap", !/Sitemap:/.test(robotsText));
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapText = await sitemapResponse.text();
const sitemapUrlCount = (sitemapText.match(/<loc>/g) ?? []).length;
if (indexable) {
  check("sitemap has entries", sitemapUrlCount > 0, `${sitemapUrlCount} URLs`);
  check("sitemap excludes /ar", !sitemapText.includes("/ar"));
  check("sitemap excludes draft privacy", !sitemapText.includes("/privacy"));
  check("sitemap excludes api", !sitemapText.includes("/api"));
} else {
  check("sitemap is empty", sitemapUrlCount === 0, `${sitemapUrlCount} URLs`);
}

console.info("Page metadata:");
check("canonical link present", /rel="canonical"/.test(homeHtml));
check("no example.com", !homeHtml.includes("example.com"));
check(
  "JSON-LD present on home",
  homeHtml.includes('application/ld+json') &&
    homeHtml.includes('"EducationalOrganization"')
);
check("single H1", (homeHtml.match(/<h1[\s>]/g) ?? []).length === 1);

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}

console.info("\nAll checks passed.");
