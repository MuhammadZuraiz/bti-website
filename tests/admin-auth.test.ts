import { describe, expect, it } from "vitest";
import { isAuthorizedAdmin, safeEqual } from "@/lib/server/admin-auth";

function basic(user: string, password: string) {
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

describe("safeEqual", () => {
  it("matches identical strings and rejects differences", () => {
    expect(safeEqual("secret", "secret")).toBe(true);
    expect(safeEqual("secret", "secret2")).toBe(false);
    expect(safeEqual("secret", "Secret")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("isAuthorizedAdmin", () => {
  const credentials = { user: "admin", password: "admin-password-1234" };

  it("fails closed when no password is configured", () => {
    expect(isAuthorizedAdmin(basic("admin", "anything"), { password: "" })).toBe(false);
    expect(isAuthorizedAdmin(basic("admin", "anything"), {})).toBe(false);
  });

  it("rejects a missing or malformed header", () => {
    expect(isAuthorizedAdmin(null, credentials)).toBe(false);
    expect(isAuthorizedAdmin("Bearer token", credentials)).toBe(false);
    expect(isAuthorizedAdmin("Basic not-base64!!", credentials)).toBe(false);
    expect(isAuthorizedAdmin("Basic " + Buffer.from("nocolon").toString("base64"), credentials)).toBe(false);
  });

  it("rejects wrong user or password", () => {
    expect(isAuthorizedAdmin(basic("admin", "wrong"), credentials)).toBe(false);
    expect(isAuthorizedAdmin(basic("root", "admin-password-1234"), credentials)).toBe(false);
  });

  it("accepts correct credentials", () => {
    expect(isAuthorizedAdmin(basic("admin", "admin-password-1234"), credentials)).toBe(true);
  });

  it("defaults the username to admin when unset", () => {
    expect(
      isAuthorizedAdmin(basic("admin", "pw-1234567890"), { password: "pw-1234567890" })
    ).toBe(true);
    expect(
      isAuthorizedAdmin(basic("other", "pw-1234567890"), { password: "pw-1234567890" })
    ).toBe(false);
  });
});
