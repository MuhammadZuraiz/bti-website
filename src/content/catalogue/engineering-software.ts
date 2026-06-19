import { buildCourses } from "./_builder";

export const engineeringSoftwareCourses = buildCourses("engineering-software-design", [
  {
    slug: "primavera-p6",
    title: "Primavera P6",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Plan, schedule and control projects with Oracle Primavera P6.",
    overview:
      "Hands-on Primavera P6 training covering project setup, scheduling, resource and cost management, baselines and progress tracking — the planning standard for large engineering and construction projects.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 24–32 hours",
    learningOutcomes: [
      "Build and maintain project schedules in Primavera P6",
      "Manage activities, relationships and the critical path",
      "Assign resources and costs",
      "Baseline, track progress and report"
    ],
    targetAudience: ["Planners and schedulers", "Project engineers", "Project controls staff"],
    outline: [
      "P6 interface and project setup",
      "Activities, relationships and scheduling",
      "Resources and costs",
      "Baselines and progress updates",
      "Reporting and analysis"
    ],
    relatedCourseSlugs: ["autocad", "revit", "bim-fundamentals"]
  },
  { slug: "autocad", title: "AutoCAD", relatedCourseSlugs: ["revit", "bim-fundamentals"] },
  { slug: "revit", title: "Revit", relatedCourseSlugs: ["autocad", "bim-fundamentals"] },
  { slug: "solidworks", title: "SolidWorks", relatedCourseSlugs: ["autocad"] },
  { slug: "etabs", title: "ETABS", relatedCourseSlugs: ["staad-pro"] },
  { slug: "staad-pro", title: "STAAD Pro", relatedCourseSlugs: ["etabs"] },
  { slug: "engineering-design-applications", title: "Engineering Design Applications", relatedCourseSlugs: ["autocad", "solidworks"] },
  { slug: "bim-fundamentals", title: "BIM Fundamentals", relatedCourseSlugs: ["revit", "autocad"] }
]);
