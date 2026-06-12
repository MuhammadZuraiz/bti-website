import { describe, expect, it } from "vitest";
import { getContactContext } from "@/lib/contact-context";

describe("contact context", () => {
  it("validates course query parameters against course data", () => {
    const context = getContactContext({
      course: "ielts-preparation-course-sharjah"
    });

    expect(context.kind).toBe("course");
    expect(context.formTitle).toBe("Ask about IELTS Preparation Course in Sharjah");
    expect(context.courseInterest).toBe("IELTS Preparation Course in Sharjah");
    expect(context.courseSlug).toBe("ielts-preparation-course-sharjah");
  });

  it("ignores arbitrary course query text", () => {
    const context = getContactContext({ course: "made-up-course" });
    expect(context.kind).toBe("general");
    expect(context.courseInterest).toBe("");
  });

  it("preserves validated resource context", () => {
    const context = getContactContext({ resource: "corporate-training-profile" });
    expect(context.kind).toBe("resource");
    expect(context.formTitle).toBe("Request the Corporate Training Profile");
    expect(context.resourceInterest).toBe("Corporate Training Profile");
    expect(context.resourceSlug).toBe("corporate-training-profile");
  });
});
