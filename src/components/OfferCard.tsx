import Link from "next/link";
import type { Offer } from "@/lib/types";
import { Chip } from "./ui/Chip";
import { ConfidenceMeter } from "./ConfidenceMeter";

const CREDIT_TYPE_LABEL: Record<Offer["credit_type"], string> = {
  ai_api: "AI API",
  cloud: "Cloud",
  saas: "SaaS",
  mixed: "Mixed",
};

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="group relative block border-b border-[color:var(--rule)] py-5 sm:py-6 transition hover:bg-[color:var(--surface)]/50 focus-ring"
    >
      {/* Mobile-first stack; two-column on sm+ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[color:var(--muted)]">
            <span className="eyebrow">{offer.vendor}</span>
            <span className="hidden h-px w-6 bg-[color:var(--rule-2)] sm:inline-block" />
            <Chip tone="neutral" mono>{CREDIT_TYPE_LABEL[offer.credit_type]}</Chip>
          </div>
          <h3 className="display mt-2 text-[22px] sm:text-[28px] leading-[1.02] text-[color:var(--foreground)]">
            {offer.title}
          </h3>
          <p className="mt-2 max-w-xl text-[13px] sm:text-sm text-[color:var(--muted)]">
            {offer.restrictions?.[0] ?? offer.best_for?.join(" · ") ?? "Startup credit program"}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="num text-[20px] sm:text-[22px] font-medium tracking-tight text-[color:var(--gold)]">
            {offer.value_display}
          </p>
          <div className="mt-2 flex items-center gap-2 sm:justify-end">
            <ConfidenceMeter value={offer.verification_confidence} />
            <span className="eyebrow">
              {offer.last_verified_at ? `T-${daysSince(offer.last_verified_at)}D` : "UNVERIFIED"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {offer.founder_stage_fit.map((s) => (
          <Chip key={s} tone={`stage-${s}` as const} mono>
            {s === "now" ? "● NOW" : s === "next" ? "◐ NEXT" : "○ LATER"}
          </Chip>
        ))}
        {offer.solo_founder_friendly === "yes" && <Chip tone="success" mono>Solo-friendly</Chip>}
        {offer.requires_vc_backing && <Chip tone="danger" mono>VC required</Chip>}
        {offer.requires_partner_referral && !offer.requires_vc_backing && (
          <Chip tone="muted" mono>Partner referral</Chip>
        )}
        {offer.apply_time_minutes && (
          <Chip tone="neutral" mono>~{offer.apply_time_minutes}M apply</Chip>
        )}
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-5 hidden font-mono text-[10px] text-[color:var(--muted-2)] transition group-hover:text-[color:var(--gold)] sm:top-6 sm:inline"
      >
        →
      </span>
    </Link>
  );
}

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24)));
}
