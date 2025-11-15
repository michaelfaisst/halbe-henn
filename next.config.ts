import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
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
