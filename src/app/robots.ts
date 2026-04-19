import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/** Crawlers that index for AI / answer systems — same allow as default. */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "PerplexityBot",
  "anthropic-ai",
  "ClaudeBot",
  "Applebot-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/admin/", "/api/", "/auth/callback"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privatePaths,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
