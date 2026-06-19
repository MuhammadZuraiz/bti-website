import { buildCourses } from "./_builder";

const deliveryAll = ["Classroom", "Live Online", "One-to-One", "Corporate In-House", "Hybrid"];

export const languagesCourses = buildCourses("languages", [
  {
    slug: "ielts-preparation",
    title: "IELTS Preparation",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Structured Academic & General Training IELTS preparation at BTI's IELTS Test Centre.",
    seoDescription:
      "IELTS preparation in Sharjah at British Training Institute's IELTS Test Centre — Academic and General Training, mock tests, speaking practice and intensive options.",
    overview:
      "British Training Institute is an IELTS Test Centre, offering structured preparation for both the Academic and General Training modules. Sessions build skills across listening, reading, writing and speaking with realistic practice, feedback, and mock tests. Classroom, live online, intensive and private coaching options are available.",
    durationText: "Flexible — standard and intensive tracks available",
    trainingHours: "Typically 30–60 hours depending on the track",
    deliveryMethods: deliveryAll,
    learningOutcomes: [
      "Understand the format and scoring of all four IELTS sections",
      "Develop exam strategies for listening, reading, writing and speaking",
      "Practise under timed, exam-realistic conditions with feedback",
      "Identify a target band and the steps to work toward it"
    ],
    targetAudience: [
      "University and migration applicants",
      "Professionals needing an English benchmark",
      "Learners retaking IELTS for a higher band"
    ],
    outline: [
      "IELTS overview, band scores and module choice (Academic vs General Training)",
      "Listening: question types, note-taking and timing",
      "Reading: skimming, scanning and accuracy under time",
      "Writing Task 1 & 2: structure, cohesion and assessment criteria",
      "Speaking: fluency, range and the three-part interview",
      "Full mock tests with individual feedback"
    ],
    certificationText:
      "BTI preparation certificate. IELTS is booked and sat through official test arrangements — admissions can advise on registration.",
    relatedCourseSlugs: ["general-english", "academic-english", "toefl-preparation"]
  },
  {
    slug: "general-english",
    title: "General English",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Build everyday English across speaking, listening, reading and writing at the right level.",
    overview:
      "A practical General English programme that strengthens everyday communication across speaking, listening, reading and writing. Learners are placed at a suitable level and progress through clear, structured stages with experienced trainers.",
    durationText: "By level; multiple intakes",
    trainingHours: "Typically 40–60 hours per level",
    deliveryMethods: deliveryAll,
    learningOutcomes: [
      "Communicate with more confidence in everyday situations",
      "Strengthen grammar, vocabulary and pronunciation",
      "Improve listening and reading comprehension",
      "Progress toward the next English level"
    ],
    targetAudience: ["Adult learners", "Students", "Working professionals"],
    outline: [
      "Placement and level setting",
      "Core grammar and high-frequency vocabulary",
      "Speaking and listening practice",
      "Reading and writing for everyday contexts",
      "Progress review and next-level guidance"
    ],
    relatedCourseSlugs: ["spoken-english", "business-english", "ielts-preparation"]
  },
  {
    slug: "business-english",
    title: "Business English",
    isFeatured: true,
    contentStatus: "complete",
    shortDescription:
      "Professional English for meetings, email, presentations and workplace communication.",
    overview:
      "Business English develops the language and confidence professionals need for meetings, presentations, email, negotiation and day-to-day workplace communication. Content can be tailored for corporate groups.",
    durationText: "Flexible; corporate cohorts available",
    trainingHours: "Typically 30–40 hours",
    deliveryMethods: deliveryAll,
    learningOutcomes: [
      "Communicate clearly in meetings and presentations",
      "Write professional emails and documents",
      "Build vocabulary for negotiation and networking",
      "Project confidence in workplace interactions"
    ],
    targetAudience: ["Working professionals", "Managers", "Corporate teams"],
    outline: [
      "Professional communication foundations",
      "Email and business writing",
      "Meetings, calls and presentations",
      "Negotiation and networking language",
      "Workplace scenarios and role-play"
    ],
    relatedCourseSlugs: ["general-english", "english-for-professionals", "corporate-english"]
  },
  { slug: "spoken-english", title: "Spoken English", relatedCourseSlugs: ["general-english", "english-communication-skills"] },
  { slug: "academic-english", title: "Academic English", relatedCourseSlugs: ["ielts-preparation", "toefl-preparation"] },
  { slug: "english-communication-skills", title: "English Communication Skills", relatedCourseSlugs: ["spoken-english", "business-english"] },
  { slug: "toefl-preparation", title: "TOEFL Preparation", relatedCourseSlugs: ["ielts-preparation", "academic-english"] },
  { slug: "celta-preparation", title: "CELTA Preparation", relatedCourseSlugs: ["delta-preparation", "general-english"] },
  { slug: "delta-preparation", title: "DELTA Preparation", relatedCourseSlugs: ["celta-preparation"] },
  { slug: "english-for-professionals", title: "English for Professionals", relatedCourseSlugs: ["business-english", "corporate-english"] },
  { slug: "corporate-english", title: "Corporate English Programs", relatedCourseSlugs: ["business-english", "english-for-professionals"] },
  { slug: "ielts-registration-support", title: "IELTS Test Registration Support", relatedCourseSlugs: ["ielts-preparation"] },
  { slug: "ielts-speaking-practice", title: "IELTS Speaking Practice", relatedCourseSlugs: ["ielts-preparation"] },
  { slug: "ielts-mock-tests", title: "IELTS Mock Tests", relatedCourseSlugs: ["ielts-preparation"] },
  { slug: "intensive-ielts", title: "Intensive IELTS Programme", relatedCourseSlugs: ["ielts-preparation"] },
  { slug: "private-ielts-coaching", title: "Private IELTS Coaching", relatedCourseSlugs: ["ielts-preparation"] }
]);
