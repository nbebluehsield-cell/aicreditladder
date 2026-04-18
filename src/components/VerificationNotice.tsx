import Link from "next/link";

/**
 * Pre-launch honesty banner. Surfaces the fact that data is still
 * being hand-verified so we never quietly overclaim "verified by hand"
 * while the seed file is still the source of truth.
 *
 * Remove (or render conditionally against a DB flag) once the
 * verification pass is complete.
 */
export function VerificationNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 border-y border-[color:var(--rule)] bg-[color:var(--background-2)] px-6 py-2.5">
        <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Pre-launch · Data under human verification — apply via official links only
        </p>
        <Link
          href="/methodology"
          className="editorial-link text-[11px] text-[color:var(--gold)]"
        >
          Methodology →
        </Link>
      </div>
    );
  }
  return (
    <div className="border-b border-[color:var(--rule)] bg-[color:var(--background-2)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2.5 text-[12px] text-[color:var(--foreground-dim)]">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] text-[color:var(--gold)]" />
          <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
            Pre-launch
          </span>
          <span className="hidden h-3 w-px bg-[color:var(--rule-2)] sm:inline-block" />
          <span>
            Offers below are sourced from public program pages and are being
            hand-verified. Always apply through the official link.
          </span>
        </p>
        <Link
          href="/methodology"
          className="editorial-link shrink-0 text-[11px] text-[color:var(--gold)]"
        >
          How we verify →
        </Link>
      </div>
    </div>
  );
}
