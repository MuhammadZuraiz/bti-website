import { z } from "zod";

/**
 * Server-side deployment model. DEPLOYMENT_ENV is read at build time by
 * robots, sitemap, metadata and security headers, so it must be set in the
 * build environment of every deployed target.
 *
 * Fail-safe rule: a deployed build that does not explicitly declare
 * DEPLOYMENT_ENV=production is treated as "preview" and is never indexable.
 */
export const deploymentEnvironments = [
  "development",
  "preview",
  "staging",
  "production"
] as const;

export type DeploymentEnvironment = (typeof deploymentEnvironments)[number];

const deploymentEnvironmentSchema = z.enum(deploymentEnvironments);

export function parseDeploymentEnvironment(
  value: string | undefined
): DeploymentEnvironment | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = deploymentEnvironmentSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

export function getDeploymentEnvironment(
  env: { DEPLOYMENT_ENV?: string; NODE_ENV?: string } = process.env
): DeploymentEnvironment {
  const explicit = parseDeploymentEnvironment(env.DEPLOYMENT_ENV);
  if (explicit) {
    return explicit;
  }

  return env.NODE_ENV === "production" ? "preview" : "development";
}

export function isIndexingAllowed(
  environment: DeploymentEnvironment = getDeploymentEnvironment()
) {
  return environment === "production";
}
