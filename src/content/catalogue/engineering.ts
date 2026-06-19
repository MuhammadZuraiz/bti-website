import { buildCourses } from "./_builder";

export const engineeringCourses = buildCourses("engineering", [
  {
    slug: "quantity-surveying",
    title: "Quantity Surveying",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Cost management and measurement for construction and engineering projects.",
    overview:
      "Quantity Surveying develops practical skills in measurement, cost estimating, tendering and cost control across the construction project lifecycle — valuable for engineers, estimators and project teams.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 30–40 hours",
    learningOutcomes: [
      "Measure and quantify construction works",
      "Prepare estimates, BOQs and tender documents",
      "Apply cost control and valuation techniques",
      "Understand contracts and variations"
    ],
    targetAudience: ["Civil engineers", "Estimators and QS assistants", "Project and cost teams"],
    outline: [
      "Role of the quantity surveyor",
      "Measurement and bills of quantities",
      "Estimating and tendering",
      "Cost control and valuations",
      "Contracts, claims and variations"
    ],
    relatedCourseSlugs: ["construction-management", "civil-engineering", "engineering-project-management"]
  },
  { slug: "civil-engineering", title: "Civil Engineering", relatedCourseSlugs: ["construction-management", "quantity-surveying"] },
  { slug: "mechanical-engineering", title: "Mechanical Engineering", relatedCourseSlugs: ["electrical-engineering"] },
  { slug: "electrical-engineering", title: "Electrical Engineering", relatedCourseSlugs: ["mechanical-engineering"] },
  { slug: "construction-management", title: "Construction Management", relatedCourseSlugs: ["quantity-surveying", "engineering-project-management"] },
  { slug: "health-and-safety", title: "Health & Safety", relatedCourseSlugs: ["construction-management"] },
  { slug: "engineering-project-management", title: "Engineering Project Management", relatedCourseSlugs: ["construction-management", "quantity-surveying"] }
]);
