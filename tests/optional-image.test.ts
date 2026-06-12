import { describe, expect, it } from "vitest";
import { OptionalImagePanel } from "@/components/media/optional-image-panel";

describe("optional image fallback", () => {
  it("returns a safe fallback element when an optional asset is absent", () => {
    const element = OptionalImagePanel({
      src: "/images/not-provided.jpg",
      alt: "Missing optional image",
      fallbackTitle: "Fallback",
      fallbackCopy: "Fallback copy"
    });

    expect(element).toBeTruthy();
  });
});
