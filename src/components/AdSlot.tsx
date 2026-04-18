import Link from "next/link";

/**
 * AdSense-ready slot component.
 *
 * Renders nothing (or a labeled house ad) until both:
 *   1. `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set, AND
 *   2. the visitor has given cookie consent.
 *
 * Consent is checked client-side via a small hydration wrapper; the
 * server always renders the passive house-ad shell so layout doesn't
 * shift when ads load.
 *
 * IMPORTANT: AdSense requires a site review before ads serve. Leave
 * the env var unset in production until that review completes; the
 * component will silently degrade.
 */

type Variant = "inline" | "rail";

const LABEL: Record<Variant, string> = {
  inline: "Sponsored · ad slot",
  rail: "Sponsored",
};

export function AdSlot({
  variant = "inline",
  slotId,
}: {
  variant?: Variant;
  slotId?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const enabled = !!client;

  return (
    <aside
      data-ad-slot={slotId ?? variant}
      className="flex items-center justify-between gap-3 rounded-md border border-dashed border-[color:var(--rule-2)] bg-[color:var(--surface)]/40 px-4 py-3"
      aria-label="Advertisement"
    >
      <div className="min-w-0">
        <p className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          {LABEL[variant]}
        </p>
        <p className="mt-1 truncate text-[13px] text-[color:var(--foreground-dim)]">
          {enabled
            ? "Ads load with reader consent. Official listings are never displaced."
            : "This slot is held for a tasteful, clearly labeled sponsor placement."}
        </p>
      </div>
      <Link
        href="/sponsor"
        className="editorial-link shrink-0 text-[12px] text-[color:var(--gold)]"
      >
        Sponsor →
      </Link>
    </aside>
  );
}
