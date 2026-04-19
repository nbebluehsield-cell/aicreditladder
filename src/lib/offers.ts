import type { Offer } from "@/lib/types";
import {
  creditPathForOffer,
  creditPathFromSlug,
  creditPathSlug,
  type CreditPath,
} from "@/lib/credit-path";

/**
 * Canonical offer-query helpers. These are intentionally pure — they
 * operate on an `Offer[]` so the same code works against the seed
 * dataset today and against a Supabase projection later. All sort
 * orders are stable: ties break on slug for deterministic output.
 */

export type SortKey =
  | "recommended"
  | "value_desc"
  | "value_asc"
  | "fastest_review"
  | "easiest_apply"
  | "newest_verified";

export interface Filters {
  solo?: boolean;
  noVc?: boolean;
  noPartner?: boolean;
  noRegistration?: boolean;
  creditType?: Offer["credit_type"] | null;
  /** How you get credits — derived path; see `credit-path.ts`. */
  creditPath?: CreditPath | null;
  stage?: Offer["founder_stage_fit"][number] | null;
  projectType?: string | null;
  maxDifficulty?: number | null;
  maxApplyMinutes?: number | null;
  search?: string | null;
}

export const EMPTY_FILTERS: Filters = {};

export function filterOffers(offers: Offer[], f: Filters): Offer[] {
  const q = f.search?.trim().toLowerCase() ?? "";
  return offers.filter((o) => {
    if (f.solo && o.solo_founder_friendly !== "yes") return false;
    if (f.noVc && o.requires_vc_backing) return false;
    if (f.noPartner && o.requires_partner_referral) return false;
    if (f.noRegistration && o.requires_company_registration) return false;
    if (f.creditType && o.credit_type !== f.creditType) return false;
    if (f.creditPath && creditPathForOffer(o) !== f.creditPath) return false;
    if (f.stage && !o.founder_stage_fit.includes(f.stage)) return false;
    if (f.projectType && !o.project_types.includes(f.projectType)) return false;
    if (
      typeof f.maxDifficulty === "number" &&
      typeof o.difficulty_score === "number" &&
      o.difficulty_score > f.maxDifficulty
    )
      return false;
    if (
      typeof f.maxApplyMinutes === "number" &&
      typeof o.apply_time_minutes === "number" &&
      o.apply_time_minutes > f.maxApplyMinutes
    )
      return false;
    if (q) {
      const hay = [
        o.title,
        o.vendor,
        o.value_display,
        ...(o.best_for ?? []),
        ...(o.stack_fit_tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortOffers(offers: Offer[], key: SortKey): Offer[] {
  const arr = [...offers];
  const byValueDesc = (a: Offer, b: Offer) =>
    (b.credit_value_amount ?? -1) - (a.credit_value_amount ?? -1) ||
    a.slug.localeCompare(b.slug);
  const byValueAsc = (a: Offer, b: Offer) =>
    (a.credit_value_amount ?? Infinity) - (b.credit_value_amount ?? Infinity) ||
    a.slug.localeCompare(b.slug);
  const byEasy = (a: Offer, b: Offer) =>
    (a.difficulty_score ?? 9) - (b.difficulty_score ?? 9) ||
    a.slug.localeCompare(b.slug);
  const byApplyFast = (a: Offer, b: Offer) =>
    (a.apply_time_minutes ?? 999) - (b.apply_time_minutes ?? 999) ||
    a.slug.localeCompare(b.slug);
  const byVerifiedDesc = (a: Offer, b: Offer) => {
    const av = a.last_verified_at ?? "";
    const bv = b.last_verified_at ?? "";
    return bv.localeCompare(av) || a.slug.localeCompare(b.slug);
  };

  switch (key) {
    case "value_desc":
      return arr.sort(byValueDesc);
    case "value_asc":
      return arr.sort(byValueAsc);
    case "easiest_apply":
      return arr.sort(byEasy);
    case "fastest_review":
      return arr.sort(byApplyFast);
    case "newest_verified":
      return arr.sort(byVerifiedDesc);
    case "recommended":
    default:
      // Recommended = solo-friendly first, then low difficulty, then value
      return arr.sort((a, b) => {
        const aSolo = a.solo_founder_friendly === "yes" ? 0 : 1;
        const bSolo = b.solo_founder_friendly === "yes" ? 0 : 1;
        if (aSolo !== bSolo) return aSolo - bSolo;
        return byEasy(a, b) || byValueDesc(a, b);
      });
  }
}

/** Rail selectors used on the homepage. */
export const rails = {
  soloFriendly(offers: Offer[], n = 8): Offer[] {
    return sortOffers(
      offers.filter((o) => o.solo_founder_friendly === "yes"),
      "easiest_apply",
    ).slice(0, n);
  },
  noVcRequired(offers: Offer[], n = 8): Offer[] {
    return sortOffers(
      offers.filter(
        (o) => !o.requires_vc_backing && !o.requires_partner_referral,
      ),
      "value_desc",
    ).slice(0, n);
  },
  highestValue(offers: Offer[], n = 8): Offer[] {
    return sortOffers(offers, "value_desc").slice(0, n);
  },
  fastestApprovals(offers: Offer[], n = 8): Offer[] {
    return sortOffers(
      offers.filter((o) => {
        if (!o.review_time_estimate) return false;
        const lower = o.review_time_estimate.toLowerCase();
        return (
          lower.includes("instant") ||
          lower.includes("day") ||
          lower.startsWith("1") ||
          lower.startsWith("2") ||
          lower.startsWith("3")
        );
      }),
      "easiest_apply",
    ).slice(0, n);
  },
};

/** Parse filters/sort from URL searchParams. */
export function parseSearchParams(
  sp: Record<string, string | string[] | undefined>,
): { filters: Filters; sort: SortKey } {
  const s = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const n = (k: string) => {
    const v = s(k);
    return v ? Number(v) : null;
  };
  const b = (k: string) => {
    const v = s(k);
    return v === "1" || v === "true";
  };

  const sortRaw = s("sort") as SortKey | undefined;
  const sort: SortKey =
    sortRaw &&
    [
      "recommended",
      "value_desc",
      "value_asc",
      "fastest_review",
      "easiest_apply",
      "newest_verified",
    ].includes(sortRaw)
      ? sortRaw
      : "recommended";

  const pathRaw = s("path");
  const filters: Filters = {
    solo: b("solo"),
    noVc: b("noVc"),
    noPartner: b("noPartner"),
    noRegistration: b("noReg"),
    creditType: (s("type") as Offer["credit_type"] | undefined) ?? null,
    creditPath: creditPathFromSlug(pathRaw),
    stage: (s("stage") as Offer["founder_stage_fit"][number] | undefined) ?? null,
    projectType: s("project") ?? null,
    maxDifficulty: n("maxDiff"),
    maxApplyMinutes: n("maxApply"),
    search: s("q") ?? null,
  };
  return { filters, sort };
}

/** Build a URL-safe param object from filters + sort, omitting defaults. */
export function buildSearchString(filters: Filters, sort: SortKey): string {
  const p = new URLSearchParams();
  if (filters.solo) p.set("solo", "1");
  if (filters.noVc) p.set("noVc", "1");
  if (filters.noPartner) p.set("noPartner", "1");
  if (filters.noRegistration) p.set("noReg", "1");
  if (filters.creditType) p.set("type", filters.creditType);
  if (filters.creditPath) p.set("path", creditPathSlug(filters.creditPath));
  if (filters.stage) p.set("stage", filters.stage);
  if (filters.projectType) p.set("project", filters.projectType);
  if (typeof filters.maxDifficulty === "number")
    p.set("maxDiff", String(filters.maxDifficulty));
  if (typeof filters.maxApplyMinutes === "number")
    p.set("maxApply", String(filters.maxApplyMinutes));
  if (filters.search) p.set("q", filters.search);
  if (sort && sort !== "recommended") p.set("sort", sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.solo) n++;
  if (f.noVc) n++;
  if (f.noPartner) n++;
  if (f.noRegistration) n++;
  if (f.creditType) n++;
  if (f.creditPath) n++;
  if (f.stage) n++;
  if (f.projectType) n++;
  if (typeof f.maxDifficulty === "number") n++;
  if (typeof f.maxApplyMinutes === "number") n++;
  if (f.search) n++;
  return n;
}
