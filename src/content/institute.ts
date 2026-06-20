// Institutional content, confirmed in writing by BTI. English-only source
// (kept out of the bilingual UI dictionary). Update here when BTI revises copy.

export const foundingYear = 2002;

export const aboutParagraphs = [
  "Established in 2002, British Training Institute is one of the UAE's leading professional training and language education providers, delivering internationally focused learning solutions for individuals, professionals, corporate clients, and organizations.",
  "For more than two decades, we have been committed to providing high-quality professional training, international exam preparation, language education, and career development programs designed to meet the demands of today's competitive global marketplace.",
  "British Training Institute offers classroom training, live online training, and customized corporate learning solutions across a wide range of professional and technical disciplines."
];

export const mission =
  "To empower individuals and organizations through world-class education, professional training, and internationally aligned learning experiences that support career growth, professional excellence, and lifelong learning.";

export const vision =
  "To become one of the region's most respected professional training institutions, recognized for excellence in language education, professional certifications, workforce development, and international training standards.";

export const whyChoose = [
  "Established in 2002",
  "Over 20 years of excellence",
  "IELTS Test Centre",
  "Cambridge-affiliated training programs",
  "Cambridge English preparation partner",
  "ISO certified quality management system",
  "Licensed and regulated by the relevant educational authorities in Sharjah, UAE",
  "Professional trainers with internationally recognized credentials",
  "Classroom, online, and corporate training solutions",
  "Career-focused practical learning approach",
  "International certification pathways"
] as const;

export type KeyStat = { value: string; label: string };

export const keyStats: KeyStat[] = [
  { value: "20+", label: "Years of experience" },
  { value: "10,000+", label: "Learners trained" },
  { value: "100+", label: "Professional courses" },
  { value: "500+", label: "Corporate clients" }
];

export const deliveryMethods = [
  "Classroom Training",
  "Live Online Training",
  "One-to-One Coaching",
  "Corporate In-House Training",
  "Hybrid Learning Solutions"
] as const;

export type Accreditation = {
  name: string;
  description: string;
  /** Logo image path under public/, rendered only when the file exists. */
  logoSrc?: string;
};

// Text claims confirmed by BTI. Logo image files are pending; until provided,
// each card renders as text only (no third-party logos are fabricated).
export const accreditations: Accreditation[] = [
  {
    name: "IELTS Test Centre",
    description:
      "British Training Institute supports IELTS candidates with registration guidance, preparation, and test-centre services."
  },
  {
    name: "Cambridge-affiliated Training",
    description:
      "Cambridge-affiliated training programs and Cambridge English exam preparation pathways."
  },
  {
    name: "ISO Certified Quality Management",
    description:
      "Training delivery operates under an ISO certified quality management system."
  },
  {
    name: "Licensed & Regulated",
    description:
      "Licensed and regulated by the relevant educational authorities in Sharjah, UAE."
  }
];

// Homepage marketing copy for the redesigned sections. English-only (Arabic
// stays gated); kept here so the section components hold no hardcoded strings.
export const homeMarketing = {
  hero: {
    badge: "British Training Institute · Sharjah",
    // Compact proof points shown beneath the hero CTAs.
    stats: [
      { value: "20+", label: "Years" },
      { value: "10,000+", label: "Learners" },
      { value: "100+", label: "Courses" }
    ]
  },
  // Floating decorative cards in the hero (aria-hidden; the real list is below).
  heroCards: [
    { title: "Languages & IELTS", note: "English, IELTS & Cambridge prep" },
    { title: "Professional certifications", note: "PMP, ACCA, HR, Six Sigma" },
    { title: "Corporate training", note: "Tailored in-house programmes" }
  ],
  corporate: {
    eyebrow: "Corporate training",
    points: [
      "Training shaped around your team's goals and skill gaps",
      "Classroom, live online, or in-house at your premises",
      "Language, professional, technical and certification tracks"
    ],
    stats: [
      { value: "500+", label: "Corporate clients" },
      { value: "100+", label: "Professional courses" },
      { value: "20+", label: "Years of delivery" }
    ]
  },
  placement: {
    eyebrow: "Placement test",
    steps: [
      {
        title: "Request a placement test",
        copy: "Tell admissions your goal and your current level."
      },
      {
        title: "Take a short assessment",
        copy: "Admissions confirm the format and timing with you."
      },
      {
        title: "Start at the right level",
        copy: "Begin a programme matched to your result."
      }
    ]
  },
  journey: {
    eyebrow: "Admissions journey",
    intro:
      "Browse courses based on the skills you want to build, ask about current schedules and availability, then confirm the right next step with admissions.",
    steps: [
      {
        title: "Explore your options",
        copy: "Browse courses based on the skills you want to build."
      },
      {
        title: "Speak with admissions",
        copy: "Ask about current schedules, availability, and the most suitable starting point."
      },
      {
        title: "Begin your learning plan",
        copy: "Confirm your preferred programme and take your next step with confidence."
      }
    ]
  },
  explorer: {
    eyebrow: "Course finder",
    searchPlaceholder: "Search courses, e.g. IELTS, PMP, accounting…",
    allLabel: "All departments",
    emptyTitle: "No matching courses yet.",
    emptyCopy:
      "Try a different keyword or department, or ask admissions to point you to the right programme.",
    viewAllLabel: "Browse all courses"
  },
  finalNote:
    "Free course guidance before you apply. Admissions usually reply within working hours."
} as const;
