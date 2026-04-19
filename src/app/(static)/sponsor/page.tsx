import Link from "next/link";

export const metadata = {
  title: "Sponsor",
  description:
    "Tasteful, labeled sponsorship for AI vendors who want to reach solo and pre-funding founders.",
};

const LAST_UPDATED = "April 2026";

export default function Sponsor() {
  return (
    <article>
      <p className="section-number mb-4">Sponsor</p>
      <h1 className="display-hero">
        Reach builders
        <br />
        <span className="italic-display text-[color:var(--gold)]">
          before funding.
        </span>
      </h1>
      <p className="mono mt-5 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        Last updated {LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-7 text-[15px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          AI Credit Ladder is the index solo and pre-funding founders open
          when they want to reduce burn before traction. If your program
          gives credit, credits, or deep discount to early-stage AI builders,
          one of the placements below is for you.
        </p>

        <Section title="What we will and won't do">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Every placement is <strong>labeled</strong>{" "}
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
                Sponsored
              </span>
              . Always. Non-negotiable.
            </li>
            <li>
              We don&rsquo;t bury, reorder, or hide official listings. A
              sponsored row sits beside the ledger, not on top of it.
            </li>
            <li>
              We review every offer for founder relevance before it runs. If
              it&rsquo;s not actually useful to a solo or pre-funding
              builder, we pass.
            </li>
            <li>
              No pop-ups, no interstitials, no auto-play, no retargeting
              scripts layered on top of ours.
            </li>
          </ul>
        </Section>

        <Section title="Inventory">
          <Slot
            name="Homepage sponsor row"
            where="Directly above the Now → Next → Later ledger."
            look="Native row — your logo, one line, credit amount, CTA. Gold accent bar left of the card."
            unit="1 active slot · weekly"
          />
          <Slot
            name="Offer detail rail"
            where="Below the tips grid on every /offers/[slug] page."
            look="Full-width horizontal slot. Programmatic (AdSense) by default, can be taken direct."
            unit="ROS · programmatic or direct"
          />
          <Slot
            name="Sunday digest"
            where="Single line in the weekly email and its web preview."
            look="‘Sunday sponsor · Vendor — one sentence ↗’. Nothing else."
            unit="1 per issue · weekly"
          />
        </Section>

        <Section title="What we need from you">
          <ul className="list-disc space-y-2 pl-5">
            <li>Program name, public URL, and the exact credit value on offer.</li>
            <li>Who qualifies — honest answer, not marketing copy.</li>
            <li>Your preferred CTA (≤ 3 words) and tracking URL.</li>
            <li>
              A monochromatic logo or the official domain — we render brand
              marks from our self-hosted SVG library (built on simple-icons).
            </li>
          </ul>
        </Section>

        <Section title="Pricing">
          <p>
            We keep it simple: weekly flat rate by slot, billed up front, no
            auction. The goal is a sustainable, tasteful index — not
            maximizing RPM on day one. Email for current rates.
          </p>
        </Section>

        <p className="pt-2">
          Send a note to{" "}
          <a
            className="editorial-link text-[color:var(--gold)]"
            href="mailto:sponsor@aicreditladder.com"
          >
            sponsor@aicreditladder.com
          </a>{" "}
          with your program, credit, and target founder profile. Short is
          good. We usually reply same week.
        </p>

        <p className="text-[13px] text-[color:var(--muted)]">
          Not a sponsor? Keep reading the{" "}
          <Link
            href="/"
            className="underline-offset-4 hover:text-[color:var(--foreground)] hover:underline"
          >
            ledger
          </Link>
          .
        </p>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="mono text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--foreground)]">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Slot({
  name,
  where,
  look,
  unit,
}: {
  name: string;
  where: string;
  look: string;
  unit: string;
}) {
  return (
    <div className="mb-4 border-t border-[color:var(--rule)] pt-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="display text-[17px] leading-tight text-[color:var(--foreground)] sm:text-[19px]">
          {name}
        </h3>
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
          {unit}
        </span>
      </div>
      <p className="mt-1.5 text-[13.5px] leading-[1.55]">
        <span className="text-[color:var(--foreground)]">Where.</span> {where}
      </p>
      <p className="mt-1 text-[13.5px] leading-[1.55]">
        <span className="text-[color:var(--foreground)]">Look.</span> {look}
      </p>
    </div>
  );
}
