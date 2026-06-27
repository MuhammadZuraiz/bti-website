import { buildCourses } from "./_builder";

export const qualityCourses = buildCourses("quality-operational-excellence", [
  {
    slug: "six-sigma-green-belt",
    title: "Six Sigma Green Belt",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Lead and support process-improvement projects using the DMAIC methodology.",
    overview:
      "Six Sigma Green Belt equips professionals to lead and support process-improvement projects using the DMAIC methodology and core statistical tools, driving measurable quality and efficiency gains.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 30–40 hours",
    learningOutcomes: [
      "Apply the DMAIC improvement methodology",
      "Use core Six Sigma and statistical tools",
      "Define, measure and analyse process performance",
      "Support and deliver improvement projects"
    ],
    targetAudience: ["Quality and operations professionals", "Team leaders", "Process owners"],
    outline: [
      "Six Sigma overview and roles",
      "Define and Measure phases",
      "Analyse phase and root-cause tools",
      "Improve and Control phases",
      "Project application"
    ],
    certificationText:
      "BTI Six Sigma Green Belt certificate of completion. Speak with admissions about accredited exam pathways.",
    relatedCourseSlugs: ["six-sigma-black-belt", "lean-management", "six-sigma-yellow-belt"]
  },
  { slug: "six-sigma-yellow-belt", title: "Six Sigma Yellow Belt", relatedCourseSlugs: ["six-sigma-green-belt"] },
  { slug: "six-sigma-black-belt", title: "Six Sigma Black Belt", relatedCourseSlugs: ["six-sigma-green-belt"] },
  { slug: "lean-management", title: "Lean Management", relatedCourseSlugs: ["six-sigma-green-belt", "total-quality-management"] },
  { slug: "total-quality-management", title: "Total Quality Management", relatedCourseSlugs: ["lean-management", "quality-assurance"] },
  { slug: "quality-assurance", title: "Quality Assurance", relatedCourseSlugs: ["quality-engineering"] },
  { slug: "quality-engineering", title: "Quality Engineering", relatedCourseSlugs: ["quality-assurance"] },
  { slug: "continuous-improvement", title: "Continuous Improvement Programs", relatedCourseSlugs: ["lean-management"] },
  { slug: "iso-implementation", title: "ISO Awareness & Implementation Programs", relatedCourseSlugs: ["total-quality-management"] },
  { slug: "asq-quality-programs", title: "ASQ-related Quality Programs", relatedCourseSlugs: ["quality-engineering"] }
]);
