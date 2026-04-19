import Link from "next/link";
import { VendorMark } from "@/components/VendorMark";
import { activeSponsor, type Sponsor } from "@/data/sponsors";

/**
 * SponsorCard — first-party, curated sponsor slot (not Google AdSense).
 * Programmatic ads use `<AdSlot />` + `NEXT_PUBLIC_ADSENSE_*` env vars.
 *
 * Visually it reads like an OfferCard: vendor mark, title, amount,
 * CTA. Distinguished by:
 *   • Thin gold left accent bar
 *   • Always-on "Sponsored · Partner" eyebrow
 *   • Destination is an outbound href (new tab, noopener)
 *
 * Philosophy: match the ledger's typographic grammar so it feels
 * native, but never impersonate an editorial result. The "Sponsored"
 * label is present in monospace, gold, and always visible.
 *
 * Data is read from src/data/sponsors.ts at build time. When no
 * sponsor is active, the slot is not rendered — the home ledger
 * closes the gap silently.
 */
export function SponsorCard({ tier = "homepage" }: { tier?: Sponsor["tier"] }) {
  const sponsor = activeSponsor(tier);
  if (!sponsor) return null;

  return (
    <aside
      aria-label={`Sponsored — ${sponsor.vendor}`}
      className="group relative border-t border-[color:var(--rule-2)]"
    >
      {/* Gold accent rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px] bg-[color:var(--gold)]"
      />
      <a
        href={sponsor.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="focus-ring flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--background-2)]/60 sm:gap-4 sm:px-6 lg:px-8"
      >
        <VendorMark
          vendor={sponsor.vendor}
          officialUrl={`https://${sponsor.domain}`}
          size={32}
          variant="bare"
        />
        <div className="min-w-0 flex-1">
          <p className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]">
            <span className="text-[color:var(--gold)]">Sponsored</span>
            <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
            <span className="text-[color:var(--muted)]">{sponsor.vendor}</span>
          </p>
          <p className="mt-0.5 truncate text-[14px] leading-[1.35] text-[color:var(--foreground)] sm:text-[15px]">
            {sponsor.headline}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          {sponsor.amountDisplay && (
            <span className="display text-[16px] leading-none text-[color:var(--foreground)] sm:text-[18px]">
              {sponsor.amountDisplay}
            </span>
          )}
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold)] underline-offset-4 group-hover:underline">
            {sponsor.cta} ↗
          </span>
        </div>
      </a>
    </aside>
  );
}

/**
 * Newsletter line — a single, signature-style sponsor line for the
 * Sunday Digest band. Used in the inbox version and in the website
 * preview. Keeps ad-to-content ratio low.
 */
export function SponsorLine({ tier = "newsletter" }: { tier?: Sponsor["tier"] }) {
  const sponsor = activeSponsor(tier);
  if (!sponsor) return null;
  return (
    <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
      <span className="text-[color:var(--gold)]">Sunday sponsor</span>{" "}
      <span aria-hidden className="text-[color:var(--muted-2)]">·</span>{" "}
      <Link
        href={sponsor.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="text-[color:var(--foreground)] underline-offset-4 hover:text-[color:var(--gold)] hover:underline"
      >
        {sponsor.vendor} — {sponsor.headline} ↗
      </Link>
    </p>
  );
}
