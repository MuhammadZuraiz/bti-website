import type { Course } from "@/types/catalogue";

// Single source of truth for the imagery the site can use. Images are OPTIONAL:
// nothing here ships a placeholder. A slot only appears once an approved,
// licensed file is dropped at the documented path (and, for courses, the course
// entry sets imageSrc). See docs/bti-intake.md and docs/image-shot-list.md.

export type MediaSlot = {
  id: string;
  /** Public path the file should be placed at. */
  path: string;
  /** Minimum recommended dimensions. */
  dimensions: string;
  /** What the image should depict + alt-text guidance. */
  description: string;
  priority: "high" | "medium";
};

export const mediaSlots: MediaSlot[] = [
  {
    id: "home-hero",
    path: "public/images/hero-training.jpg",
    dimensions: "1800x1200",
    description:
      "Real BTI training or admissions scene for the homepage hero. Consent + licensing required.",
    priority: "high"
  },
  {
    id: "about-location",
    path: "public/images/about-location.jpg",
    dimensions: "1600x1000",
    description:
      "BTI reception or training-room photo for the About page. Alt text should describe the real space.",
    priority: "high"
  },
  {
    id: "contact-location",
    path: "public/images/contact-location.jpg",
    dimensions: "1600x1000",
    description: "Exterior or entrance photo to help visitors recognise the location.",
    priority: "medium"
  },
  {
    id: "corporate-training",
    path: "public/images/corporate-training.jpg",
    dimensions: "1600x1000",
    description: "Workplace/team training scene for the corporate page.",
    priority: "medium"
  }
];

// Course images follow the convention public/images/courses/<slug>.(jpg|webp)
// but are opt-in: a course renders an image only when its entry sets imageSrc.
export function courseImagePathHint(slug: string): string {
  return `public/images/courses/${slug}.jpg`;
}

export function resolveCourseImage(
  course: Pick<Course, "slug" | "title" | "imageSrc" | "imageAlt">
): { src: string; alt: string } | null {
  if (!course.imageSrc) {
    return null;
  }
  return {
    src: course.imageSrc,
    alt: course.imageAlt ?? `${course.title} at British Training Institute Sharjah`
  };
}
