const DEFAULT_PUBLIC_SITE = "https://aicreditladder.com";

function stripTrailingSlash(origin: string): string {
  return origin.replace(/\/$/, "");
}

/**
 * Canonical origin for metadata, sitemap, JSON-LD, robots, and magic-link
 * `emailRedirectTo`. Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` (required for branded prod + matching Supabase redirects)
 * 2. `VERCEL_URL` on Vercel (previews / deployments without explicit env)
 * 3. `http://localhost:3000` in non-production (local dev)
 * 4. `DEFAULT_PUBLIC_SITE` for production builds without the above (e.g. CI)
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return stripTrailingSlash(`https://${host}`);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return DEFAULT_PUBLIC_SITE;
}

export const SITE_URL = resolveSiteUrl();
