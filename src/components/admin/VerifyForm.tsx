"use client";

import { useActionState } from "react";
import { markOfferVerified, markOfferStale } from "@/app/actions/admin";

export function VerifyForm({ slug }: { slug: string }) {
  const [verifyState, verifyAction, verifyPending] = useActionState(
    markOfferVerified,
    null,
  );
  const [staleState, staleAction, stalePending] = useActionState(
    markOfferStale,
    null,
  );

  return (
    <div className="space-y-6">
      <form action={verifyAction} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="snapshot_url" className="eyebrow mb-2 block">
            Source snapshot URL
          </label>
          <input
            id="snapshot_url"
            name="snapshot_url"
            type="url"
            placeholder="https://web.archive.org/web/…"
            className="mono h-11 w-full rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 text-[12px] focus-ring"
          />
        </div>

        <div>
          <label htmlFor="confidence" className="eyebrow mb-2 block">
            Confidence (0 – 1)
          </label>
          <input
            id="confidence"
            name="confidence"
            type="number"
            step="0.05"
            min="0"
            max="1"
            defaultValue="0.9"
            className="mono h-11 w-28 rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 text-[12px] focus-ring"
          />
        </div>

        <div>
          <label htmlFor="notes" className="eyebrow mb-2 block">
            Reviewer notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mono w-full rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 py-2 text-[12px] focus-ring"
          />
        </div>

        <button
          type="submit"
          aria-busy={verifyPending}
          className="rounded-full bg-[color:var(--gold)] px-5 py-2.5 text-[13px] font-medium text-black disabled:opacity-50"
          disabled={verifyPending}
        >
          {verifyPending ? "Marking…" : "Mark verified →"}
        </button>

        <ResultMessage state={verifyState} />
      </form>

      <form action={staleAction}>
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          aria-busy={stalePending}
          className="mono rounded-full border border-[color:var(--rule-2)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)] disabled:opacity-50"
          disabled={stalePending}
        >
          {stalePending ? "…" : "Flag as stale"}
        </button>
        <ResultMessage state={staleState} />
      </form>
    </div>
  );
}

function ResultMessage({
  state,
}: {
  state: { ok: true; message: string } | { ok: false; error: string } | null;
}) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p
        role="status"
        className="mono mt-3 rounded-md border border-[color:var(--teal)]/40 bg-[color:var(--teal-soft)] p-2.5 text-[11px] text-[color:var(--teal)]"
      >
        {state.message}
      </p>
    );
  }
  return (
    <p
      role="alert"
      className="mono mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-2.5 text-[11px] text-red-300"
    >
      {state.error}
    </p>
  );
}
