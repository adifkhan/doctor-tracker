import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: `${API_URL}/:path*`,
        destination: `${API_ORIGIN}${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
