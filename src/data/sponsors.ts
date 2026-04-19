/**
 * First-party, curated sponsors.
 *
 * These are NOT programmatic ads. Each entry is a direct deal,
 * reviewed by us, and must still be relevant to founders (see
 * BLUEPRINT §11). Keep this list short — one active at a time.
 *
 * Add via PR or the admin later. Empty array = homepage shows the
 * "Sponsor this slot" house pitch instead.
 */

export interface Sponsor {
  id: string;
  vendor: string;
  domain: string; // resolved to a brand mark via src/lib/logos.ts
  headline: string; // one short, specific sentence
  amountDisplay?: string; // e.g. "$5K credits"
  cta: string; // button label, short
  href: string; // always opens new tab
  activeFrom: string; // ISO — helps rotate by window
  activeTo: string; // ISO
  tier: "homepage" | "newsletter";
}

export const SPONSORS: Sponsor[] = [
  // Example — comment in once a real deal is signed:
  //
  // {
  //   id: "modal-2026-04",
  //   vendor: "Modal",
  //   domain: "modal.com",
  //   headline: "Serverless GPUs for AI builders. $500 free + startup credits.",
  //   amountDisplay: "$500 + startup credits",
  //   cta: "Claim on Modal",
  //   href: "https://modal.com/signup?utm_source=aicreditladder",
  //   activeFrom: "2026-04-01",
  //   activeTo: "2026-05-01",
  //   tier: "homepage",
  // },
];

export function activeSponsor(tier: Sponsor["tier"], now: Date = new Date()): Sponsor | null {
  const t = now.getTime();
  const live = SPONSORS.filter(
    (s) =>
      s.tier === tier &&
      Date.parse(s.activeFrom) <= t &&
      Date.parse(s.activeTo) >= t,
  );
  return live[0] ?? null;
}
