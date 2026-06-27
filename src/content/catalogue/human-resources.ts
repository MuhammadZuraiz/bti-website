import { buildCourses } from "./_builder";

export const humanResourcesCourses = buildCourses("human-resources", [
  {
    slug: "human-resource-management",
    title: "Human Resource Management",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Core HR management across the full employee lifecycle.",
    overview:
      "A practical Human Resource Management programme covering the full employee lifecycle — from workforce planning and recruitment to employee relations, performance and HR's strategic contribution.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 24–36 hours",
    learningOutcomes: [
      "Understand the core functions of modern HR",
      "Apply recruitment, onboarding and retention practices",
      "Manage employee relations and performance",
      "Connect HR activity to organisational goals"
    ],
    targetAudience: ["HR officers and coordinators", "New HR managers", "Business owners"],
    outline: [
      "The HR function and operating models",
      "Workforce planning and recruitment",
      "Onboarding, engagement and retention",
      "Employee relations and policy",
      "Performance management and HR metrics"
    ],
    relatedCourseSlugs: ["recruitment-talent-acquisition", "strategic-human-resources", "hr-analytics"]
  },
  { slug: "recruitment-talent-acquisition", title: "Recruitment & Talent Acquisition", relatedCourseSlugs: ["human-resource-management"] },
  { slug: "employee-relations", title: "Employee Relations", relatedCourseSlugs: ["human-resource-management"] },
  { slug: "learning-and-development", title: "Learning & Development", relatedCourseSlugs: ["human-resource-management"] },
  { slug: "hr-analytics", title: "HR Analytics", relatedCourseSlugs: ["human-resource-management", "strategic-human-resources"] },
  { slug: "performance-management-hr", title: "Performance Management", relatedCourseSlugs: ["human-resource-management"] },
  { slug: "compensation-and-benefits", title: "Compensation & Benefits", relatedCourseSlugs: ["human-resource-management"] },
  { slug: "strategic-human-resources", title: "Strategic Human Resources", relatedCourseSlugs: ["human-resource-management", "hr-analytics"] }
]);
