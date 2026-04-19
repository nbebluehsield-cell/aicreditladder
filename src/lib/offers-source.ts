import type { Offer } from "@/lib/types";
import { SEED_OFFERS, getOffer as seedGet, getOffersByProjectType as seedByProject, getOffersByStage as seedByStage } from "@/data/seed";

/**
 * Single read path for offer data.
 *
 * Today: returns the seed dataset. Tomorrow: reads from the
 * Supabase `offers_public` view (and `offers_authenticated` when
 * a session is present). Every route goes through here so the
 * seed→DB swap is a one-file change.
 *
 * Guardrails
 * ──────────
 * - Never import `SEED_OFFERS` elsewhere in app code. Call `getOffers()`.
 * - Keep this module dependency-light so it stays importable from
 *   Server Components without dragging a client bundle along.
 */

/** Public list filter — hide paused/retired offers from every ledger surface. */
const isLive = (o: Offer): boolean => o.status === "active";

export async function getOffers(): Promise<Offer[]> {
  return SEED_OFFERS.filter(isLive);
}

export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  const hit = seedGet(slug);
  return hit && isLive(hit) ? hit : undefined;
}

export async function getOffersByProject(slug: string): Promise<Offer[]> {
  return seedByProject(slug).filter(isLive);
}

export async function getOffersByStage(stage: "now" | "next" | "later"): Promise<Offer[]> {
  return seedByStage(stage).filter(isLive);
}
