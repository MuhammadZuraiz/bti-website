import type { LeadType } from "@/lib/lead-schema";
import type { AnalyticsEvent } from "@/lib/analytics";

export const confirmedEventByLeadType: Record<LeadType, AnalyticsEvent> = {
  "general-enquiry": "general_enquiry_confirmed",
  "course-enquiry": "course_enquiry_confirmed",
  "placement-test-request": "placement_test_request_confirmed",
  "corporate-training-enquiry": "corporate_enquiry_confirmed",
  "resource-request": "resource_request_confirmed"
};
