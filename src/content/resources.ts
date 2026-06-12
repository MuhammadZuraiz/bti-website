export type Resource = {
  slug: string;
  title: string;
  description: string;
  fileUrl?: string;
  isAvailable: boolean;
  requiresLeadCapture: boolean;
};

export const resources: Resource[] = [
  {
    slug: "english-course-guide",
    title: "English Course Guide",
    description:
      "A practical guide for choosing an English-learning path and preparing for admissions guidance.",
    isAvailable: true,
    requiresLeadCapture: false
  },
  {
    slug: "ielts-preparation-checklist",
    title: "IELTS Preparation Checklist",
    description:
      "A simple checklist to help IELTS candidates organise their next preparation steps.",
    isAvailable: true,
    requiresLeadCapture: false
  },
  {
    slug: "corporate-training-profile",
    title: "Corporate Training Profile",
    description:
      "A corporate training overview that admissions can share when the current profile is available.",
    isAvailable: false,
    requiresLeadCapture: false
  },
  {
    slug: "professional-courses-overview",
    title: "Professional Courses Overview",
    description:
      "A concise overview of professional programme categories available for enquiry.",
    isAvailable: false,
    requiresLeadCapture: false
  },
  {
    slug: "questions-before-choosing-training-course",
    title: "Questions to Ask Before Choosing a Training Course",
    description:
      "A decision checklist for learners comparing training centres and course options.",
    isAvailable: true,
    requiresLeadCapture: false
  }
];

export function getResourceBySlug(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
