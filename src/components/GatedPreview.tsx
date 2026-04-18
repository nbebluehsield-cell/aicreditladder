import Link from "next/link";
import type { Offer } from "@/lib/types";
import { Chip } from "./ui/Chip";
import { Button } from "./ui/Button";

/**
 * Home-page module that renders a real offer with its gated fields
 * visibly redacted, so anonymous visitors see exactly what signing in
 * unlocks.
 *
 * This is intentionally not `maskForAnonymous()` — we render the
 * labels and the locked shapes of the data, not the data itself.
 * The real gating on `/offers/[slug]` is server-enforced via the
 * anonymous projection.
 */
export function GatedPreview({ offer }: { offer: Offer }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[color:var(--rule-2)] bg-[color:var(--surface)]/70">
      {/* Preview header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--rule)] p-5 sm:p-6">
        <div className="min-w-0">
          <p className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
            {offer.vendor} · sample unlocked view
          </p>
          <p className="display mt-1.5 text-[22px] leading-tight sm:text-[26px]">
            {offer.title}
          </p>
        </div>
        <p className="num text-[22px] font-medium tracking-tight text-[color:var(--gold)] sm:text-[26px]">
          {offer.value_display}
        </p>
      </div>

      {/* Public fields — visible to everyone */}
      <div className="grid grid-cols-1 gap-px border-b border-[color:var(--rule)] bg-[color:var(--rule)] sm:grid-cols-3">
        <PublicCell
          k="Solo founder friendly"
          v={
            offer.solo_founder_friendly === "yes"
              ? "Yes"
              : offer.solo_founder_friendly === "no"
              ? "No"
              : "Unclear"
          }
        />
        <PublicCell k="Partner required" v={offer.requires_partner_referral ? "Yes" : "No"} />
        <PublicCell
          k="Review time"
          v={offer.review_time_estimate ?? "Varies"}
        />
      </div>

      {/* Gated fields — visibly locked */}
      <div className="relative p-5 sm:p-6">
        <p className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
          Founder guidance · unlocks with email
        </p>

        <ul className="mt-4 space-y-3.5">
          <LockedRow label="Application tips" hint={`${offer.application_tips ? offer.application_tips.length : 120} characters of vendor-specific guidance`} />
          <LockedRow label="Documents needed" hint={`${offer.documents_needed?.length ?? 3} items`} />
          <LockedRow label="Common rejection reasons" hint={`${offer.common_rejection_reasons?.length ?? 2} patterns`} />
          <LockedRow label="Confidence & last-verified" hint="Reviewer note + date" />
        </ul>

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[color:var(--muted)]">
            Free. Magic link. Takes 20 seconds. Unlocks every offer in the index.
          </p>
          <Button href="/auth/login" size="md">
            Unlock the index →
          </Button>
        </div>

        {/* Lock motif */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-5 top-5 sm:right-6 sm:top-6"
        >
          <LockGlyph />
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-[color:var(--rule)] px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Chip tone="neutral" mono>
            Preview
          </Chip>
          <span className="eyebrow">No spam · One-click unsubscribe</span>
        </div>
        <Link
          href={`/offers/${offer.slug}`}
          className="editorial-link text-[12px] text-[color:var(--foreground-dim)]"
        >
          See this offer →
        </Link>
      </div>
    </div>
  );
}

function PublicCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-[color:var(--background)] p-4 sm:p-5">
      <p className="eyebrow">{k}</p>
      <p className="mt-1.5 text-[14px] text-[color:var(--foreground)]">{v}</p>
    </div>
  );
}

function LockedRow({ label, hint }: { label: string; hint: string }) {
  return (
    <li className="flex items-start gap-4">
      <span
        aria-hidden
        className="mt-1 h-[1px] w-8 bg-[color:var(--rule-3)]"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[color:var(--foreground-dim)]">{label}</p>
        <div className="mt-1.5 space-y-1.5" aria-hidden>
          <div className="h-2.5 w-[92%] rounded bg-[color:var(--rule-2)]" />
          <div className="h-2.5 w-[74%] rounded bg-[color:var(--rule-2)]" />
        </div>
        <p className="mono mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-2)]">
          {hint}
        </p>
      </div>
    </li>
  );
}

function LockGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[color:var(--gold)] opacity-60"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}
