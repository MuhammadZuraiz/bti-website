import { getCourseBySlug } from "@/content/catalogue";
import { getResourceBySlug } from "@/content/resources";

type QueryValue = string | string[] | undefined;

function firstValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function getContactContext(
  searchParams: Record<string, QueryValue>
) {
  const courseSlug = firstValue(searchParams.course);
  const resourceSlug = firstValue(searchParams.resource);
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  const resource = resourceSlug ? getResourceBySlug(resourceSlug) : undefined;

  if (course) {
    return {
      kind: "course" as const,
      title: `Ask about ${course.title}`,
      formTitle: `Register for ${course.title}`,
      submitLabel: "Ask Admissions",
      courseInterest: course.title,
      courseSlug: course.slug,
      resourceInterest: "",
      resourceSlug: ""
    };
  }

  if (resource) {
    return {
      kind: "resource" as const,
      title: `Request ${resource.title}`,
      formTitle: `Request the ${resource.title}`,
      submitLabel: "Request Guide",
      courseInterest: "",
      courseSlug: "",
      resourceInterest: resource.title,
      resourceSlug: resource.slug
    };
  }

  return {
    kind: "general" as const,
    title: "Send an admission enquiry",
    formTitle: "Send an admission enquiry",
    submitLabel: "Send Admission Enquiry",
    courseInterest: "",
    courseSlug: "",
    resourceInterest: "",
    resourceSlug: ""
  };
}
