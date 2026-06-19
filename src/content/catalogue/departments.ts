import type { Department } from "@/types/catalogue";

// Department display order + metadata. Slugs form the first URL segment:
// /courses/<department>/<course>.
export const departments: Department[] = [
  {
    slug: "languages",
    name: "Languages",
    title: "Language Training & IELTS Test Centre in Sharjah",
    seoTitle: "English Language Courses & IELTS in Sharjah | British Training Institute",
    seoDescription:
      "English language training and IELTS Test Centre services in Sharjah — General English, Business English, IELTS, TOEFL, CELTA and DELTA preparation.",
    shortDescription:
      "English language excellence — IELTS Test Centre, Cambridge-affiliated and professional English programmes.",
    overview:
      "British Training Institute is an IELTS Test Centre and Cambridge-affiliated language provider, offering General, Business and Academic English alongside IELTS, TOEFL, CELTA and DELTA preparation.",
    icon: "languages",
    order: 1,
    isFeatured: true
  },
  {
    slug: "business-management",
    name: "Business & Management",
    title: "Business & Management Training in Sharjah",
    seoTitle: "Business & Management Training in Sharjah | British Training Institute",
    seoDescription:
      "Business and management training in Sharjah — leadership, strategy, executive development, customer service and business communication.",
    shortDescription:
      "Leadership, strategy, executive development and business communication programmes.",
    overview:
      "Practical business and management programmes that build leadership, strategy, communication and operational capability for professionals and teams.",
    icon: "briefcase",
    order: 2,
    isFeatured: true
  },
  {
    slug: "project-management",
    name: "Project Management",
    title: "Project Management Training in Sharjah",
    seoTitle: "Project Management Training (PMP, PRINCE2, Agile) in Sharjah | BTI",
    seoDescription:
      "Project management training in Sharjah — PMP, CAPM, PRINCE2, Agile, risk management and project planning & scheduling.",
    shortDescription:
      "PMP, CAPM, PRINCE2, Agile and project controls certifications and skills.",
    overview:
      "Internationally recognised project management certifications and skills, from PMP and CAPM to PRINCE2, Agile and project controls.",
    icon: "clipboard",
    order: 3,
    isFeatured: true
  },
  {
    slug: "human-resources",
    name: "Human Resources",
    title: "Human Resources Training in Sharjah",
    seoTitle: "HR Training & Certifications in Sharjah | British Training Institute",
    seoDescription:
      "Human resources training in Sharjah — HR management, recruitment, employee relations, L&D, HR analytics and strategic HR.",
    shortDescription:
      "HR management, recruitment, L&D, analytics and strategic HR programmes.",
    overview:
      "Human resources programmes covering the full employee lifecycle — from recruitment and employee relations to learning & development, analytics and strategic HR.",
    icon: "users",
    order: 4,
    isFeatured: false
  },
  {
    slug: "accounting-finance",
    name: "Accounting & Finance",
    title: "Accounting & Finance Training in Sharjah",
    seoTitle: "Accounting & Finance Training (CMA, ACCA, CPA, IFRS) in Sharjah | BTI",
    seoDescription:
      "Accounting and finance training in Sharjah — CMA, ACCA, CPA, IFRS, VAT, financial analysis, auditing and budgeting.",
    shortDescription:
      "CMA, ACCA, CPA, IFRS, VAT and core accounting and finance skills.",
    overview:
      "Accounting and finance training from core financial skills to international certifications including CMA, ACCA, CPA, IFRS and VAT.",
    icon: "calculator",
    order: 5,
    isFeatured: true
  },
  {
    slug: "quality-operational-excellence",
    name: "Quality & Operational Excellence",
    title: "Quality & Operational Excellence Training in Sharjah",
    seoTitle: "Six Sigma, Lean & Quality Training in Sharjah | British Training Institute",
    seoDescription:
      "Quality and operational excellence training in Sharjah — Six Sigma (Yellow/Green/Black Belt), Lean, TQM, quality assurance and ISO.",
    shortDescription:
      "Six Sigma, Lean, TQM, quality assurance and ISO implementation programmes.",
    overview:
      "Quality and operational excellence programmes including Six Sigma belts, Lean management, total quality management and ISO implementation.",
    icon: "shield",
    order: 6,
    isFeatured: false
  },
  {
    slug: "engineering",
    name: "Engineering",
    title: "Engineering Training in Sharjah",
    seoTitle: "Engineering Training in Sharjah | British Training Institute",
    seoDescription:
      "Engineering training in Sharjah — civil, mechanical, electrical, construction management, quantity surveying and health & safety.",
    shortDescription:
      "Civil, mechanical, electrical, construction management and HSE programmes.",
    overview:
      "Engineering programmes spanning civil, mechanical and electrical disciplines, construction management, quantity surveying and health & safety.",
    icon: "landmark",
    order: 7,
    isFeatured: false
  },
  {
    slug: "engineering-software-design",
    name: "Engineering Software & Design",
    title: "Engineering Software & Design Training in Sharjah",
    seoTitle: "AutoCAD, Revit & Primavera Training in Sharjah | British Training Institute",
    seoDescription:
      "Engineering software training in Sharjah — AutoCAD, Revit, Primavera P6, SolidWorks, ETABS, STAAD Pro and BIM.",
    shortDescription:
      "AutoCAD, Revit, Primavera P6, SolidWorks, ETABS, STAAD Pro and BIM.",
    overview:
      "Hands-on engineering software and design training across AutoCAD, Revit, Primavera P6, SolidWorks, ETABS, STAAD Pro and BIM.",
    icon: "laptop",
    order: 8,
    isFeatured: false
  },
  {
    slug: "information-technology",
    name: "Information Technology & Programming",
    title: "IT & Programming Training in Sharjah",
    seoTitle: "IT & Programming Training (Python, AI, Cybersecurity) in Sharjah | BTI",
    seoDescription:
      "Information technology and programming training in Sharjah — Python, web development, data analysis, AI, cybersecurity and advanced Excel.",
    shortDescription:
      "Python, web development, data analysis, AI, cybersecurity and Excel.",
    overview:
      "Information technology and programming training from Python and web development to data analysis, AI, cybersecurity and advanced Excel.",
    icon: "laptop",
    order: 9,
    isFeatured: true
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    title: "Digital Marketing Training in Sharjah",
    seoTitle: "Digital Marketing Training (SEO, Google Ads) in Sharjah | BTI",
    seoDescription:
      "Digital marketing training in Sharjah — SEO, social media marketing, Google Ads, content marketing, branding and marketing analytics.",
    shortDescription:
      "SEO, social media, Google Ads, content, branding and analytics.",
    overview:
      "Digital marketing programmes covering SEO, social media, paid advertising, content, branding and marketing analytics.",
    icon: "sparkles",
    order: 10,
    isFeatured: false
  },
  {
    slug: "medical-healthcare",
    name: "Medical & Healthcare",
    title: "Medical & Healthcare Training in Sharjah",
    seoTitle: "Medical & Healthcare Training in Sharjah | British Training Institute",
    seoDescription:
      "Medical and healthcare training in Sharjah — healthcare administration, medical coding, healthcare quality and professional development.",
    shortDescription:
      "Healthcare administration, medical coding, healthcare quality and more.",
    overview:
      "Medical and healthcare programmes including healthcare administration, medical coding, healthcare quality management and professional development.",
    icon: "stethoscope",
    order: 11,
    isFeatured: false
  }
];
