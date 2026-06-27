import { buildCourses } from "./_builder";

export const informationTechnologyCourses = buildCourses("information-technology", [
  {
    slug: "python-programming",
    title: "Python Programming",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Learn Python from fundamentals to practical scripting and data work.",
    overview:
      "A practical Python programming course taking learners from core syntax to functions, data structures and real-world scripting — a strong foundation for automation, data analysis and further development.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 30–40 hours",
    learningOutcomes: [
      "Write Python using core syntax and data structures",
      "Build functions, handle files and manage errors",
      "Work with libraries for practical tasks",
      "Apply Python to automation or data problems"
    ],
    targetAudience: ["Beginners to programming", "Analysts and engineers", "Students"],
    outline: [
      "Python basics and environment setup",
      "Control flow, functions and modules",
      "Data structures and file handling",
      "Working with libraries",
      "Mini project"
    ],
    relatedCourseSlugs: ["data-analysis", "artificial-intelligence", "web-development"]
  },
  { slug: "web-development", title: "Web Development", relatedCourseSlugs: ["python-programming", "software-development-fundamentals"] },
  { slug: "software-development-fundamentals", title: "Software Development Fundamentals", relatedCourseSlugs: ["python-programming", "web-development"] },
  { slug: "database-management", title: "Database Management", relatedCourseSlugs: ["data-analysis"] },
  { slug: "data-analysis", title: "Data Analysis", relatedCourseSlugs: ["python-programming", "advanced-excel"] },
  { slug: "artificial-intelligence", title: "Artificial Intelligence", relatedCourseSlugs: ["python-programming", "data-analysis"] },
  { slug: "cybersecurity-fundamentals", title: "Cybersecurity Fundamentals", relatedCourseSlugs: ["software-development-fundamentals"] },
  { slug: "microsoft-office", title: "Microsoft Office Programs", relatedCourseSlugs: ["advanced-excel"] },
  { slug: "advanced-excel", title: "Advanced Excel", relatedCourseSlugs: ["data-analysis", "microsoft-office"] },
  { slug: "digital-transformation", title: "Digital Transformation", relatedCourseSlugs: ["artificial-intelligence"] }
]);
