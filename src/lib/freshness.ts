/**
 * Freshness helpers — the trust spine of the ledger.
 *
 * Every offer row and detail page carries a small "verified Xd ago" stamp.
 * When a record has no `last_verified_at` or the stamp is older than
 * STALE_DAYS, we downgrade the UI to "unverified" so we never overclaim.
 *
 * Keep this module pure and tiny — it runs inline on every row.
 */

export const STALE_DAYS = 60;
export const FRESH_DAYS = 14;

export type Freshness = {
  /** Tight label for row meta: "3d", "2w", "1mo", "unverified". */
  short: string;
  /** Human label for detail pages: "Verified 3 days ago". */
  long: string;
  /** Traffic-light tone. */
  tone: "fresh" | "aging" | "stale" | "unknown";
};

export function freshness(lastVerifiedAt: string | null | undefined): Freshness {
  if (!lastVerifiedAt) {
    return { short: "unverified", long: "Not yet verified", tone: "unknown" };
  }
  const then = new Date(lastVerifiedAt).getTime();
  if (Number.isNaN(then)) {
    return { short: "unverified", long: "Not yet verified", tone: "unknown" };
  }
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  const tone: Freshness["tone"] =
    days <= FRESH_DAYS ? "fresh" : days <= STALE_DAYS ? "aging" : "stale";

  const short =
    days === 0
      ? "today"
      : days < 7
      ? `${days}d`
      : days < 30
      ? `${Math.round(days / 7)}w`
      : days < 365
      ? `${Math.round(days / 30)}mo`
      : `${Math.round(days / 365)}y`;

  const long =
    days === 0
      ? "Verified today"
      : days === 1
      ? "Verified yesterday"
      : days < 7
      ? `Verified ${days} days ago`
      : days < 30
      ? `Verified ${Math.round(days / 7)} weeks ago`
      : days < 365
      ? `Verified ${Math.round(days / 30)} months ago`
      : `Verified ${Math.round(days / 365)} years ago`;

  return { short, long, tone };
}
