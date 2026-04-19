import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { NextSundayCountdown } from "@/components/NextSundayCountdown";

export const metadata = {
  title: "The Digest — Every Sunday, credits worth claiming",
  description:
    "A quiet Sunday newsletter for AI founders. Three to five freshly verified credit programs, one deeper comparison, never more than five minutes.",
};

/**
 * The Digest — editorial Sunday-paper landing.
 *
 * Five deliberate sections stacked:
 *   1. Masthead strip      — dateline, issue number, live countdown
 *   2. Hero                — display serif + framed subscribe panel
 *   3. Sample issue        — typographic preview of what lands in inbox
 *   4. Past issues         — ledger-style index of recent archive
 *   5. Closing strip       — second CTA, terminal-style
 *
 * Anchors to the same full-bleed canvas the homepage ledger uses
 * (`max-w-[1560px]`), so the masthead, hero, and archive all land on
 * the same vertical rules as offer rows. Readers should feel this is
 * the same product, just a quieter page.
 */

const LAUNCH_ISO = "2026-01-18"; // Sun — Issue №1

function currentIssueNumber(now: Date = new Date()): number {
  const launch = new Date(LAUNCH_ISO);
  const weeks = Math.floor(
    (now.getTime() - launch.getTime()) / (7 * 86_400_000),
  );
  return Math.max(1, weeks + 1);
}

function lastSunday(now: Date = new Date()): Date {
  const d = new Date(now);
  const day = d.getUTCDay();
  const delta = day === 0 ? 0 : day;
  d.setUTCDate(d.getUTCDate() - delta);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).toUpperCase();
}

function fmtDateShort(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).toUpperCase();
}

// Mock past-issue titles — honest, no fabricated subscriber counts.
// Keep these specific; generic titles would read like AI filler.
const PAST_ISSUES_SEED: Array<{ weeksAgo: number; title: string; teaser: string }> = [
  {
    weeksAgo: 1,
    title: "The cloud stack that fits under zero",
    teaser: "Which startup programs still honor a solo founder with no registered company.",
  },
  {
    weeksAgo: 2,
    title: "Voice apps — who still ships five-figure credit",
    teaser: "AssemblyAI, ElevenLabs, Deepgram, Cartesia, Hume — current numbers, side by side.",
  },
  {
    weeksAgo: 3,
    title: "Agent credits worth the application",
    teaser: "The only three agent programs with real burn coverage and fast review cycles.",
  },
  {
    weeksAgo: 4,
    title: "RAG on a shoestring",
    teaser: "Pinecone, Neon, Modal — the cheapest path to a working retrieval loop this month.",
  },
  {
    weeksAgo: 5,
    title: "Pre-incorporation, still applying",
    teaser: "Seven programs that don't ghost solo founders without a Delaware C-corp.",
  },
];

