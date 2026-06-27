// Two-level training catalogue: Department → Course. Content-as-data; one
// source of truth drives the web pages and the PDF brochures.

export type Department = {
  slug: string;
  /** Short display name, e.g. "Languages". */
  name: string;
  /** Page H1 / longer title. */
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** One-line summary for cards. */
  shortDescription: string;
  overview: string;
  /** Lucide icon key (see departmentIcon map in the page). */
  icon: string;
  order: number;
  isFeatured: boolean;
};

export type CourseContentStatus = "complete" | "outline";

export type Course = {
  slug: string;
  departmentSlug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  overview: string;
  durationText: string;
  trainingHours: string;
  deliveryMethods: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  /** Detailed course outline (modules/topics). */
  outline: string[];
  certificationText: string;
  feeText: string;
  relatedCourseSlugs: string[];
  isFeatured: boolean;
  /** "complete" = full BTI content; "outline" = name + neutral placeholders. */
  contentStatus: CourseContentStatus;
  imageSrc?: string;
  imageAlt?: string;
};
