// Edge-safe admin auth helpers (no node:crypto, so they work in middleware).
// Used to gate /admin and /api/admin behind HTTP Basic auth.

/** Constant-time string comparison to avoid leaking length/content via timing. */
export function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Compare against a fixed length so mismatched lengths still take similar time.
  const length = Math.max(aBytes.length, bBytes.length);
  let mismatch = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return mismatch === 0;
}

export type AdminCredentials = {
  user?: string;
  password?: string;
};

/**
 * Validates an Authorization header against configured admin credentials.
 * Fails closed: if no password is configured, access is always denied.
 * The username defaults to "admin" when LEAD_ADMIN_USER is unset.
 */
export function isAuthorizedAdmin(
  authorizationHeader: string | null,
  credentials: AdminCredentials
): boolean {
  const expectedPassword = credentials.password;
  if (!expectedPassword) {
    return false;
  }

  if (!authorizationHeader?.startsWith("Basic ")) {
    return false;
  }

  let decoded: string;
  try {
    decoded = atob(authorizationHeader.slice("Basic ".length).trim());
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return false;
  }

  const providedUser = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);
  const expectedUser = credentials.user || "admin";

  // Evaluate both comparisons (no short-circuit) to keep timing uniform.
  const userOk = safeEqual(providedUser, expectedUser);
  const passwordOk = safeEqual(providedPassword, expectedPassword);
  return userOk && passwordOk;
}

export function adminCredentialsFromEnv(
  env: Record<string, string | undefined> = process.env
): AdminCredentials {
  return { user: env.LEAD_ADMIN_USER, password: env.LEAD_ADMIN_PASSWORD };
}
