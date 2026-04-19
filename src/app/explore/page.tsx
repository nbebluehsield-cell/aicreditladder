import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { FilterTray } from "@/components/FilterTray";
import { VerificationNotice } from "@/components/VerificationNotice";
import { AdSlot } from "@/components/ads/AdSlot";
import { getOffers } from "@/lib/offers-source";
import { filterOffers, parseSearchParams, sortOffers } from "@/lib/offers";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Explore — search & filter every startup AI & cloud credit",
  description:
    "Search, sort, and filter the full directory of AI APIs, IDEs, and cloud credits — by claim path, founder stage, credit type, eligibility, and effort. Updated weekly.",
  alternates: { canonical: `${SITE_URL}/explore` },
  openGraph: {
    url: `${SITE_URL}/explore`,
    title: "Explore startup AI & cloud credits · AI Credit Ladder",
    description:
      "Full directory — filter by stack, runway stage, and how you claim credits. Built for solo founders before funding.",
  },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const { filters, sort } = parseSearchParams(sp);
  const all = await getOffers();
  const filtered = sortOffers(filterOffers(all, filters), sort);

  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <VerificationNotice compact />

      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-12 sm:py-16">
          <p className="section-number mb-4">The Index</p>
          <h1 className="display-h2 max-w-3xl">
            Every credit,
            <br />
            <span className="italic-display text-[color:var(--foreground-dim)]">
              filterable.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[14.5px] leading-[1.6] text-[color:var(--muted)]">
            {all.length} startup AI and cloud credit offers, sorted for solo
            and pre-funding founders by default. Filter by path, stage, credit
            type, eligibility, and effort.
          </p>
        </Container>
      </section>

      <FilterTray
        filters={filters}
        sort={sort}
        total={all.length}
        filtered={filtered.length}
      />

      <section>
        <Container className="py-6 sm:py-10">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="border-t border-[color:var(--rule)]">
              {filtered.map((o, i) => (
                <Fragment key={o.id}>
                  <OfferCard offer={o} />
                  {i === 9 && filtered.length > 12 && (
                    <AdSlot placement="explore_inline" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[color:var(--rule-2)] py-16 text-center">
      <p className="section-number justify-center">No matches</p>
      <p className="display mt-4 text-[28px] leading-tight">
        Nothing fits those filters.
      </p>
      <p className="mt-3 max-w-md text-[14px] text-[color:var(--muted)] mx-auto">
        Try relaxing one constraint — or reset the index to start fresh.
      </p>
      <div className="mt-8 flex justify-center">
        <Button variant="outline" size="md" className="normal-case" asChild>
          <Link href="/explore" prefetch>
            Clear all filters
          </Link>
        </Button>
      </div>
    </div>
  );
}
