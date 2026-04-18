export type CreditType = "ai_api" | "cloud" | "saas" | "mixed";
export type OfferStatus = "active" | "paused" | "expired" | "unclear";
export type SourceType = "official" | "curated" | "community_reported";
export type RenewalType = "one_time" | "monthly" | "daily" | "annual" | "unknown";
export type FounderStage = "now" | "next" | "later";
export type YesNoUnclear = "yes" | "no" | "unclear";

export interface Offer {
  id: string;
  slug: string;
  title: string;
  vendor: string;
  logo_url: string | null;
  official_url: string;
  source_type: SourceType;
  status: OfferStatus;
  last_verified_at: string | null;
  verification_confidence: number | null;

  credit_type: CreditType;
  credit_value_amount: number | null;
  credit_value_currency: string | null;
  value_display: string;
  duration: string | null;
  renewal_type: RenewalType;

  geo_restrictions: string[] | null;
  company_stage: string | null;
  funding_requirement: string | null;
  solo_founder_friendly: YesNoUnclear;
  requires_company_registration: boolean;
  requires_corporate_domain: boolean;
  requires_partner_referral: boolean;
  requires_vc_backing: boolean;

  application_url: string;
  apply_time_minutes: number | null;
  review_time_estimate: string | null;
  difficulty_score: number | null;

  /** Gated */
  documents_needed?: string[] | null;
  /** Gated */
  application_tips?: string | null;
  /** Gated */
  common_rejection_reasons?: string[] | null;

  best_for: string[] | null;
  eligible_products: string[] | null;
  restrictions: string[] | null;
  stack_fit_tags: string[] | null;

  sponsored: boolean;
  sponsor_priority: number | null;
  ad_slot_eligible: boolean;

  founder_stage_fit: FounderStage[];
  project_types: string[];
}

export interface ProjectType {
  slug: string;
  label: string;
  description?: string;
}
