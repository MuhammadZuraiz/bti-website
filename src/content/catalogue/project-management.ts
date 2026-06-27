import { buildCourses } from "./_builder";

export const projectManagementCourses = buildCourses("project-management", [
  {
    slug: "pmp-preparation",
    title: "PMP Preparation",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Prepare for the PMI Project Management Professional (PMP) certification exam.",
    seoDescription:
      "PMP exam preparation in Sharjah at British Training Institute — aligned to the PMI PMBOK and exam content outline, with practice questions and exam strategy.",
    overview:
      "Comprehensive PMP exam preparation aligned to PMI's current exam content outline. The programme covers predictive, agile and hybrid approaches, with practice questions, exam strategy and guidance on the application process.",
    durationText: "35 contact hours (PMI requirement)",
    trainingHours: "35 hours",
    learningOutcomes: [
      "Understand the PMP exam domains: People, Process and Business Environment",
      "Apply predictive, agile and hybrid project approaches",
      "Practise exam-style questions with rationale",
      "Plan your PMP application and study path"
    ],
    targetAudience: [
      "Experienced project managers pursuing PMP",
      "Team leads moving into project roles",
      "Professionals seeking PMI certification"
    ],
    outline: [
      "PMP exam structure and eligibility",
      "People domain: teams, leadership and stakeholders",
      "Process domain: scope, schedule, cost, quality, risk",
      "Business environment and compliance",
      "Agile and hybrid delivery",
      "Practice exams and exam-day strategy"
    ],
    certificationText:
      "Qualifies toward the 35 contact hours PMI requires for the PMP exam. The PMP exam is sat with PMI — admissions can advise.",
    relatedCourseSlugs: ["capm-preparation", "agile-project-management", "prince2-preparation"]
  },
  { slug: "capm-preparation", title: "CAPM Preparation", relatedCourseSlugs: ["pmp-preparation"] },
  { slug: "agile-project-management", title: "Agile Project Management", relatedCourseSlugs: ["pmp-preparation", "prince2-preparation"] },
  { slug: "risk-management", title: "Risk Management", relatedCourseSlugs: ["pmp-preparation", "project-controls"] },
  { slug: "project-planning-scheduling", title: "Project Planning & Scheduling", relatedCourseSlugs: ["project-controls", "pmp-preparation"] },
  { slug: "project-controls", title: "Project Controls", relatedCourseSlugs: ["project-planning-scheduling"] },
  { slug: "pmo-fundamentals", title: "PMO Fundamentals", relatedCourseSlugs: ["pmp-preparation"] },
  { slug: "prince2-preparation", title: "PRINCE2 Preparation", relatedCourseSlugs: ["pmp-preparation", "agile-project-management"] }
]);
