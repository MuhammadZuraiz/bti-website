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
  /**
   * Optional course image. Set only when an approved, licensed photo has been
   * added under public/. When unset (the default) the page renders without an
   * image — no placeholder is shown. See src/config/media.ts and
   * docs/bti-intake.md.
   */
  imageSrc?: string;
  imageAlt?: string;
};
