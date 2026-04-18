import Link from "next/link";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { FilterTray } from "@/components/FilterTray";
import { VerificationNotice } from "@/components/VerificationNotice";
import { SEED_OFFERS } from "@/data/seed";
import { filterOffers, parseSearchParams, sortOffers } from "@/lib/offers";

export const metadata = {
  title: "Explore — every AI credit, filterable · AI Credit Ladder",
  description:
    "Filter and sort the full directory of startup AI and cloud credits by founder stage, credit type, eligibility, and effort.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const { filters, sort } = parseSearchParams(sp);
  const filtered = sortOffers(filterOffers(SEED_OFFERS, filters), sort);

  return (
    <main className="flex-1 pb-24 md:pb-0">
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
            {SEED_OFFERS.length} startup AI and cloud credit offers, sorted
            for solo and pre-funding founders by default. Filter by stage,
            credit type, eligibility, and effort.
          </p>
        </Container>
      </section>

      <FilterTray
        filters={filters}
        sort={sort}
        total={SEED_OFFERS.length}
        filtered={filtered.length}
      />

      <section>
        <Container className="py-6 sm:py-10">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="border-t border-[color:var(--rule)]">
              {filtered.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
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
        Try relaxing one constraint — or{" "}
        <Link
          href="/explore"
          className="editorial-link text-[color:var(--gold)]"
        >
          clear all filters
        </Link>
        .
      </p>
    </div>
  );
}
