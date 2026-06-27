import { buildCourses } from "./_builder";

export const digitalMarketingCourses = buildCourses("digital-marketing", [
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "An end-to-end introduction to modern digital marketing channels and strategy.",
    overview:
      "A practical digital marketing programme covering strategy, search, social media, paid advertising, content and analytics — building the skills to plan and run effective campaigns.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 24–36 hours",
    learningOutcomes: [
      "Plan a digital marketing strategy",
      "Run search, social and paid campaigns",
      "Create content that converts",
      "Measure performance with analytics"
    ],
    targetAudience: ["Marketing professionals", "Business owners", "Career changers"],
    outline: [
      "Digital marketing landscape and strategy",
      "SEO and content marketing",
      "Social media and paid advertising",
      "Email and funnels",
      "Analytics and optimisation"
    ],
    relatedCourseSlugs: ["seo", "social-media-marketing", "google-ads"]
  },
  { slug: "seo", title: "SEO", relatedCourseSlugs: ["digital-marketing", "content-marketing"] },
  { slug: "social-media-marketing", title: "Social Media Marketing", relatedCourseSlugs: ["digital-marketing", "google-ads"] },
  { slug: "google-ads", title: "Google Ads", relatedCourseSlugs: ["digital-marketing", "social-media-marketing"] },
  { slug: "content-marketing", title: "Content Marketing", relatedCourseSlugs: ["seo", "branding"] },
  { slug: "branding", title: "Branding", relatedCourseSlugs: ["content-marketing"] },
  { slug: "marketing-analytics", title: "Marketing Analytics", relatedCourseSlugs: ["digital-marketing"] },
  { slug: "digital-business-development", title: "Digital Business Development", relatedCourseSlugs: ["digital-marketing"] }
]);
