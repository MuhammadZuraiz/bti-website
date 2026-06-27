import { buildCourses } from "./_builder";

export const businessManagementCourses = buildCourses("business-management", [
  {
    slug: "leadership-and-management",
    title: "Leadership & Management",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Develop practical leadership, team management and decision-making capability.",
    overview:
      "A practical leadership and management programme that builds the skills to lead teams, manage performance, communicate effectively and make sound decisions in a modern workplace.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 24–36 hours",
    learningOutcomes: [
      "Apply core leadership and management principles",
      "Lead, motivate and manage team performance",
      "Communicate, delegate and resolve conflict effectively",
      "Make structured, accountable decisions"
    ],
    targetAudience: ["New and aspiring managers", "Team leaders", "Supervisors"],
    outline: [
      "Leadership styles and self-awareness",
      "Building and managing high-performing teams",
      "Performance management and feedback",
      "Communication, delegation and conflict resolution",
      "Decision-making and problem solving"
    ],
    relatedCourseSlugs: ["strategic-management", "executive-development", "performance-management-bm"]
  },
  { slug: "business-administration", title: "Business Administration", relatedCourseSlugs: ["office-management", "administrative-skills"] },
  { slug: "strategic-management", title: "Strategic Management", relatedCourseSlugs: ["leadership-and-management", "executive-development"] },
  { slug: "executive-development", title: "Executive Development", relatedCourseSlugs: ["leadership-and-management", "strategic-management"] },
  { slug: "customer-service-excellence", title: "Customer Service Excellence", relatedCourseSlugs: ["business-communication"] },
  { slug: "administrative-skills", title: "Administrative Skills", relatedCourseSlugs: ["office-management"] },
  { slug: "office-management", title: "Office Management", relatedCourseSlugs: ["administrative-skills"] },
  { slug: "business-communication", title: "Business Communication", relatedCourseSlugs: ["customer-service-excellence"] },
  { slug: "organizational-development", title: "Organizational Development", relatedCourseSlugs: ["strategic-management"] },
  { slug: "performance-management-bm", title: "Performance Management", relatedCourseSlugs: ["leadership-and-management"] }
]);
