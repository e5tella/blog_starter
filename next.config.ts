import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any remote image host for cover images in frontmatter.
    // Restrict this to specific domains in production for security.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
