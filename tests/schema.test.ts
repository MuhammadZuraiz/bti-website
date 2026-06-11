import { describe, expect, it } from "vitest";
import { courses } from "@/content/courses";
import { courseSchema, organizationSchema } from "@/lib/schema";

describe("structured data", () => {
  it("outputs organization schema without fake aggregate ratings", () => {
    const schema = organizationSchema();
    expect(schema["@type"]).toBe("EducationalOrganization");
    expect(JSON.stringify(schema)).not.toContain("aggregateRating");
  });

  it("outputs course schema without fake prices or guarantees", () => {
    const schema = courseSchema(courses[0]);
    const text = JSON.stringify(schema);
    expect(schema["@type"]).toBe("Course");
    expect(text).not.toContain("offers");
    expect(text).not.toContain("guarantee");
  });
});
