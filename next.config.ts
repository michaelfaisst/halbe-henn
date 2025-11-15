import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/umami/script.js",
        destination: "https://umami.faisst.io/script.js",
      },
    ];
  },
};

export default nextConfig;
