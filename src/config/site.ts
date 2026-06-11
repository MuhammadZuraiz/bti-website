export const siteConfig = {
  businessName: "British Training Institute",
  shortName: "BTI",
  city: "Sharjah",
  area: "Al Meraijah",
  // Must be approved by BTI before production publishing.
  address:
    "Bank Street, CB Building, Apartments 303-304, Al Meraijah, Sharjah, UAE",
  // Must be approved by BTI before production publishing.
  landlineDisplay: "06 568 7222",
  landlineHref: "tel:+97165687222",
  // Must be approved by BTI before production publishing.
  mobileDisplay: "+971 52 608 3950",
  mobileHref: "tel:+971526083950",
  whatsappNumber: "971526083950", // Verify before production.
  email: "info@britain-institute.com", // Confirm canonical email before production.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  mapUrl: process.env.NEXT_PUBLIC_MAP_URL ?? "#",
  googleBusinessProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL ?? "#",
  socialLinks: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "#"
  },
  featureFlags: {
    showSpeaListing: false,
    showCentreId: false,
    showIeltsVenueStatement: false,
    showFoundingYearText: false,
    showGraduateCount: false,
    showTestimonials: false,
    showAccreditationLogos: false,
    showPartnerLogos: false,
    requireLeadCaptureForDownloads: false
  }
} as const;

export type SiteConfig = typeof siteConfig;
