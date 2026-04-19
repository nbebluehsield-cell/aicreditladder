/**
 * Loading placeholders for offer rows — matches OfferCard rhythm without
 * pretending to be real data (no fake vendor names).
 */
function OfferRowSkeleton() {
  return (
    <div className="border-b border-[color:var(--rule)] px-4 py-5 sm:px-7 sm:py-5 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
        <div className="flex min-h-[48px] items-start gap-4 sm:min-h-0 sm:flex-1">
          <div className="h-11 w-11 shrink-0 rounded-md bg-[color:var(--rule-2)]/80 motion-safe:animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
            <div className="h-4 w-[72%] max-w-md rounded bg-[color:var(--rule-2)]/90 motion-safe:animate-pulse" />
            <div className="h-3 w-40 rounded bg-[color:var(--rule-2)]/60 motion-safe:animate-pulse" />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="h-5 w-20 rounded-full bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse" />
              <span className="h-5 w-24 rounded-full bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--rule-2)] pt-4 max-sm:pl-[64px] sm:min-w-[9rem] sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:pl-0">
          <div className="min-w-0 flex-1 space-y-2 sm:text-right">
            <div className="ml-auto h-3 w-16 rounded bg-[color:var(--rule-2)]/50 motion-safe:animate-pulse sm:max-w-[8rem]" />
            <div className="ml-auto h-5 w-24 rounded bg-[color:var(--rule-2)]/70 motion-safe:animate-pulse sm:max-w-[11rem]" />
          </div>
          <div className="h-8 w-[4.5rem] shrink-0 rounded-lg bg-[color:var(--rule-2)]/80 motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function OfferListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      className="border-t border-[color:var(--rule)]"
      aria-busy="true"
      aria-label="Loading offers"
    >
      {Array.from({ length: rows }, (_, i) => (
        <OfferRowSkeleton key={i} />
      ))}
    </div>
  );
}
