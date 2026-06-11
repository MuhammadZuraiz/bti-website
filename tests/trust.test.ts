import { describe, expect, it } from "vitest";
import { getTrustItems } from "@/lib/trust";

describe("trust section", () => {
  it("does not render restricted claims when disabled", () => {
    const labels = getTrustItems().map((item) => item.label);
    expect(labels).not.toContain("Centre ID 50");
    expect(labels).not.toContain("IELTS venue statement");
    expect(labels).not.toContain("SPEA listing statement");
  });
});
