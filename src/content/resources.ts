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
    fileUrl: "#",
    isAvailable: true,
    requiresLeadCapture: false
  },
  {
    slug: "ielts-preparation-checklist",
    title: "IELTS Preparation Checklist",
    description:
      "A simple checklist to help IELTS candidates organise their next preparation steps.",
    fileUrl: "#",
    isAvailable: true,
    requiresLeadCapture: false
  },
  {
    slug: "corporate-training-profile",
    title: "Corporate Training Profile",
    description:
      "A placeholder corporate profile for teams that want to discuss training requirements.",
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
    fileUrl: "#",
    isAvailable: true,
    requiresLeadCapture: false
  }
];
