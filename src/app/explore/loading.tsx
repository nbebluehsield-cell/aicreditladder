import { Container } from "@/components/Container";
import { OfferListSkeleton } from "@/components/skeletons/OfferListSkeleton";

/**
 * Explore route loading — mirrors page structure so navigation feels instant.
 */
export default function ExploreLoading() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      {/* Compact notice strip — same vertical slot as VerificationNotice */}
      <div className="border-b border-[color:var(--rule)] bg-[color:var(--background-2)]/40">
        <div className="page-gutter-x mx-auto max-w-6xl py-2">
          <div className="h-3 w-full max-w-md rounded bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse" />
        </div>
      </div>

      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-12 sm:py-16">
          <div className="h-3 w-24 rounded bg-[color:var(--rule-2)] motion-safe:animate-pulse" />
          <div className="mt-5 h-10 max-w-lg rounded bg-[color:var(--rule-2)]/90 motion-safe:animate-pulse" />
          <div className="mt-3 h-10 max-w-sm rounded bg-[color:var(--rule-2)]/70 motion-safe:animate-pulse" />
          <div className="mt-6 h-4 max-w-xl rounded bg-[color:var(--rule-2)]/55 motion-safe:animate-pulse" />
          <div className="mt-2 h-4 max-w-lg rounded bg-[color:var(--rule-2)]/45 motion-safe:animate-pulse" />
        </Container>
      </section>

      {/* Sticky filter bar slot */}
      <div className="sticky top-[var(--masthead-clearance)] z-30 border-b border-[color:var(--rule)] bg-[color:var(--background)]/92 backdrop-blur-xl">
        <div className="page-gutter-x mx-auto flex max-w-6xl items-center gap-2 py-2.5 sm:gap-3 sm:py-3">
          <div className="h-9 min-w-0 flex-1 rounded-full bg-[color:var(--rule-2)]/60 motion-safe:animate-pulse sm:h-10" />
          <div className="hidden h-10 w-[10rem] rounded-full bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse sm:block" />
          <div className="h-9 w-[5.5rem] shrink-0 rounded-full bg-[color:var(--rule-2)]/70 motion-safe:animate-pulse sm:h-10 sm:w-[6rem]" />
        </div>
      </div>

      <section>
        <Container className="py-6 sm:py-10">
          <OfferListSkeleton rows={10} />
        </Container>
      </section>
    </div>
  );
}
