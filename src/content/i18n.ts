import type { Locale } from "@/lib/locale";

export const dictionaries = {
  en: {
    languageName: "English",
    nav: {
      courses: "Courses",
      placement: "Placement Test",
      corporate: "Corporate Training",
      about: "About BTI",
      contact: "Contact",
      admissions: "Speak to Admissions",
      menu: "Menu"
    },
    common: {
      skipToContent: "Skip to content",
      browseCourses: "Browse Courses",
      findCourse: "Find the Right Course",
      speakAdmissions: "Speak to Admissions",
      whatsapp: "WhatsApp BTI",
      call: "Call",
      enquire: "Enquire",
      askAdmissions: "Ask Admissions",
      exploreProgramme: "Explore Programme",
      requestGuidance: "Request Course Guidance",
      professionalReview: ""
    },
    home: {
      eyebrow: "Professional Training & Language Education in Sharjah",
      headline:
        "Advance your career with internationally focused training in Sharjah.",
      intro:
        "Established in 2002, British Training Institute delivers IELTS and Cambridge-affiliated English programmes, professional certifications, and corporate training — in the classroom, live online, and in-house.",
      microcopy:
        "Not sure where to begin? Tell us your goal and our admissions team will help you identify the right course and starting point.",
      coursesTitle: "Explore our training departments.",
      coursesIntro:
        "From IELTS and Cambridge English to project management, finance, engineering, IT and quality — explore departments and speak with admissions for schedules and availability.",
      transformationTitle: "Move from uncertainty to a clear learning plan.",
      featuredTitle: "Popular ways to get started.",
      journeyTitle: "A simpler way to find your next course.",
      placementTitle: "Not sure which English level is right for you?",
      placementCopy:
        "Request a placement-test conversation and let the admissions team guide you toward a suitable starting point.",
      corporateTitle:
        "Build a stronger team with training shaped around your goals.",
      corporateCopy:
        "Explore professional and skills-based training options for organisations, teams, and institutions. Tell BTI what your team needs and request a tailored conversation.",
      resourcesTitle: "Start with a helpful guide.",
      faqTitle: "Questions learners often ask.",
      finalTitle: "Need help choosing the right course?",
      finalCopy:
        "BTI's admissions team can guide you through course options, entry requirements, schedules, and the best path for your goals.",
      finalPoints: [
        "Free course guidance",
        "Quick response on WhatsApp",
        "Help with admissions and course options"
      ],
      finalActionLabel: "Ready to talk?",
      finalNote: "Free course guidance before you apply."
    }
  },
  ar: {
    languageName: "العربية",
    nav: {
      courses: "الدورات",
      placement: "اختبار تحديد المستوى",
      corporate: "تدريب الشركات",
      about: "عن BTI",
      contact: "اتصل بنا",
      admissions: "تحدث مع القبول",
      menu: "القائمة"
    },
    common: {
      skipToContent: "انتقل إلى المحتوى",
      browseCourses: "تصفح الدورات",
      findCourse: "اختر الدورة المناسبة",
      speakAdmissions: "تحدث مع القبول",
      whatsapp: "واتساب BTI",
      call: "اتصال",
      enquire: "استفسار",
      askAdmissions: "اسأل القبول",
      exploreProgramme: "استكشف البرنامج",
      requestGuidance: "اطلب إرشاد الدورة",
      professionalReview: ""
    },
    home: {
      eyebrow: "تدريب مهني في الشارقة",
      headline: "طوّر مهارات عملية واتخذ خطوتك التالية بثقة.",
      intro:
        "استكشف خيارات اللغة الإنجليزية، التحضير للآيلتس، الأعمال، المحاسبة، الموارد البشرية، والتدريب المهني مع دعم يساعدك على اختيار مسار أوضح.",
      microcopy:
        "لست متأكدا من البداية؟ أخبر فريق القبول بهدفك ليساعدك في تحديد نقطة انطلاق مناسبة.",
      coursesTitle: "ابدأ بالمهارة التي تريد تطويرها.",
      coursesIntro:
        "قارن خيارات التدريب، واستكشف النتائج العملية، وتواصل مع القبول لمعرفة الجداول والتوفر الحالي.",
      transformationTitle: "انتقل من الحيرة إلى خطة تعلم أوضح.",
      featuredTitle: "طرق شائعة للبدء.",
      journeyTitle: "طريقة أبسط لاختيار دورتك التالية.",
      placementTitle: "لست متأكدا من مستوى اللغة الإنجليزية المناسب؟",
      placementCopy:
        "اطلب محادثة حول تحديد المستوى ليساعدك فريق القبول في اختيار نقطة بداية مناسبة.",
      corporateTitle: "طوّر فريقك بتدريب يتوافق مع أهداف العمل.",
      corporateCopy:
        "استكشف خيارات تدريب مهني ومهاري للمؤسسات والفرق. أخبر BTI بما يحتاجه فريقك واطلب محادثة مخصصة.",
      resourcesTitle: "ابدأ بدليل مفيد.",
      faqTitle: "أسئلة شائعة من المتعلمين.",
      finalTitle: "هل تحتاج مساعدة في اختيار الدورة المناسبة؟",
      finalCopy:
        "يمكن لفريق القبول في BTI إرشادك حول خيارات الدورات ومتطلبات الالتحاق والجداول وأفضل مسار يناسب أهدافك.",
      finalPoints: [
        "إرشاد مجاني حول الدورات",
        "رد سريع عبر واتساب",
        "مساعدة في القبول وخيارات الدورات"
      ],
      finalActionLabel: "هل أنت مستعد للحديث؟",
      finalNote: "إرشاد مجاني حول الدورات قبل التقديم."
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
