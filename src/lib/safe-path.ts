/**
 * Prevent open redirects when passing `next` via query (e.g. auth callback).
 * Only same-origin relative paths are allowed.
 */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback = "/explore",
): string {
  if (raw == null || typeof raw !== "string") return fallback;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return fallback;
  if (t.includes("\\")) return fallback;
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(t)) return fallback;
  return t;
}
