import { describe, expect, it } from "vitest";
import {
  getDeploymentEnvironment,
  isIndexingAllowed,
  parseDeploymentEnvironment
} from "@/config/deployment";

describe("deployment environment model", () => {
  it("parses valid environments", () => {
    expect(parseDeploymentEnvironment("development")).toBe("development");
    expect(parseDeploymentEnvironment("preview")).toBe("preview");
    expect(parseDeploymentEnvironment("staging")).toBe("staging");
    expect(parseDeploymentEnvironment("production")).toBe("production");
  });

  it("rejects unknown environments", () => {
    expect(parseDeploymentEnvironment("prod")).toBeUndefined();
    expect(parseDeploymentEnvironment("")).toBeUndefined();
    expect(parseDeploymentEnvironment("PRODUCTION")).toBeUndefined();
  });

  it("uses the explicit DEPLOYMENT_ENV when set", () => {
    expect(
      getDeploymentEnvironment({ DEPLOYMENT_ENV: "staging", NODE_ENV: "production" })
    ).toBe("staging");
  });

  it("falls back to development for local runs", () => {
    expect(getDeploymentEnvironment({ NODE_ENV: "test" })).toBe("development");
    expect(getDeploymentEnvironment({})).toBe("development");
  });

  it("treats deployed builds without DEPLOYMENT_ENV as preview, never production", () => {
    expect(getDeploymentEnvironment({ NODE_ENV: "production" })).toBe("preview");
  });

  it("allows indexing only in production", () => {
    expect(isIndexingAllowed("development")).toBe(false);
    expect(isIndexingAllowed("preview")).toBe(false);
    expect(isIndexingAllowed("staging")).toBe(false);
    expect(isIndexingAllowed("production")).toBe(true);
  });
});
