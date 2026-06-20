import { siteConfig } from "@/config/site";

// Single source for the homepage FAQ — feeds both the accordion UI
// (sections/home-faq.tsx) and the faqSchema JSON-LD on the homepage.
export type FaqItem = { question: string; answer: string };

export const homeFaq: FaqItem[] = [
  {
    question: "Which course should I choose?",
    answer:
      "Start with your goal and current level. Admissions can help you compare suitable options before you enrol."
  },
  {
    question: "How can I ask about schedules?",
    answer:
      "Use the enquiry form, phone, or WhatsApp to ask admissions for the latest schedule and availability."
  },
  {
    question: "Can I request a placement test?",
    answer:
      "Yes. Submit a placement-test request and wait for admissions to confirm the next step."
  },
  {
    question: "Are corporate training options available?",
    answer:
      "Yes. Organisations can request a conversation about training areas, learner numbers, and delivery mode."
  },
  {
    question: "How do I enquire about course fees?",
    answer:
      "Contact BTI admissions for current fee details and available options."
  },
  {
    question: "Where is BTI located in Sharjah?",
    answer: `BTI is a ${siteConfig.city}-based training centre in ${siteConfig.area}. Confirm directions before visiting.`
  }
];
