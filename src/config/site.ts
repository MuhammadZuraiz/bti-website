export const siteConfig = {
  businessName: "British Training Institute",
  shortName: "BTI",
  city: "Sharjah",
  area: "Al Shiokh",
  // Confirmed by BTI.
  address:
    "Corniche St, Al Shiokh, Hay Al Gharb, Sharjah, United Arab Emirates",
  landlineDisplay: "+971 6 568 7222",
  landlineHref: "tel:+97165687222",
  mobileDisplay: "+971 52 545 0385",
  mobileHref: "tel:+971525450385",
  tollFreeDisplay: "800 284747",
  tollFreeHref: "tel:800284747",
  whatsappNumber: "971525450385",
  email: "info@britishinstitute.ae",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Confirmed public links — env can override per environment, otherwise these
  // real values render by default.
  mapUrl:
    process.env.NEXT_PUBLIC_MAP_URL ?? "https://maps.app.goo.gl/VsEtaMCcnPVDb99Y6",
  googleBusinessProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL ??
    "https://share.google/klnD7wkVJfpjWuH0v",
  openingHours: [
    "Saturday to Thursday: 9:00 AM – 9:00 PM",
    "Friday: Closed"
  ] as string[],
  parkingNotes: "",
  landmarkNotes: "",
  socialLinks: {
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/british_training.institute",
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/btiuae",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ??
      "https://www.linkedin.com/company/british-training-instiute/"
  },
  metadataImages: {
    openGraph: "/opengraph-image.jpg",
    twitter: "/twitter-image.jpg",
    icon: "/icon.png",
    apple: "/apple-icon.png"
  },
  legalPages: {
    privacy: { state: "draft" },
    cookies: { state: "draft" },
    terms: { state: "draft" },
    accessibility: { state: "published" }
  },
  featureFlags: {
    enableArabic: false,
    // Credibility claims confirmed in writing by BTI.
    showFoundingYearText: true,
    showKeyStats: true,
    showIeltsTestCentre: true,
    showCambridgePartner: true,
    showIsoCertified: true,
    // Text claims are shown, but logo IMAGES stay hidden until BTI provides
    // official files + usage permission.
    showAccreditationLogos: false,
    showPartnerLogos: false,
    showTestimonials: false,
    requireLeadCaptureForDownloads: false,
    // When analytics is configured, also require cookie consent before loading
    // it (shows a consent banner). Decide with BTI — see docs/analytics-events.md.
    requireCookieConsent: false
  }
} as const;

export type SiteConfig = typeof siteConfig;
