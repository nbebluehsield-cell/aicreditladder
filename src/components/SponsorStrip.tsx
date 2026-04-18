import Link from "next/link";

/**
 * Single-slot, explicitly-labeled sponsor module. On a quiet night it
 * renders a house ad — our own sponsor inquiry — so the inventory is
 * live from day one without looking empty.
 */
type SponsorSlot = {
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  sponsored: boolean;
};

const HOUSE_AD: SponsorSlot = {
  label: "House",
  title: "Reach builders before funding.",
  body: "One tasteful, clearly labeled slot. Per page. No junk stacking. Inquire for availability.",
  href: "/sponsor",
  cta: "Sponsor this",
  sponsored: false,
};

export function SponsorStrip({ slot = HOUSE_AD }: { slot?: SponsorSlot }) {
  return (
    <aside
      aria-label={slot.sponsored ? "Sponsored placement" : "House placement"}
      className="relative overflow-hidden border-y border-[color:var(--rule)] bg-[color:var(--background-2)]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 items-center gap-4 px-6 py-5 sm:py-6">
        <div className="col-span-12 flex items-center gap-3 sm:col-span-2">
          <span className="mono rounded-sm border border-[color:var(--rule-2)] px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
            {slot.sponsored ? "Sponsored" : "House ·  ad slot"}
          </span>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <p className="display text-[18px] leading-tight sm:text-[20px]">
            {slot.title}
          </p>
          <p className="mt-1 text-[13px] text-[color:var(--muted)]">
            {slot.body}
          </p>
        </div>
        <div className="col-span-12 sm:col-span-3 sm:text-right">
          <Link
            href={slot.href}
            className="editorial-link text-[13px] text-[color:var(--gold)]"
          >
            {slot.cta} →
          </Link>
        </div>
      </div>
    </aside>
  );
}
