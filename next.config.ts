import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api/v1";

    const target = backendUrl.endsWith("/api/v1")
      ? backendUrl
      : `${backendUrl.replace(/\/$/, "")}/api/v1`;

    return [
      {
        source: "/api/v1/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
