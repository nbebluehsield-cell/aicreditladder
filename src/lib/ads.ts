import type { CSSProperties } from "react";

/**
 * Single source of truth for every ad surface on the site.
 *
 * Rules (from BLUEPRINT §11):
 *   • No ads on auth flow.
 *   • Sponsor slots must still be relevant to founders.
 *   • Official results are never displaced.
 *   • Density is restrained — one native sponsor + one programmatic per page max.
 *
 * Env contract:
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_<KEY> = numeric slot id from AdSense dashboard
 *
 * A placement only serves a real ad when BOTH the client id and its
 * slot id are defined AND the visitor has accepted consent. Otherwise
 * it renders the designed house-ad fallback.
 */

export type PlacementKey =
  | "home_inline" // mid-ledger on homepage
  | "explore_inline" // after first row cluster on /explore
  | "offer_rail"; // below the tips grid on /offers/[slug]

export type AdFormat = "auto" | "fluid" | "horizontal" | "rectangle";

export interface Placement {
  key: PlacementKey;
  label: string; // human label for house ad + a11y
  envSlot: string; // env var holding the AdSense slot id
  format: AdFormat;
  /** Inline style passed to the `<ins>` element. */
  style: CSSProperties;
  /** Allow programmatic serving (false = house ad only). */
  allowProgrammatic: boolean;
}

export const PLACEMENTS: Record<PlacementKey, Placement> = {
  home_inline: {
    key: "home_inline",
    label: "Homepage · inline",
    envSlot: "NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE",
    format: "fluid",
    style: { display: "block", minHeight: 96 },
    allowProgrammatic: true,
  },
  explore_inline: {
    key: "explore_inline",
    label: "Explore · inline",
    envSlot: "NEXT_PUBLIC_ADSENSE_SLOT_EXPLORE_INLINE",
    format: "fluid",
    style: { display: "block", minHeight: 96 },
    allowProgrammatic: true,
  },
  offer_rail: {
    key: "offer_rail",
    label: "Offer detail · rail",
    envSlot: "NEXT_PUBLIC_ADSENSE_SLOT_OFFER_RAIL",
    format: "auto",
    style: { display: "block", minHeight: 120 },
    allowProgrammatic: true,
  },
};

/**
 * Read the AdSense client id at render time. Returns null when unset
 * so components can branch cleanly. Safe in both server and client.
 */
export function adSenseClientId(): string | null {
  const v = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return v && v.trim() ? v.trim() : null;
}

/**
 * Resolve the slot id for a placement. Env vars are inlined at build
 * time by Next, so accessing them via a dynamic key fails — we read
 * each one explicitly. Returns null when the placement isn't wired.
 */
export function slotIdFor(key: PlacementKey): string | null {
  const map: Record<PlacementKey, string | undefined> = {
    home_inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE,
    explore_inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXPLORE_INLINE,
    offer_rail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_OFFER_RAIL,
  };
  const v = map[key];
  return v && v.trim() ? v.trim() : null;
}

/** True when this placement can serve a real AdSense ad (client + slot + allowed). */
export function isAdSensePlacementWired(key: PlacementKey): boolean {
  const conf = PLACEMENTS[key];
  return !!(adSenseClientId() && slotIdFor(key) && conf.allowProgrammatic);
}

export const CONSENT_COOKIE = "acl_consent"; // "1" = accepted
