/**
 * Vendor logo resolver.
 *
 * Strategy, in order of preference:
 *
 *   1. Honor an explicit `logo_url` on the offer — except when it still
 *      points at the dead Clearbit host, which we silently ignore.
 *   2. Map the official-URL domain to a self-hosted brand SVG under
 *      `/logos/<slug>.svg`. These are generated at build time by
 *      `scripts/sync-logos.mjs` (primarily from the MIT-licensed
 *      `simple-icons` set, with small hand-drawn fallbacks for brands
 *      simple-icons does not cover). Self-hosting guarantees zero
 *      network hits to third parties, zero console errors, and
 *      consistent quality.
 *   3. Fall back to Google's s2 favicon endpoint for the long tail of
 *      domains we have not explicitly mapped yet.
 *   4. The caller (`VendorMark`) renders a monogram tile if the image
 *      itself ever fails to load.
 */

/** Map of known official-URL domains → local logo slug in /public/logos/. */
const DOMAIN_TO_SLUG: Record<string, string> = {
  "microsoft.com": "microsoft",
  "neon.tech": "neon",
  "modal.com": "modal",
  "github.com": "github",
  "platform.openai.com": "openai",
  "openai.com": "openai",
  "groq.com": "groq",
  "huggingface.co": "huggingface",
  "railway.app": "railway",
  "aws.amazon.com": "aws",
  "cloud.google.com": "googlecloud",
  "supabase.com": "supabase",
  "digitalocean.com": "digitalocean",
  "mongodb.com": "mongodb",
  "pinecone.io": "pinecone",
  "elevenlabs.io": "elevenlabs",
  "together.ai": "together",
  "posthog.com": "posthog",
  "linear.app": "linear",
  "notion.so": "notion",
  "anthropic.com": "anthropic",
  "cloudflare.com": "cloudflare",
  "vercel.com": "vercel",
  "nvidia.com": "nvidia",
  "oracle.com": "oracle",
  "cursor.com": "cursor",
  "windsurf.com": "windsurf",
  "codeium.com": "codeium",
  "sourcegraph.com": "sourcegraph",
  "zed.dev": "zed",
};

export function safeDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Resolve a vendor logo URL for the given official URL.
 *
 * Prefers the self-hosted brand SVG for known domains. Falls back to
 * Google's s2 favicon service for unmapped domains so new vendors show
 * *something* until we sync a proper mark.
 */
export function logoUrlForDomain(domain: string, size: number = 128): string | null {
  if (!domain) return null;
  const slug = DOMAIN_TO_SLUG[domain];
  if (slug) return `/logos/${slug}.svg`;
  // Google clamps sz to a small set (16, 32, 64, 128, 256). Always request
  // 256 so the fallback stays crisp on retina + after DPR upscaling.
  void size;
  return `https://www.google.com/s2/favicons?sz=256&domain=${encodeURIComponent(domain)}`;
}

/**
 * Detect the old Clearbit host so we can ignore any stale data still
 * pointing at it without issuing a doomed HTTP request.
 */
export function isDeadClearbit(url: string | null | undefined): boolean {
  if (!url) return false;
  return /^https?:\/\/logo\.clearbit\.com\//i.test(url);
}
