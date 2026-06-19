import { buildCourses } from "./_builder";

export const medicalHealthcareCourses = buildCourses("medical-healthcare", [
  {
    slug: "medical-coding",
    title: "Medical Coding",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Learn clinical coding standards used across healthcare administration.",
    overview:
      "Medical Coding introduces the classification systems and coding practices used to translate clinical documentation into standardised codes — a core skill in healthcare administration and revenue cycle work.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 30–40 hours",
    learningOutcomes: [
      "Understand clinical coding systems and their uses",
      "Apply coding rules to clinical documentation",
      "Support accurate billing and records",
      "Prepare for further coding certification"
    ],
    targetAudience: ["Healthcare administrators", "Medical records staff", "Healthcare graduates"],
    outline: [
      "Healthcare coding overview",
      "Classification systems",
      "Coding rules and guidelines",
      "Documentation and accuracy",
      "Practice and next steps"
    ],
    certificationText:
      "BTI certificate of completion. Speak with admissions about onward coding certification pathways.",
    relatedCourseSlugs: ["healthcare-administration", "healthcare-quality-management"]
  },
  { slug: "healthcare-administration", title: "Healthcare Administration", relatedCourseSlugs: ["medical-coding", "healthcare-quality-management"] },
  { slug: "healthcare-quality-management", title: "Healthcare Quality Management", relatedCourseSlugs: ["healthcare-administration"] },
  { slug: "healthcare-professional-development", title: "Professional Development for Healthcare Professionals", relatedCourseSlugs: ["healthcare-communication-skills"] },
  { slug: "healthcare-communication-skills", title: "Healthcare Communication Skills", relatedCourseSlugs: ["healthcare-professional-development"] }
]);
