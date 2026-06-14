import { NextResponse, type NextRequest } from "next/server";
import { adminCredentialsFromEnv, isAuthorizedAdmin } from "@/lib/server/admin-auth";

// Gate the staff lead-admin area behind HTTP Basic auth. Runs at the Edge
// runtime (Next.js "proxy" convention, formerly "middleware"), so it only uses
// Edge-safe helpers (no node:crypto, no Prisma).
export function proxy(request: NextRequest) {
  const authorized = isAuthorizedAdmin(
    request.headers.get("authorization"),
    adminCredentialsFromEnv()
  );

  if (!authorized) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="BTI admin", charset="UTF-8"',
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store"
      }
    });
  }

  const response = NextResponse.next();
  // Admin pages must never be indexed even if auth is bypassed upstream.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
