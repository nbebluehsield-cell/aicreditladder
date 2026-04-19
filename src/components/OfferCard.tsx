"use client";

import Link from "next/link";
import type { Offer } from "@/lib/types";
import { VendorMark } from "@/components/VendorMark";
import { formatAmount } from "@/lib/formatAmount";
import { freshness } from "@/lib/freshness";
import { GA_EVENTS } from "@/lib/analytics-events";
import { trackGaEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/Button";

/** Hex logo 48px + gap-4 (16px) — aligns stacked value row with title on mobile */
const MOBILE_VALUE_INDENT = "max-sm:pl-[64px]";

/**
 * Ledger row — value column reads like body copy elsewhere: sans, normal line
 * height, teal only to flag dollars/benefit (not display/italic — scannable).
 */
export function OfferCard({
  offer,
  index = 0,
}: {
  offer: Offer;
  index?: number;
}) {
  const { main: amountMain, unit: amountUnit, qualifier } = formatAmount(offer);
  const fresh = freshness(offer.last_verified_at);
  const longAmount =
    !offer.credit_value_amount || offer.credit_value_amount <= 0
      ? amountMain.length > 16
      : false;

  const freshTone =
    fresh.tone === "fresh"
      ? "text-[color:var(--teal)]"
      : fresh.tone === "aging"
      ? "text-[color:var(--foreground-dim)]"
      : fresh.tone === "stale"
      ? "text-[color:var(--gold)]"
      : "text-[color:var(--muted-2)]";

  const delay = Math.min(index * 35, 420);

  const applyUrl = offer.application_url || offer.official_url;

  /** Dollar headline (sortable amount, From/Up to tiers) — gets the pine/teal “value” treatment */
  const valueIsMoney =
    typeof offer.credit_value_amount === "number" &&
    offer.credit_value_amount > 0;
  const mainLooksLikeUsd = /^\$[\d,.]+/.test(amountMain.trim());
  const highlightValue = valueIsMoney || mainLooksLikeUsd;

  return (
    <div
      className="group offer-row row-hover fade-up relative block border-b border-[color:var(--rule)] border-l-[3px] border-l-transparent transition-[background-color,border-color] duration-200 hover:border-l-[color:var(--gold)] focus-within:border-l-[color:var(--gold)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={`/offers/${offer.slug}`}
        prefetch
        aria-label={`${offer.title} — details`}
        className="absolute inset-0 z-10"
        onClick={() =>
          trackGaEvent(GA_EVENTS.OFFER_CARD_CLICK, {
            offer_slug: offer.slug,
            vendor: offer.vendor,
            offer_title: offer.title,
            list_index: index,
          })
        }
      />
      <div className="pointer-events-none relative z-0 flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-stretch sm:gap-6 sm:px-7 sm:py-5 lg:gap-8 lg:px-10">
        <div className="flex min-h-[48px] items-start gap-4 sm:min-h-0 sm:min-w-0 sm:flex-1 sm:items-center">
          <VendorMark
            vendor={offer.vendor}
            officialUrl={offer.official_url}
            logoUrl={offer.logo_url}
            size={44}
            variant="bare"
          />
          <div className="min-w-0 flex-1 pt-0.5 sm:pt-0">
            <h3 className="display text-[17px] leading-snug tracking-[-0.01em] text-[color:var(--foreground)] sm:truncate sm:text-[18px] lg:text-[19px]">
              {offer.title}
            </h3>
            <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-[12px] leading-snug text-[color:var(--muted)] sm:flex-nowrap sm:truncate sm:text-[12.5px]">
              <span className="min-w-0 shrink text-[color:var(--foreground-dim)] sm:truncate">
                {offer.vendor}
              </span>
              <span aria-hidden className="text-[color:var(--muted-2)]">
                ·
              </span>
              <span className={freshTone} title={fresh.long}>
                {fresh.tone === "unknown" ? "Not yet verified" : "Verified"}
              </span>
            </p>
            <TrustStrip offer={offer} className="mt-2" />
          </div>
        </div>

        <div
          className={`flex min-h-[48px] shrink-0 items-center justify-between gap-3 border-t border-[color:var(--rule-2)] pt-4 ${MOBILE_VALUE_INDENT} sm:mt-0 sm:min-h-0 sm:w-auto sm:items-stretch sm:justify-end sm:gap-4 sm:self-center sm:border-t-0 sm:pt-0 sm:pl-0`}
        >
          <div
            className="
              min-w-0 flex-1 border-l-2 border-[color:var(--rule-2)] pl-3
              transition-[border-color] duration-200
              group-hover:border-teal/45
              sm:max-w-[15rem] sm:flex-none sm:text-right
            "
          >
            {qualifier && !longAmount && (
              <p className="text-[11px] font-normal leading-snug text-[color:var(--muted-2)] sm:text-[12px]">
                {qualifier}
              </p>
            )}
            <p
              className={
                longAmount
                  ? "mt-1 text-left font-sans text-[14px] font-normal leading-[1.55] text-teal sm:text-[14.5px]"
                  : highlightValue
                    ? "mt-1 font-sans text-[15px] font-medium leading-[1.45] tracking-normal text-teal tabular-nums sm:text-[15.5px] lg:text-[16px]"
                    : "mt-1 font-sans text-[14px] font-normal leading-[1.45] text-[color:var(--foreground)] sm:text-[14.5px]"
              }
            >
              {amountMain}
            </p>
            {amountUnit && (
              <p className="mt-1 font-sans text-[12.5px] leading-[1.5] text-[color:var(--foreground-dim)] sm:text-[13px]">
                {amountUnit}
              </p>
            )}
          </div>
          <Button
            variant="default"
            size="xs"
            asChild
            className="pointer-events-auto relative z-20 mono uppercase"
          >
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`Apply to ${offer.vendor} at the source`}
              onClick={() =>
                trackGaEvent(GA_EVENTS.OFFER_APPLY_OUTBOUND, {
                  offer_slug: offer.slug,
                  vendor: offer.vendor,
                  offer_title: offer.title,
                  surface: "offer_card",
                })
              }
            >
              Claim <span aria-hidden>↗</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Trust strip — compact positive-signal chips that tell a solo founder
 * "you can actually claim this." Only renders chips that are true;
 * never shows negatives (that's what the offer detail page is for).
 */
function TrustStrip({ offer, className = "" }: { offer: Offer; className?: string }) {
  const chips: Array<{ label: string; tone: "official" | "good" | "muted" }> = [];

  if (offer.source_type === "official") {
    chips.push({ label: "Official source", tone: "official" });
  } else if (offer.source_type === "curated") {
    chips.push({ label: "Curated", tone: "muted" });
  }

  if (offer.solo_founder_friendly === "yes") {
    chips.push({ label: "Solo founder OK", tone: "good" });
  }
  if (!offer.requires_vc_backing && !offer.requires_partner_referral) {
    chips.push({ label: "No VC needed", tone: "good" });
  }
  if (offer.apply_time_minutes && offer.apply_time_minutes <= 5) {
    chips.push({ label: `~${offer.apply_time_minutes} min apply`, tone: "good" });
  }

  if (chips.length === 0) return null;

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 ${className}`}
      aria-label="Offer signals"
    >
      {chips.slice(0, 3).map((c) => (
        <li
          key={c.label}
          className={
            "rounded-full border px-2 py-[2px] text-[10.5px] leading-none tracking-[0.01em] " +
            (c.tone === "official"
              ? "border-[color:var(--gold)]/40 bg-[color:var(--gold-soft)] text-[color:var(--gold-bright)]"
              : c.tone === "good"
                ? "border-[color:var(--teal)]/30 bg-[color:var(--teal-soft)] text-[color:var(--teal)]"
                : "border-[color:var(--rule-2)] text-[color:var(--muted)]")
          }
        >
          {c.label}
        </li>
      ))}
    </ul>
  );
}
