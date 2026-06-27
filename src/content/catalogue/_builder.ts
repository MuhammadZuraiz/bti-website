import type { Course } from "@/types/catalogue";

export const defaultDeliveryMethods = [
  "Classroom",
  "Live Online",
  "Corporate In-House"
];

export type CourseInput = Partial<
  Omit<Course, "slug" | "departmentSlug" | "title">
> & {
  slug: string;
  title: string;
};

// Builds a department's courses, filling neutral defaults so "outline" courses
// (name only) stay terse while flagship courses pass full content. Defaults
// never fabricate specifics — they read as "available on request".
export function buildCourses(
  departmentSlug: string,
  inputs: CourseInput[]
): Course[] {
  return inputs.map((input) => ({
    slug: input.slug,
    departmentSlug,
    title: input.title,
    seoTitle:
      input.seoTitle ??
      `${input.title} in Sharjah | British Training Institute`,
    seoDescription:
      input.seoDescription ??
      `${input.title} training in Sharjah at British Training Institute — classroom and online options. Speak with admissions for schedules, fees and details.`,
    shortDescription:
      input.shortDescription ??
      `${input.title} training delivered by British Training Institute, Sharjah.`,
    overview:
      input.overview ??
      `${input.title} is offered by British Training Institute in Sharjah, with classroom, live online and corporate in-house options. Speak with admissions for the latest schedule, full course outline, fees and certification details.`,
    durationText: input.durationText ?? "Available on request",
    trainingHours: input.trainingHours ?? "Available on request",
    deliveryMethods: input.deliveryMethods ?? defaultDeliveryMethods,
    learningOutcomes: input.learningOutcomes ?? [],
    targetAudience: input.targetAudience ?? [],
    outline: input.outline ?? [],
    certificationText:
      input.certificationText ??
      "BTI certificate of completion. Speak with admissions about certification and exam pathways.",
    feeText: input.feeText ?? "Contact BTI for current fee details.",
    relatedCourseSlugs: input.relatedCourseSlugs ?? [],
    isFeatured: input.isFeatured ?? false,
    contentStatus: input.contentStatus ?? "outline",
    imageSrc: input.imageSrc,
    imageAlt: input.imageAlt
  }));
}
