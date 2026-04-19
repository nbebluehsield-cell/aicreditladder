import { Container } from "@/components/Container";

export default function OfferLoading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true" aria-label="Loading offer">
      <Container
        size="wide"
        className="pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
      >
        <div className="mb-8 h-3 w-32 rounded bg-[color:var(--rule-2)] motion-safe:animate-pulse sm:mb-10" />

        <header className="flex items-start gap-3 sm:gap-4">
          <div className="mt-1 h-[52px] w-[52px] shrink-0 rounded-lg bg-[color:var(--rule-2)]/90 motion-safe:animate-pulse" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-3 w-28 rounded bg-[color:var(--rule-2)]/60 motion-safe:animate-pulse" />
            <div className="h-8 w-full max-w-2xl rounded bg-[color:var(--rule-2)]/85 motion-safe:animate-pulse sm:h-10" />
            <div className="h-8 max-w-xl rounded bg-[color:var(--rule-2)]/65 motion-safe:animate-pulse sm:h-9" />
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-12">
          <div className="min-w-0 space-y-4">
            <div className="h-4 w-full max-w-[52ch] rounded bg-[color:var(--rule-2)]/55 motion-safe:animate-pulse" />
            <div className="h-4 w-full max-w-[48ch] rounded bg-[color:var(--rule-2)]/45 motion-safe:animate-pulse" />
            <div className="h-4 w-[90%] max-w-[42ch] rounded bg-[color:var(--rule-2)]/40 motion-safe:animate-pulse" />
            <div className="mt-8 space-y-3 border-t border-[color:var(--rule)] pt-8">
              <div className="h-3 w-28 rounded bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse" />
              <div className="h-3 w-full rounded bg-[color:var(--rule-2)]/35 motion-safe:animate-pulse" />
              <div className="h-3 w-full rounded bg-[color:var(--rule-2)]/35 motion-safe:animate-pulse" />
              <div className="h-3 w-[85%] rounded bg-[color:var(--rule-2)]/35 motion-safe:animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--masthead-clearance)+1rem)] space-y-4 rounded-lg border border-[color:var(--rule-2)] bg-[color:var(--surface)]/40 p-5">
              <div className="h-6 w-32 rounded bg-[color:var(--rule-2)]/70 motion-safe:animate-pulse" />
              <div className="h-11 w-full rounded-lg bg-[color:var(--gold)]/15 motion-safe:animate-pulse" />
              <div className="h-3 w-full rounded bg-[color:var(--rule-2)]/40 motion-safe:animate-pulse" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
