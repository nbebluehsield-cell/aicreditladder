export const metadata = { title: "How we verify" };

/**
 * Methodology — the "how we check" page.
 *
 * Editorial treatment matched to /auth/login and /about: eyebrow →
 * stacked display hero with a gold italic payoff line → supporting
 * paragraph → numbered cadence table → plain-language closing.
 *
 * The numbered almanac list (§01 / §02 / §03) lets a reader scan the
 * verification cadence in two seconds without collapsing it to a
 * bullet list, which reads as generic blog-copy.
 */
export default function Methodology() {
  return (
    <article>
      <p className="section-number mb-4">Methodology</p>
      <h1 className="display-hero">
        How we
        <br />
        <span className="italic-display text-[color:var(--gold)]">
          actually verify.
        </span>
      </h1>

      <p className="mt-7 text-[16px] leading-[1.6] text-[color:var(--muted)]">
        Every listing is sourced from the vendor&apos;s own page. We record a
        source URL on each offer and re-check it on a cadence — and the
        moment something drifts, we mark it stale and open a review.
      </p>

      <div className="mt-10 border-t border-[color:var(--rule-2)]">
        <Row
          n="01"
          label="Featured"
          cadence="Weekly"
          detail="Anything on the homepage ‘Now’ rail is checked every week."
        />
        <Row
          n="02"
          label="Active"
          cadence="Monthly"
          detail="Every live offer across the ledger, re-sourced at least once per month."
        />
        <Row
          n="03"
          label="Sponsored"
          cadence="Before + during"
          detail="We verify the offer before the campaign goes live and again mid-flight."
        />
      </div>

      <div className="mt-10 space-y-5 text-[15px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          We check URL availability, content-hash drift, keyword signals
          (credit amount, eligibility, expired language), and broken
          application flows. When anything changes, the listing is
          flagged — not silently mutated.
        </p>
        <p>
          Confidence meters show our certainty per listing. Community
          experience reports are presented as commentary — never as
          claim, never comingled with the official offer.
        </p>
      </div>
    </article>
  );
}

function Row({
  n,
  label,
  cadence,
  detail,
}: {
  n: string;
  label: string;
  cadence: string;
  detail: string;
}) {
  return (
    <div className="flex items-baseline gap-5 border-b border-[color:var(--rule-2)] py-5 sm:gap-8">
      <span className="mono shrink-0 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold)]">
        § {n}
      </span>
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div>
          <h3 className="display text-[20px] leading-tight">{label}</h3>
          <p className="mt-1 text-[14px] leading-[1.55] text-[color:var(--foreground-dim)]">
            {detail}
          </p>
        </div>
        <span className="mono shrink-0 text-[11px] uppercase tracking-[0.22em] text-[color:var(--foreground-dim)]">
          {cadence}
        </span>
      </div>
    </div>
  );
}
