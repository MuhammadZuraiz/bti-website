import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/config/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: buildSecurityHeaders()
      }
    ];
  }
};

export default nextConfig;
