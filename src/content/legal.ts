import type { LegalPageKey } from "@/lib/site-utils";

export type LegalPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  sections: { heading: string; body: string }[];
};

export const legalPageContent: Record<LegalPageKey, LegalPageContent> = {
  // NOTE (internal): privacy/cookies/terms below are accurate DRAFT copy that
  // reflects how the site actually handles data. They remain gated as
  // legalPages.*.state = "draft" (and return 404) until BTI/legal review and
  // approve them, then flip the flag to "published". See docs/legal-review.md.
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Notice",
    description: "How British Training Institute handles information you share through this website.",
    sections: [
      {
        heading: "About this notice",
        body:
          "This notice explains what information British Training Institute (BTI) collects when you use this website or send an enquiry, how that information is used, and the choices you have. It applies to this website only."
      },
      {
        heading: "Information we collect",
        body:
          "When you submit an enquiry form we collect the details you provide: your name, the phone number and/or email address you choose to share, your preferred contact method, and your message. Depending on the form this may also include the course or resource you are interested in, and, for corporate enquiries, your company name, job title, number of learners and training area. We also record basic context such as the page you enquired from, the website language, and marketing campaign parameters (UTM tags) when present."
      },
      {
        heading: "Technical information",
        body:
          "To protect the forms from abuse we process limited technical signals, such as a one-way hashed version of your network address, used only to apply rate limits. We do not store your raw IP address. Bot-protection (Cloudflare Turnstile) may run security checks when you submit a form."
      },
      {
        heading: "How we use your information",
        body:
          "We use the information you provide to respond to your enquiry, advise you on suitable courses, arrange placement-test or corporate-training conversations, and follow up about your request. Submitting a form is an enquiry, not a confirmed booking or enrolment."
      },
      {
        heading: "Consent",
        body:
          "We ask you to confirm, when you submit a form, that BTI may contact you about your enquiry. You can withdraw consent or ask us to stop contacting you at any time by replying to our contact or reaching the admissions team."
      },
      {
        heading: "How your information is stored and shared",
        body:
          "Enquiries are stored securely in our database and may be delivered to the admissions and customer-relationship tools BTI uses to manage follow-up. We share information only with service providers that help us operate the website and respond to enquiries, and only as needed for those purposes. We do not sell your information."
      },
      {
        heading: "How long we keep your information",
        body:
          "We keep enquiry information for as long as needed to respond to and follow up on your request, and as required to meet our legal and operational obligations, after which it is removed or anonymised."
      },
      {
        heading: "Keeping your information secure",
        body:
          "Access to enquiry data is restricted to authorised staff, transmitted over encrypted connections, and protected by spam and rate-limiting controls. No system can be guaranteed perfectly secure, but we take reasonable measures to protect your information."
      },
      {
        heading: "Your rights",
        body:
          "You can ask to access, correct or delete the information you have shared with us, or ask us to stop contacting you. To make a request, contact the BTI admissions team using the details on our contact page."
      },
      {
        heading: "Cookies",
        body:
          "This website uses only the cookies needed to operate and protect it unless you agree to optional analytics. See our cookie information for details."
      },
      {
        heading: "Changes to this notice",
        body:
          "We may update this notice as our services or legal obligations change. The latest version will always appear on this page."
      },
      {
        heading: "Contact us",
        body:
          "For any question about this notice or your information, contact the BTI admissions team using the details on our contact page."
      }
    ]
  },
  cookies: {
    eyebrow: "Cookies",
    title: "Cookie Notice",
    description: "How British Training Institute uses cookies on this website.",
    sections: [
      {
        heading: "About cookies",
        body:
          "Cookies are small files a website can store on your device. This website is designed to use as few cookies as possible and does not load tracking or advertising cookies by default."
      },
      {
        heading: "Essential functionality",
        body:
          "Some cookies or similar storage are needed for the website to work and to keep enquiry forms secure, including the bot-protection check (Cloudflare Turnstile) that runs when you submit a form. These cannot be switched off without affecting how the site works."
      },
      {
        heading: "Optional analytics",
        body:
          "If BTI enables website analytics, analytics cookies are used only after you agree through the cookie banner, and they help us understand how the website is used so we can improve it. You can decline without affecting your ability to use the site or send an enquiry."
      },
      {
        heading: "Managing cookies",
        body:
          "You can control or delete cookies through your browser settings. Removing essential cookies may affect how parts of the website function."
      },
      {
        heading: "Contact us",
        body:
          "For any question about cookies, contact the BTI admissions team using the details on our contact page."
      }
    ]
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms and Conditions",
    description: "Terms for using the British Training Institute website and enquiry forms.",
    sections: [
      {
        heading: "About these terms",
        body:
          "These terms apply to your use of the British Training Institute (BTI) website. By using this website you agree to these terms."
      },
      {
        heading: "Using this website",
        body:
          "You may use this website to learn about BTI's courses and services and to send genuine enquiries. You agree not to misuse the website, submit false or abusive information, or attempt to disrupt its operation or security."
      },
      {
        heading: "Enquiries and bookings",
        body:
          "Submitting a form is an enquiry only. It does not create a confirmed booking, seat, schedule or enrolment. A place is confirmed only after the BTI admissions team responds and any required steps are completed."
      },
      {
        heading: "Course information",
        body:
          "Course descriptions, availability, schedules, fees and outcomes may change and are confirmed by the admissions team. Please contact BTI for the latest details before making a decision."
      },
      {
        heading: "Intellectual property",
        body:
          "The content, branding and design of this website belong to BTI or its licensors and may not be copied or reused without permission."
      },
      {
        heading: "External links",
        body:
          "This website may link to other websites that BTI does not control. We are not responsible for the content or practices of those websites."
      },
      {
        heading: "Availability and liability",
        body:
          "We aim to keep this website available and accurate but provide it on an as-is basis. To the extent permitted by law, BTI is not liable for losses arising from reliance on website content or from interruptions to the service."
      },
      {
        heading: "Governing law",
        body:
          "These terms are governed by the laws applicable in the Emirate of Sharjah and the United Arab Emirates."
      },
      {
        heading: "Contact us",
        body:
          "For any question about these terms, contact the BTI admissions team using the details on our contact page."
      }
    ]
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
