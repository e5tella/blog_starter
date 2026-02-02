import { MetadataRoute } from "next";
import siteConfig from "@/site.config";
import { SITE_URL } from "@/lib/constants";

const aiBots = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "CCBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Bytespider",
  "Diffbot",
  "ImagesiftBot",
  "PerplexityBot",
  "YouBot",
  "Amazonbot",
  "FacebookBot",
  "Omgilibot",
  "Applebot-Extended",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/" },
  ];

  // Optionally block AI training crawlers.
  if (siteConfig.robots.blockAiBots) {
    rules.push({ userAgent: aiBots, disallow: "/" });
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
