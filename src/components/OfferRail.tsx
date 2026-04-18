import Link from "next/link";
import type { Offer } from "@/lib/types";
import { Chip } from "./ui/Chip";

type Accent = "teal" | "gold" | "muted";

/**
 * A horizontal-scrolling rail of OfferCardMini tiles. Used on the home
 * page to expose the four founder-native angles on the dataset:
 * solo-friendly · no-VC · highest-value · fastest-approval.
 *
 * Intentionally denser than OfferCard so we can fit 3–5 in view on
 * desktop. Mobile becomes a horizontal scroll with snap.
 */
export function OfferRail({
  eyebrow,
  title,
  subtitle,
  offers,
  href,
  accent = "gold",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  offers: Offer[];
  href: string;
  accent?: Accent;
}) {
  const accentColor =
    accent === "teal"
      ? "var(--teal)"
      : accent === "muted"
      ? "var(--muted)"
      : "var(--gold)";

  if (offers.length === 0) return null;

  return (
    <div className="border-t border-[color:var(--rule)]">
      <div className="flex items-end justify-between gap-4 px-1 pt-8 pb-4 sm:pt-10 sm:pb-5">
        <div className="min-w-0">
          <p
            className="mono text-[10.5px] uppercase tracking-[0.22em]"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </p>
          <h3 className="display mt-2 text-[22px] leading-[1.05] sm:text-[26px]">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 max-w-lg text-[13px] text-[color:var(--muted)]">
              {subtitle}
            </p>
          )}
        </div>
        <Link
          href={href}
          className="editorial-link shrink-0 self-start text-[12px] text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]"
        >
          See all →
        </Link>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-6 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-1 px-1"
        role="list"
      >
        {offers.map((o) => (
          <OfferCardMini key={o.id} offer={o} accentColor={accentColor} />
        ))}
      </div>
    </div>
  );
}

function OfferCardMini({ offer, accentColor }: { offer: Offer; accentColor: string }) {
  return (
    <Link
      href={`/offers/${offer.slug}`}
      role="listitem"
      className="group relative flex min-h-[168px] w-[260px] shrink-0 snap-start flex-col justify-between rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)]/70 p-4 transition hover:-translate-y-px hover:border-[color:var(--rule-3)] hover:bg-[color:var(--surface-2)]/90 sm:w-[288px]"
    >
      <div>
        <p className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          {offer.vendor}
        </p>
        <p className="display mt-2 line-clamp-2 text-[17px] leading-[1.1] text-[color:var(--foreground)] sm:text-[18px]">
          {offer.title}
        </p>
      </div>

      <div>
        <p
          className="num text-[18px] font-medium tracking-tight"
          style={{ color: accentColor }}
        >
          {offer.value_display}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {offer.solo_founder_friendly === "yes" && (
            <Chip tone="success" mono>Solo</Chip>
          )}
          {!offer.requires_vc_backing && !offer.requires_partner_referral && (
            <Chip tone="neutral" mono>No partner</Chip>
          )}
          {offer.apply_time_minutes && offer.apply_time_minutes <= 15 && (
            <Chip tone="neutral" mono>~{offer.apply_time_minutes}M</Chip>
          )}
          {offer.difficulty_score && offer.difficulty_score <= 2 && (
            <Chip tone="neutral" mono>Easy</Chip>
          )}
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-[color:var(--muted-2)] transition group-hover:text-[color:var(--gold)]"
      >
        →
      </span>
    </Link>
  );
}
