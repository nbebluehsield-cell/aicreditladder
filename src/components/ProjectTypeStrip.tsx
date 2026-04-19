import Link from "next/link";
import { PROJECT_TYPES } from "@/data/project-types";
import { getOffers } from "@/lib/offers-source";
import { VendorMark } from "@/components/VendorMark";
import type { Offer } from "@/lib/types";

/**
 * Project-type chooser — editorial tiles with real vendor marks stacked
 * inside each card. Kills the "empty rectangle" look; every tile now
 * previews what's actually inside.
 *
 * Logo selection rule (deterministic, server-side):
 *   - filter offers whose project_types includes this slug
 *   - dedupe by vendor (first occurrence wins — seed order is curated)
 *   - take the top 4 by credit value (or alphabetical fallback)
 */
export async function ProjectTypeStrip() {
  const offers = await getOffers();

  return (
    <section
      id="projects"
      aria-labelledby="project-type-heading"
      className="relative bg-[color:var(--background)] max-sm:pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:pb-0"
    >
      <div className="relative mx-auto w-full max-w-[1560px] page-gutter-x">
        {/* Heading */}
        <div className="flex flex-col gap-3 pb-5 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-7 sm:pt-5 lg:pb-8 lg:pt-6">
          <div className="min-w-0">
            <h2
              id="project-type-heading"
              className="display text-[22px] leading-[1.04] tracking-[-0.032em] text-[color:var(--foreground)] sm:text-[30px] lg:text-[36px]"
            >
              What are you{" "}
              <span className="italic-display text-[color:var(--foreground-dim)]">
                building?
              </span>
            </h2>
            <p className="mt-2.5 max-w-[52ch] text-[13.5px] leading-[1.55] text-[color:var(--foreground-dim)] sm:text-[14.5px]">
              Each tile opens the credits tagged for that stack. Real programs,
              verified at the source — not a perk dump.
            </p>
          </div>
          <div className="shrink-0 sm:pb-1">
            <Link
              href="/explore"
              prefetch
              className="text-[13px] text-[color:var(--muted)] underline-offset-4 transition hover:text-[color:var(--foreground)] hover:underline"
            >
              See every program →
            </Link>
          </div>
        </div>

        {/* Cards — single column on small screens (no sideways scroll trap) */}
        <div className="relative pb-3 sm:pb-5">
          <ul
            className="
              grid grid-cols-1 gap-3
              sm:grid-cols-2 sm:gap-4
              md:grid-cols-3 lg:grid-cols-3
            "
          >
            {PROJECT_TYPES.map((p, i) => {
              const matches = offers.filter((o) =>
                o.project_types.includes(p.slug),
              );
              const vendors = pickTopVendors(matches, 4);
              return (
                <li key={p.slug} className="min-w-0">
                  <Link
                    href={`/projects/${p.slug}`}
                    prefetch
                    title={`${p.label} — view matching credits`}
                    className="
                      project-type-card group focus-ring relative flex h-full flex-col
                      rounded-2xl border border-[color:var(--rule-2)]/90
                      bg-gradient-to-b from-[color:var(--surface)]/60 to-[color:var(--background-2)]/40
                      p-4 sm:p-5
                      shadow-[inset_0_1px_0_rgba(242,236,224,0.035)]
                      transition-[border-color,background-color,transform] duration-200
                      hover:-translate-y-px hover:border-[color:var(--rule-3)]
                      active:scale-[0.995] max-sm:active:bg-[color:var(--surface-2)]/50
                    "
                  >
                    <span
                      className="mono absolute right-4 top-4 text-[9.5px] uppercase tracking-[0.24em] text-[color:var(--muted-2)]"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Sponsor strip — bare brand marks in an editorial row.
                     *  Desaturated at rest; full-color on card hover. */}
                    <div
                      className="
                        flex min-h-[1.75rem] items-center
                        gap-x-5 gap-y-2 flex-wrap
                        sm:gap-x-6
                      "
                    >
                      {vendors.length === 0 ? (
                        <span className="eyebrow">No programs yet</span>
                      ) : (
                        vendors.map((v) => (
                          <VendorMark
                            key={v.vendor}
                            vendor={v.vendor}
                            officialUrl={v.official_url}
                            logoUrl={v.logo_url}
                            size={22}
                          />
                        ))
                      )}
                    </div>

                    {/* Label + count */}
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <span className="display min-w-0 text-left text-[18px] leading-[1.12] tracking-[-0.022em] text-[color:var(--foreground)] sm:text-[20px]">
                        {p.label}
                      </span>
                      <span
                        className="mono shrink-0 text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--muted)] transition group-hover:text-[color:var(--gold)]"
                        aria-hidden
                      >
                        {matches.length} →
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.5] text-[color:var(--foreground-dim)]">
                      {p.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pb-6 pt-2 sm:pb-8 sm:pt-3 lg:pb-10" aria-hidden />
        <div
          className="h-px bg-[color:var(--rule-2)]/70"
          role="presentation"
          aria-hidden
        />
      </div>
    </section>
  );
}

function pickTopVendors(offers: Offer[], max: number): Offer[] {
  const seen = new Set<string>();
  const deduped: Offer[] = [];
  for (const o of offers) {
    const key = o.vendor.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(o);
  }
  deduped.sort(
    (a, b) => (b.credit_value_amount ?? 0) - (a.credit_value_amount ?? 0),
  );
  return deduped.slice(0, max);
}
