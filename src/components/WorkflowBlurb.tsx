import Link from "next/link";
import { getOffers } from "@/lib/offers-source";
import { VendorMark } from "@/components/VendorMark";
import type { Offer } from "@/lib/types";

/**
 * Homepage hero — one headline, one line of subcopy, one action, one
 * ladder. Right rail reads top → bottom as **progress** (start here → go big),
 * with warm labels and value lines that sound like wins, not fine print.
 */

const HERO_PICKS = {
  now: ["groq-developer-free-tier", "cerebras-inference-free", "google-ai-studio-free"],
  next: ["neon-for-startups", "microsoft-for-startups-founders-hub", "aws-activate"],
  later: ["google-for-startups-cloud", "anthropic-for-startups"],
} as const;

function pick(offers: Offer[], slugs: readonly string[]): Offer | undefined {
  for (const s of slugs) {
    const hit = offers.find((o) => o.slug === s);
    if (hit) return hit;
  }
  return undefined;
}

export async function WorkflowBlurb() {
  const offers = await getOffers();

  /* Top → bottom: quick win → scale → biggest pool (inviting progression) */
  const rungs = (
    [
      { stage: "now" as const, offer: pick(offers, HERO_PICKS.now) },
      { stage: "next" as const, offer: pick(offers, HERO_PICKS.next) },
      { stage: "later" as const, offer: pick(offers, HERO_PICKS.later) },
    ] as const
  ).filter((r): r is { stage: "now" | "next" | "later"; offer: Offer } =>
    Boolean(r.offer),
  );

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden border-b border-[color:var(--rule)] bg-[color:var(--background)]"
    >
      <div className="relative mx-auto grid w-full max-w-[1560px] grid-cols-12 items-center gap-6 page-gutter-x pb-10 pt-8 sm:gap-8 sm:pb-14 sm:pt-12 lg:gap-16 lg:pb-16 lg:pt-14">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-6">
          <h1
            id="home-hero-heading"
            className="display display-tight w-full text-balance text-[clamp(26px,6.2vw,44px)] leading-[1.08] tracking-[-0.034em] text-[color:var(--foreground)] sm:text-[clamp(26px,3.2vw,48px)] sm:leading-[1.05] 2xl:whitespace-nowrap 2xl:leading-[1.02]"
          >
            Free Credits{" "}
            <span className="italic-display text-[color:var(--foreground-dim)]">
              for solo founders.
            </span>
          </h1>

          <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.55] text-[color:var(--foreground-dim)] sm:text-[16px]">
            A verified index of AI and cloud programs, organized around what
            you&rsquo;re building — built for solo founders who want clarity,
            not hype.
          </p>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link
              href="#projects"
              className="
                cta-primary-fill focus-ring inline-flex w-full items-center justify-center
                rounded-md px-6 py-3.5 sm:w-auto sm:justify-start
              "
            >
              <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 text-[14px] font-semibold leading-snug tracking-[0.01em] text-[color:var(--background)]">
                <span className="font-sans">Start with</span>
                <span className="italic-display text-[1.05em] font-normal tracking-[0]">
                  your stack
                </span>
                <span aria-hidden className="ml-0.5 font-sans font-semibold not-italic">
                  →
                </span>
              </span>
            </Link>
            <Link
              href="/explore"
              prefetch
              className="editorial-link text-center text-[13px] text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] sm:text-left"
            >
              Browse all {offers.length} →
            </Link>
          </div>
        </div>

        {/* RIGHT — the ladder, one rung per stage */}
        <aside
          className="col-span-12 lg:col-span-6"
          aria-label="Three verified programs from quick credits to full runway"
        >
          <HeroLadderRail rungs={rungs} />
        </aside>
      </div>
    </section>
  );
}

function HeroLadderRail({
  rungs,
}: {
  rungs: ReadonlyArray<{
    stage: "now" | "next" | "later";
    offer: Offer;
  }>;
}) {
  return (
    <div>
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-[color:var(--teal)]/35 via-[color:var(--gold)]/25 to-[color:var(--gold-deep)]/40 sm:left-[22px]"
        />
        <ol className="relative flex flex-col gap-3.5 sm:gap-2">
        {rungs.map(({ stage, offer }, i) => {
          const stageColor =
            stage === "now"
              ? "var(--teal)"
              : stage === "next"
              ? "var(--gold-bright)"
              : "var(--gold)";
          const stageLabel =
            stage === "now"
              ? "Start here"
              : stage === "next"
              ? "Level up"
              : "Go big";
          const applyUrl = offer.application_url || offer.official_url;
          return (
            <li
              key={offer.id}
              className="relative climb-in pl-10 sm:pl-12"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span
                aria-hidden
                className="absolute left-[14px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full sm:left-[18px]"
                style={{
                  background: stageColor,
                  boxShadow: `0 0 0 3px var(--background)`,
                }}
              />
              <div
                className="
                  group relative flex min-w-0 items-center gap-2.5
                  rounded-xl border border-[color:var(--rule-2)]/80
                  bg-[color:var(--surface)]/60
                  px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5
                  transition hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--surface-2)]/80
                "
              >
                <VendorMark
                  vendor={offer.vendor}
                  officialUrl={offer.official_url}
                  logoUrl={offer.logo_url}
                  size={30}
                  variant="bare"
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="mono text-[9.5px] uppercase tracking-[0.22em]"
                    style={{ color: stageColor }}
                  >
                    {stageLabel} · {heroValueLine(offer)}
                  </p>
                  <Link
                    href={`/offers/${offer.slug}`}
                    prefetch
                    className="display mt-0.5 block truncate text-[15.5px] leading-tight text-[color:var(--foreground)] underline-offset-2 hover:underline sm:text-[17px]"
                  >
                    {offer.vendor}
                  </Link>
                </div>
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="
                    cta-rail-out focus-ring shrink-0 inline-flex min-h-[44px] min-w-[5.25rem] items-center justify-center gap-1
                    rounded-md px-3 py-2 sm:min-h-0 sm:min-w-0 sm:justify-start sm:px-2.5 sm:py-1.5
                    text-[11px] font-medium tracking-[0.04em] sm:text-[10.5px]
                  "
                  aria-label={`Get credits from ${offer.vendor} at the source`}
                >
                  <span className="mono uppercase tracking-[0.14em]">Get credits</span>
                  <span aria-hidden className="text-[color:var(--muted-2)]">↗</span>
                </a>
              </div>
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}

/** Short, upbeat value line for the hero rail (accurate to structured amount). */
function heroValueLine(o: Offer): string {
  const amt = o.credit_value_amount;
  const vd = o.value_display?.toLowerCase() ?? "";
  if ((!amt || amt <= 0) && /free/.test(vd)) return "Free to start";
  if (!amt || amt <= 0) return "Credits available";

  if (amt >= 1_000_000) {
    const m = amt / 1_000_000;
    const s = m % 1 === 0 ? String(m) : m.toFixed(1);
    return `Up to $${s}M`;
  }
  if (amt >= 1000) {
    const k = amt / 1000;
    const fig = k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    /* Smaller floors: emphasize real credits you can use; large tiers: “up to” */
    if (amt < 25_000) return `$${fig} credits`;
    return `Up to $${fig}`;
  }
  return `$${amt.toLocaleString()} credits`;
}
