import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@snipd/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["rss-parser"],
  },
};

export default nextConfig;
