/**
 * Central SEO copy — titles, descriptions, and keywords used by `layout`,
 * `SiteJsonLd`, homepage, OG image, and public `llms.txt`. Keeps messaging
 * consistent for Google and other crawlers.
 *
 * Primary positioning: verified startup AI API, IDE, and cloud credits —
 * searchable by stack and claim path (not “frontier ledger” language).
 */

/** Default &lt;title&gt; when a route does not set `metadata.title`. */
export const SITE_TITLE_DEFAULT =
  "AI Credit Ladder — Verified startup AI & cloud credits";

/**
 * Root meta description (~155 chars) — natural keywords, one clear value prop.
 */
export const SITE_DESCRIPTION =
  "Search verified free credits for AI APIs, copilots, and cloud — AWS, Google Cloud, Azure, OpenAI-style programs, and more. Filter by stack, stage, and how you apply. Built for solo founders; updated weekly.";

/** Open Graph / Twitter when we want a slightly shorter secondary line. */
export const SITE_OG_DESCRIPTION =
  "Verified startup AI & cloud credits in one place — filter by stack, eligibility, and claim path. Solo-founder readable; sources linked for every offer.";

/** Organization + WebSite JSON-LD body copy. */
export const SITE_ORG_DESCRIPTION =
  "Independent directory of verified startup AI, IDE, and cloud credit programs — eligibility, amounts, and official apply links in one searchable index.";

/** High-intent phrases for `metadata.keywords` (avoid stuffing the description). */
export const SITE_KEYWORDS = [
  "AI credits for startups",
  "startup AI credits",
  "free AI API credits",
  "cloud credits for startups",
  "AWS Activate",
  "Google Cloud credits startup",
  "Azure startup credits",
  "OpenAI credits",
  "GPU credits startup",
  "solo founder",
  "verified AI programs",
  "developer credits",
  "LLM API credits",
  "IDE free trial credits",
] as const;

/** Short alt for default Open Graph image (`opengraph-image`). */
export const SITE_OG_IMAGE_ALT =
  "AI Credit Ladder — verified startup AI and cloud credits for solo founders and teams";
