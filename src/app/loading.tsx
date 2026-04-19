import { Container } from "@/components/Container";
import { OfferListSkeleton } from "@/components/skeletons/OfferListSkeleton";

/**
 * Root fallback while a server segment streams — keeps navigation from
 * flashing a blank canvas.
 */
export default function RootLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-3 w-20 rounded bg-[color:var(--rule-2)] motion-safe:animate-pulse" />
            <div className="h-12 w-full max-w-lg rounded bg-[color:var(--rule-2)]/75 motion-safe:animate-pulse" />
            <div className="h-4 max-w-md rounded bg-[color:var(--rule-2)]/45 motion-safe:animate-pulse" />
          </div>
        </Container>
      </section>
      <Container size="xwide" className="pb-10 pt-6">
        <OfferListSkeleton rows={6} />
      </Container>
    </div>
  );
}
