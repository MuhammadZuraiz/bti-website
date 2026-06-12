import type { LegalPageKey } from "@/lib/site-utils";

export type LegalPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  sections: { heading: string; body: string }[];
};

export const legalPageContent: Record<LegalPageKey, LegalPageContent> = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Notice",
    description: "Privacy information for British Training Institute enquiries.",
    sections: []
  },
  cookies: {
    eyebrow: "Cookies",
    title: "Cookie Notice",
    description: "Cookie information for the British Training Institute website.",
    sections: []
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms and Conditions",
    description: "Website and enquiry terms for British Training Institute.",
    sections: []
  },
  accessibility: {
    eyebrow: "Accessibility",
    title: "Accessibility Statement",
    description:
      "Accessibility information for the British Training Institute Sharjah website.",
    sections: [
      {
        heading: "Our accessibility approach",
        body:
          "This website is built with semantic page structure, keyboard-accessible navigation, visible focus states, labelled form fields and responsive layouts."
      },
      {
        heading: "Feedback",
        body:
          "If you have difficulty using this website, contact BTI admissions so the team can help you access the information you need."
      }
    ]
  }
};
