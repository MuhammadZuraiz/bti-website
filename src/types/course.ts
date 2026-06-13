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
  /**
   * ISO date of the last business content review. Only set when BTI has
   * actually reviewed the page — never fabricate this to populate the
   * sitemap. Omitted dates simply leave lastModified out of the sitemap.
   */
  lastReviewedAt?: string;
};
