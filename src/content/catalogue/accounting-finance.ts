import { buildCourses } from "./_builder";

export const accountingFinanceCourses = buildCourses("accounting-finance", [
  {
    slug: "acca-preparation",
    title: "ACCA Preparation",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Preparation for the ACCA qualification across its core papers.",
    seoDescription:
      "ACCA preparation in Sharjah at British Training Institute — structured tuition across ACCA papers with practice and exam technique.",
    overview:
      "Structured ACCA preparation that guides candidates through the qualification's papers with clear tuition, practice questions and exam technique. Suitable for those starting ACCA or progressing through the levels.",
    durationText: "By paper / level",
    trainingHours: "Varies by paper",
    learningOutcomes: [
      "Understand the structure of the ACCA qualification",
      "Build knowledge across core accounting and finance papers",
      "Apply exam technique and practice under timed conditions",
      "Plan a realistic ACCA study pathway"
    ],
    targetAudience: [
      "Aspiring chartered certified accountants",
      "Finance professionals advancing their qualifications",
      "Accounting graduates"
    ],
    outline: [
      "ACCA qualification overview and exemptions",
      "Core knowledge papers",
      "Skills and applied papers",
      "Practice questions and mock exams",
      "Exam technique and study planning"
    ],
    certificationText:
      "BTI tuition supports the ACCA qualification. ACCA exams are sat through ACCA — admissions can advise on registration and exemptions.",
    relatedCourseSlugs: ["cma-preparation", "cpa-preparation", "ifrs-training"]
  },
  { slug: "financial-accounting", title: "Financial Accounting", relatedCourseSlugs: ["management-accounting", "ifrs-training"] },
  { slug: "management-accounting", title: "Management Accounting", relatedCourseSlugs: ["financial-accounting", "cma-preparation"] },
  { slug: "financial-analysis", title: "Financial Analysis", relatedCourseSlugs: ["finance-for-non-financial-managers"] },
  { slug: "ifrs-training", title: "IFRS Training", relatedCourseSlugs: ["financial-accounting", "acca-preparation"] },
  { slug: "vat-training", title: "VAT Training", relatedCourseSlugs: ["financial-accounting"] },
  { slug: "internal-auditing", title: "Internal Auditing", relatedCourseSlugs: ["financial-accounting"] },
  { slug: "budgeting-cost-control", title: "Budgeting & Cost Control", relatedCourseSlugs: ["management-accounting"] },
  { slug: "cma-preparation", title: "CMA Preparation", relatedCourseSlugs: ["acca-preparation", "management-accounting"] },
  { slug: "cpa-preparation", title: "CPA Preparation", relatedCourseSlugs: ["acca-preparation"] },
  { slug: "finance-for-non-financial-managers", title: "Finance for Non-Financial Managers", relatedCourseSlugs: ["financial-analysis"] }
]);