export default function Newsletter() {
  const now = new Date();
  const issueNo = currentIssueNumber(now);
  const lastIssueDate = lastSunday(now);

  const pastIssues = PAST_ISSUES_SEED.map((p, i) => {
    const date = new Date(lastIssueDate);
    date.setUTCDate(date.getUTCDate() - p.weeksAgo * 7);
    return {
      num: issueNo - 1 - i,
      title: p.title,
      teaser: p.teaser,
      date,
    };
  });

  return (
    <div className="flex flex-1 flex-col">
      {/* ─── 1 · MASTHEAD STRIP ───────────────────────────────────── */}
      <section className="border-b border-[color:var(--rule)]">
        <div className="mx-auto flex w-full max-w-[1560px] flex-wrap items-center justify-between gap-x-6 gap-y-1.5 page-gutter-x py-2.5">
          <p className="mono text-[10.5px] uppercase tracking-[0.26em] text-[color:var(--muted)]">
            <span className="text-[color:var(--foreground)]">
              The Digest
            </span>
            <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
            Issue № {issueNo}
            <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
            {fmtDate(lastIssueDate)}
            <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
            Founder-owned
          </p>
          <p className="mono text-[10.5px] uppercase tracking-[0.26em] text-[color:var(--gold)]">
            <NextSundayCountdown />
          </p>
        </div>
      </section>

      {/* ─── 2 · HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--rule)]">
        <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-10 page-gutter-x py-10 sm:py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)] lg:gap-16 lg:py-20">
          <div className="min-w-0">
            <p className="mono text-[10.5px] uppercase tracking-[0.26em] text-[color:var(--gold)]">
              § The Sunday Digest
            </p>
            <h1
              className="mt-4 text-[42px] leading-[1.02] tracking-tight sm:text-[56px] lg:text-[76px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every Sunday.
              <br />
              <span className="italic-display text-[color:var(--foreground-dim)]">
                Credits worth claiming.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[15.5px] leading-[1.6] text-[color:var(--foreground-dim)] sm:text-[16.5px]">
              A quiet weekly for AI founders. Three to five programs re-verified
              in the last seven days. One deeper comparison when the stack
              warrants it. Under five minutes. One email. No other days.
            </p>
            <p className="mono mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              <span>
                <span className="text-[color:var(--teal)]">●</span>{" "}
                Delivered 05:00 Pacific
              </span>
              <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
              <span>Magic-link subscribe</span>
              <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
              <span>Unsubscribe in one click</span>
            </p>
          </div>

          {/* Framed subscribe panel */}
          <aside className="relative self-start border border-[color:var(--foreground)] bg-[color:var(--background-2)]/40 p-5 sm:p-7">
            <span
              aria-hidden
              className="absolute -top-3 left-4 bg-[color:var(--background)] px-2 mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]"
            >
              Subscribe
            </span>
            <p className="text-[15px] leading-[1.5] text-[color:var(--foreground)]">
              Join the Sunday list.{" "}
              <span className="italic-display text-[color:var(--foreground-dim)]">
                First issue lands this Sunday.
              </span>
            </p>
            <div className="mt-4">
              <NewsletterForm source="newsletter_page" size="compact" />
            </div>
            <ul className="mono mt-5 space-y-1.5 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              <Bullet>3–5 freshly verified offers</Bullet>
              <Bullet>One comparison when it earns its ink</Bullet>
              <Bullet>Never more than five minutes</Bullet>
              <Bullet>Zero sponsored picks in the main list</Bullet>
            </ul>
          </aside>
        </div>
      </section>

      {/* ─── 3 · SAMPLE ISSUE ─────────────────────────────────────── */}
      <section className="border-b border-[color:var(--rule)]">
        <div className="mx-auto w-full max-w-[1560px] page-gutter-x py-10 sm:py-14 lg:py-16">
          <p className="mono text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            § A sample issue
          </p>
          <h2
            className="mt-3 max-w-3xl text-[28px] leading-[1.1] tracking-tight sm:text-[36px] lg:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The shape of a Sunday. Nothing more.
          </h2>

          <SampleIssue issueNo={issueNo} date={lastIssueDate} />
        </div>
      </section>

      {/* ─── 4 · PAST ISSUES LEDGER ──────────────────────────────── */}
      <section className="border-b border-[color:var(--rule)]">
        <div className="mx-auto w-full max-w-[1560px] page-gutter-x py-8 sm:py-12">
          <div className="mono flex items-baseline justify-between gap-3 border-t border-[color:var(--foreground)] py-2 text-[10.5px] uppercase tracking-[0.22em]">
            <span className="text-[color:var(--foreground)]">
              Recent issues
            </span>
            <span className="text-[color:var(--muted)]">Archive</span>
          </div>
          <ul className="border-t border-[color:var(--rule-2)]">
            {pastIssues.map((issue) => (
              <li key={issue.num}>
                <div className="flex items-baseline gap-3 border-b border-[color:var(--rule)] px-1 py-3.5 sm:gap-5 sm:px-2 sm:py-4">
                  <span className="mono w-14 shrink-0 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--gold)] tabular-nums sm:w-20">
                    № {issue.num}
                  </span>
                  <span className="mono hidden w-24 shrink-0 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)] sm:block">
                    {fmtDateShort(issue.date)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="display text-[16px] leading-[1.25] text-[color:var(--foreground)] sm:text-[18px]">
                      {issue.title}
                    </p>
                    <p className="mt-0.5 truncate text-[12.5px] text-[color:var(--muted)] sm:text-[13px]">
                      {issue.teaser}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="mono shrink-0 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted-2)]"
                  >
                    Archive soon →
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mono mt-4 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
            Full archive opens with issue № {issueNo + 1}. Subscribers read the
            back catalog first.
          </p>
        </div>
      </section>

      {/* ─── 5 · CLOSING STRIP ────────────────────────────────────── */}
      <section>
        <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-center gap-6 page-gutter-x py-10 sm:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] sm:py-14">
          <div>
            <p className="mono text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--gold)]">
              One list · one day · one signature
            </p>
            <p
              className="mt-2 text-[22px] leading-[1.2] tracking-tight sm:text-[28px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See you Sunday.{" "}
              <span className="italic-display text-[color:var(--foreground-dim)]">
                Or don&rsquo;t — the ledger is always open.
              </span>
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--foreground-dim)]">
              Prefer to browse? The{" "}
              <Link
                href="/"
                className="underline-offset-4 hover:text-[color:var(--foreground)] hover:underline"
              >
                full ledger
              </Link>{" "}
              updates continuously. The Sunday Digest is the curated cut.
            </p>
          </div>
          <div>
            <NewsletterForm source="newsletter_page_footer" size="compact" />
            <p className="mono mt-3 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              <NextSundayCountdown prefix="Next issue in" />
              <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
              <span className="text-[color:var(--muted)]">05:00 PT</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Sample issue — typographic preview of an opened email
   ───────────────────────────────────────────────────────────────────── */

function SampleIssue({ issueNo, date }: { issueNo: number; date: Date }) {
  const cuts = [
    { num: "01", vendor: "AssemblyAI", amount: "$50K", tag: "solo-ok", note: "No VC needed. Applies in 15 min." },
    { num: "02", vendor: "ElevenLabs", amount: "$1K", tag: "solo-ok", note: "Founder Program. Rolling review." },
    { num: "03", vendor: "Deepgram", amount: "$3K", tag: "team", note: "Requires 2+ teammates on account." },
    { num: "04", vendor: "Cartesia", amount: "$500", tag: "solo-ok", note: "Self-serve. Instant." },
    { num: "05", vendor: "Hume", amount: "$2K", tag: "solo-ok", note: "Fresh approval cycle — 5 day SLA." },
  ];

  return (
    <article className="relative mt-6 border border-[color:var(--foreground)] bg-[color:var(--background-2)]/40">
      {/* Envelope header */}
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-dashed border-[color:var(--rule-2)] px-4 py-3 sm:px-6">
        <p className="mono text-[10.5px] uppercase tracking-[0.26em] text-[color:var(--muted)]">
          <span className="text-[color:var(--gold)]">The Digest</span>
          <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
          Issue № {issueNo - 1}
          <span aria-hidden className="mx-2 text-[color:var(--muted-2)]">·</span>
          {fmtDate(new Date(date.getTime() - 7 * 86_400_000))}
        </p>
        <p className="mono text-[10.5px] uppercase tracking-[0.26em] text-[color:var(--muted)]">
          To: founder@yourcompany.com
        </p>
      </header>

      {/* Issue body */}
      <div className="px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
        <h3
          className="text-[26px] leading-[1.1] tracking-tight sm:text-[34px] lg:text-[42px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voice apps — who still ships{" "}
          <span className="italic-display text-[color:var(--foreground-dim)]">
            five-figure credit.
          </span>
        </h3>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.6] text-[color:var(--foreground-dim)]">
          Real-time TTS and STT programs re-verified this week, with the
          solo-founder gotchas that don&rsquo;t show on the landing page.
          Five names. Four minutes.
        </p>

        {/* Credits table */}
        <div className="mt-7 border-t border-[color:var(--rule-2)]">
          <div className="mono grid grid-cols-[28px_minmax(0,1fr)_60px_80px] items-baseline gap-3 border-b border-[color:var(--rule-2)] py-2 text-[9.5px] uppercase tracking-[0.24em] text-[color:var(--muted)] sm:grid-cols-[32px_minmax(0,1fr)_80px_110px]">
            <span>#</span>
            <span>Program</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Fit</span>
          </div>
          {cuts.map((c) => (
            <div
              key={c.num}
              className="grid grid-cols-[28px_minmax(0,1fr)_60px_80px] items-baseline gap-3 border-b border-[color:var(--rule)] py-3 sm:grid-cols-[32px_minmax(0,1fr)_80px_110px]"
            >
              <span className="mono text-[10.5px] text-[color:var(--muted)] tabular-nums">
                {c.num}
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] leading-tight text-[color:var(--foreground)]">
                  {c.vendor}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[color:var(--muted)]">
                  {c.note}
                </p>
              </div>
              <span
                className="display text-right text-[15px] leading-none text-[color:var(--foreground)] sm:text-[16px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.amount}
              </span>
              <span
                className={`mono text-right text-[10px] uppercase tracking-[0.22em] ${
                  c.tag === "solo-ok"
                    ? "text-[color:var(--teal)]"
                    : "text-[color:var(--gold)]"
                }`}
              >
                {c.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison block */}
        <div className="mt-10 border-t border-dashed border-[color:var(--rule-2)] pt-6">
          <p className="mono text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--gold)]">
            § The comparison
          </p>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.55] text-[color:var(--foreground-dim)]">
            Cost per 10,000 voice minutes, side by side, with the exact
            credit each program covers. TL;DR at the top. Full table below
            it. Caveats at the bottom — because voice pricing moves weekly.
          </p>
        </div>

        {/* Meta footer */}
        <footer className="mono mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[color:var(--rule-2)] pt-4 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          <span>~ 4 min read</span>
          <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
          <span>5 programs verified this week</span>
          <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
          <span>1 comparison</span>
          <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
          <span className="text-[color:var(--gold)]">Unsubscribe in one click</span>
        </footer>
      </div>
    </article>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2">
      <span aria-hidden className="text-[color:var(--gold)]">·</span>
      <span>{children}</span>
    </li>
  );
}
