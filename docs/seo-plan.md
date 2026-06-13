# SEO Plan

## Main Keyword Themes

- British Training Institute Sharjah
- training institute in Sharjah
- professional courses in Sharjah
- English language courses in Sharjah
- IELTS preparation course in Sharjah
- accounting courses in Sharjah
- finance training in Sharjah
- HR courses in Sharjah
- business management training in Sharjah
- corporate training in Sharjah
- computer courses in Sharjah
- children training programmes in Sharjah

## Route-to-Keyword Mapping

- `/en`: British Training Institute Sharjah, training institute in Sharjah
- `/en/courses/english-language-courses-sharjah`: English language courses in Sharjah
- `/en/courses/ielts-preparation-course-sharjah`: IELTS preparation course in Sharjah
- `/en/courses/accounting-finance-courses-sharjah`: accounting courses in Sharjah, finance training in Sharjah
- `/en/courses/hr-administration-courses-sharjah`: HR courses in Sharjah
- `/en/courses/business-management-training-sharjah`: business management training in Sharjah
- `/en/corporate-training`: corporate training in Sharjah
- `/en/contact`: BTI Sharjah contact and NAP consistency

## Metadata Summary

Route-specific metadata is created with `localizedMetadata` in `src/lib/metadata.ts`. Each major page includes canonical URLs, locale alternates, Open Graph and Twitter metadata. Indexing is environment-gated: only builds made with `DEPLOYMENT_ENV=production` emit indexable metadata, an allowing robots.txt and a populated sitemap (`src/lib/seo.ts`, `src/config/deployment.ts`).

## Structured Data (JSON-LD)

Emitted by `src/lib/schema.ts` and rendered through `JsonLd`:

- Home: `EducationalOrganization` (E.164 phone, logo, postal address, admissions contact point, approved `sameAs` links only) and `WebSite`.
- Course pages: `Course` (no prices, ratings or guarantees), `FAQPage`, `BreadcrumbList`.
- FAQ page: `FAQPage`.

Schema output is unit-tested in `tests/schema.test.ts` (including "no
aggregateRating / reviews / foundingDate" guards).

### Validate before launch

1. Build and serve with production env, or use the staging URL.
2. Paste each page URL (or its rendered HTML) into the Schema.org validator
   (validator.schema.org) and Google's Rich Results Test
   (search.google.com/test/rich-results).
3. Confirm zero errors for: home, one course page, the FAQ page.
4. Re-validate whenever `src/lib/schema.ts`, contact details or course
   content change.

## Local SEO Checklist

- Use one canonical domain.
- Keep NAP consistent in config, footer, contact page and schema.
- Add Google Business Profile URL.
- Add approved map URL.
- Verify opening hours and holiday hours.
- Add directions and landmark notes after approval.

## Google Business Profile Consistency Checklist

- Name: British Training Institute
- Address: approved final wording only
- Landline and mobile
- Website canonical URL
- Course categories and services
- Opening hours
- Photos
- UTM-tagged website link

## Search Console Launch Checklist

- Verify canonical domain.
- Submit sitemap.
- Inspect `/en`, `/ar`, course pages and contact page.
- Review indexing, mobile usability and Core Web Vitals.
- Monitor 404s and redirects.

## Redirect Checklist

- Choose canonical domain.
- Map old domains and URLs.
- Use 301 redirects.
- Preserve high-value course and IELTS URLs.
- Monitor Search Console after launch.
