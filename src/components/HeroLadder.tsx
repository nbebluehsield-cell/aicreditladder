import type { Offer } from "@/lib/types";

/**
 * Hero signature visual: a literal ladder of 5 real offers, hand-picked
 * to tell the abundance-and-progression story at a glance.
 *
 * Bottom rung = accessible now. Top rung = the peak ($350K Google).
 * The magical middle: Microsoft Founders Hub ($150K) — solo-friendly.
 */
const LADDER_SLUGS = [
  "neon-for-startups",                      // NOW / $2.5K
  "microsoft-for-startups-founders-hub",    // NOW+NEXT / $150K — the magic
  "supabase-for-startups",                  // NEXT / $5K
  "aws-activate",                           // NEXT / $100K
  "google-for-startups-cloud",              // LATER / $350K
];

export function HeroLadder({ offers }: { offers: Offer[] }) {
  const picks = LADDER_SLUGS.map((s) => offers.find((o) => o.slug === s)).filter(
    (o): o is Offer => Boolean(o)
  );
  // Render top → bottom visually, so reverse (top = highest ladder rung)
  const rungs = [...picks].reverse();

  return (
    <div className="relative h-full w-full">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 gold-glow opacity-[0.3]"
        aria-hidden
      />

      {/* Ladder rails */}
      <div
        className="absolute top-2 bottom-2 left-[6%] w-[2px] rounded-full bg-gradient-to-b from-[color:var(--rule-3)] via-[color:var(--rule-2)] to-[color:var(--rule)]"
        aria-hidden
      />
      <div
        className="absolute top-2 bottom-2 right-[6%] w-[2px] rounded-full bg-gradient-to-b from-[color:var(--rule-3)] via-[color:var(--rule-2)] to-[color:var(--rule)]"
        aria-hidden
      />

      {/* Stage markers on the left rail */}
      <div className="pointer-events-none absolute -left-1 top-0 bottom-0 hidden w-24 sm:block">
        <span className="mono absolute top-0 left-0 text-[9.5px] uppercase tracking-[0.24em] text-[color:var(--muted-2)]">
          ↑ Later
        </span>
        <span className="mono absolute top-1/2 left-0 -translate-y-1/2 text-[9.5px] uppercase tracking-[0.24em] text-[color:var(--gold)]">
          ◐ Next
        </span>
        <span className="mono absolute bottom-0 left-0 text-[9.5px] uppercase tracking-[0.24em] text-[color:var(--teal)]">
          ● Now
        </span>
      </div>

      {/* Rungs */}
      <ol className="relative flex h-full flex-col justify-center gap-2.5 py-1">
        {rungs.map((offer, i) => {
          const stage = offer.founder_stage_fit.includes("now")
            ? "NOW"
            : offer.founder_stage_fit.includes("next")
            ? "NEXT"
            : "LATER";
          const stageColor =
            stage === "NOW"
              ? "var(--teal)"
              : stage === "NEXT"
              ? "var(--gold)"
              : "var(--muted)";
          const isBottom = i === rungs.length - 1;
          return (
            <li
              key={offer.id}
              className="climb-in"
              style={{ animationDelay: `${(rungs.length - i) * 110}ms` }}
            >
              <div className="group relative mx-[9%] flex items-center justify-between gap-3 rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)]/85 px-4 py-3.5 backdrop-blur-sm transition hover:-translate-y-px hover:border-[color:var(--gold-rule)] hover:bg-[color:var(--surface-2)]/95 sm:px-5 sm:py-4">
                {/* Left rail pin */}
                <span
                  className="absolute -left-[calc(9%+4px)] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{
                    background: isBottom ? stageColor : "transparent",
                    border: `1.5px solid ${stageColor}`,
                    boxShadow: isBottom ? `0 0 12px ${stageColor}` : "none",
                  }}
                  aria-hidden
                />
                {/* Right rail pin */}
                <span
                  className="absolute -right-[calc(9%+4px)] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{
                    background: isBottom ? stageColor : "transparent",
                    border: `1.5px solid ${stageColor}`,
                    boxShadow: isBottom ? `0 0 12px ${stageColor}` : "none",
                  }}
                  aria-hidden
                />

                <div className="min-w-0">
                  <p className="mono text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    {offer.vendor}
                  </p>
                  <p className="display mt-0.5 truncate text-[15px] leading-tight text-[color:var(--foreground)] sm:text-[17px]">
                    {offer.title}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="num text-[16px] font-medium tracking-tight text-[color:var(--gold)] sm:text-[18px]">
                    {shortValue(offer)}
                  </p>
                  <p
                    className="mono mt-0.5 text-[9.5px] uppercase tracking-[0.22em]"
                    style={{ color: stageColor }}
                  >
                    {isBottom ? "● start here" : stage === "NEXT" ? "◐ next" : stage === "NOW" ? "● now" : "○ later"}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function shortValue(o: Offer): string {
  const amt = o.credit_value_amount;
  if (!amt) return o.value_display.replace("Up to ", "").slice(0, 28);
  if (amt >= 1000) return `$${(amt / 1000).toFixed(amt % 1000 === 0 ? 0 : 1)}K`;
  return `$${amt}`;
}
