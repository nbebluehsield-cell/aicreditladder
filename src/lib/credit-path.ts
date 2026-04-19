import type { Offer } from "@/lib/types";

/**
 * Derive "how you get credits" — the mental model founders use — without
 * hand-tagging every row in the DB. Rules are ordered: partner/VC gates
 * first, then startup-program signals, then the fast path.
 */

export type CreditPath = "signup" | "startup_program" | "partner_or_investor";

export const CREDIT_PATH_ORDER: CreditPath[] = [
  "signup",
  "startup_program",
  "partner_or_investor",
];

export const CREDIT_PATH_META: Record<
  CreditPath,
  { label: string; note: string }
> = {
  signup: {
    label: "Sign up & start",
    note: "Product signup, free tier, or trial — usually minutes, no entity.",
  },
  startup_program: {
    label: "Startup programs",
    note: "Vendor startup hubs & bundles — apply as a builder or company.",
  },
  partner_or_investor: {
    label: "Partner & investor paths",
    note: "Referral, accelerator, or VC gates — unlock when you have the signal.",
  },
};

/** URL query values for `?path=` — short, stable slugs. */
export type CreditPathSlug = "signup" | "startup" | "partner";

export function creditPathSlug(p: CreditPath): CreditPathSlug {
  switch (p) {
    case "signup":
      return "signup";
    case "startup_program":
      return "startup";
    case "partner_or_investor":
      return "partner";
  }
}

export function creditPathFromSlug(s: string | undefined | null): CreditPath | null {
  switch (s) {
    case "signup":
      return "signup";
    case "startup":
      return "startup_program";
    case "partner":
      return "partner_or_investor";
    default:
      return null;
  }
}

function startupProgramHeuristic(o: Offer): boolean {
  const bundle = `${o.title} ${o.vendor}`;
  if (
    /\b(startups?|founders?\s+hub|activate|hatch|inception|for\s+startups)\b/i.test(
      bundle,
    )
  ) {
    return true;
  }
  if (o.requires_company_registration || o.requires_corporate_domain) {
    return true;
  }
  if (typeof o.credit_value_amount === "number" && o.credit_value_amount >= 15000) {
    return true;
  }
  if (typeof o.apply_time_minutes === "number" && o.apply_time_minutes >= 30) {
    return true;
  }
  if (typeof o.difficulty_score === "number" && o.difficulty_score >= 4) {
    return true;
  }
  return false;
}

export function creditPathForOffer(o: Offer): CreditPath {
  if (o.requires_partner_referral || o.requires_vc_backing) {
    return "partner_or_investor";
  }
  if (startupProgramHeuristic(o)) {
    return "startup_program";
  }
  return "signup";
}

/** One bucket per offer — homepage ledger order is stable within each bucket. */
export function bucketOffersByCreditPath(
  offers: Offer[],
): Record<CreditPath, Offer[]> {
  const empty: Record<CreditPath, Offer[]> = {
    signup: [],
    startup_program: [],
    partner_or_investor: [],
  };
  for (const o of offers) {
    empty[creditPathForOffer(o)].push(o);
  }
  return empty;
}
