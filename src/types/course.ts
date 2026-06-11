export type Course = {
  slug: string;
  category: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  overview: string;
  audience: string[];
  outcomes: string[];
  deliveryModes: string[];
  durationText?: string;
  scheduleText?: string;
  feeText?: string;
  certificateText?: string;
  faq: { question: string; answer: string }[];
  relatedCourseSlugs: string[];
  isFeatured: boolean;
};
