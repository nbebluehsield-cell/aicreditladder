import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { ProjectTypeStrip } from "@/components/ProjectTypeStrip";
import { WorkflowBlurb } from "@/components/WorkflowBlurb";
import { SundayDigest } from "@/components/SundayDigest";
import { AdSlot } from "@/components/ads/AdSlot";
import { SponsorCard } from "@/components/ads/SponsorCard";
import {
  CREDIT_PATH_META,
  CREDIT_PATH_ORDER,
  bucketOffersByCreditPath,
  creditPathSlug,
  type CreditPath,
} from "@/lib/credit-path";
import { getOffers } from "@/lib/offers-source";
import { sortOffers } from "@/lib/offers";
import type { Offer } from "@/lib/types";
import { SITE_URL } from "@/lib/site-url";
import {
  SITE_DESCRIPTION,
  SITE_OG_DESCRIPTION,
  SITE_TITLE_DEFAULT,
} from "@/lib/site-seo";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE_DEFAULT },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: SITE_TITLE_DEFAULT,
    description: SITE_OG_DESCRIPTION,
  },
};

/**
 * Homepage — verified credit programs by claim path.
 *
 * Workflow blurb → project types (each links to a filtered page) → full
 * index below grouped by claim path. Order matches how founders read it.
 */

export default async function Home() {
  const all = await getOffers();
  const offers = sortOffers(all, "recommended");

  return (
    <div className="flex flex-1 flex-col">
      <WorkflowBlurb />

      <ProjectTypeStrip />

      <section id="credits" className="scroll-mt-20">
        <Container size="xwide" className="pb-2 pt-0 sm:pb-3 sm:pt-1">
          <LadderLedger offers={offers} />
        </Container>
      </section>

      <SundayDigest />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Programs by claim path — homepage index (Now → Next → Later buckets).
   ───────────────────────────────────────────────────────────────────── */

function LadderLedger({ offers }: { offers: Offer[] }) {
  const bucketed = bucketOffersByCreditPath(offers);

  return (
    <>
      <div className="flex flex-col gap-2 px-1 pb-4 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:px-2 sm:pb-5 sm:pt-6 lg:px-3 lg:pt-8">
        <div className="min-w-0">
          <h2 className="display text-[26px] leading-[1.04] tracking-[-0.032em] text-[color:var(--foreground)] sm:text-[34px] lg:text-[40px]">
            Every program,{" "}
            <span className="italic-display text-[color:var(--foreground-dim)]">
              sequenced by claim path.
            </span>
          </h2>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[color:var(--foreground-dim)] sm:text-[14px]">
            <PulseDot />
            <span className="num text-[color:var(--foreground)]">
              {offers.length}
            </span>
            <span>programs</span>
            <span className="text-[color:var(--muted-2)]">·</span>
            <span>Sign up → startup program → partner path</span>
          </p>
        </div>
        <Link
          href="/explore"
          prefetch
          className="shrink-0 text-[13px] text-[color:var(--gold)] underline-offset-4 hover:underline"
        >
          Sort &amp; filter →
        </Link>
      </div>

      <div className="mt-2 sm:mt-3">
        <SponsorCard tier="homepage" />
        {CREDIT_PATH_ORDER.map((path, si) => {
          const rows = bucketed[path];
          if (rows.length === 0) return null;
          const meta = CREDIT_PATH_META[path];
          return (
            <div key={path}>
              <CreditPathBand
                creditPath={path}
                label={meta.label}
                note={meta.note}
                count={rows.length}
                isFirstBand={si === 0}
              />
              {rows.map((o, i) => (
                <OfferCard key={o.id} offer={o} index={i} />
              ))}
              {path === "signup" && <AdSlot placement="home_inline" />}
            </div>
          );
        })}
      </div>
    </>
  );
}

function CreditPathBand({
  creditPath,
  label,
  note,
  count,
  isFirstBand,
}: {
  creditPath: CreditPath;
  label: string;
  note: string;
  count: number;
  isFirstBand?: boolean;
}) {
  const qs = `?path=${creditPathSlug(creditPath)}`;
  return (
    <div
      className={
        isFirstBand
          ? "relative mt-0 flex flex-col gap-3 pb-1 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-5 lg:pt-6"
          : "relative mt-8 flex flex-col gap-4 border-t border-[color:var(--rule-2)] pb-2 pt-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:pt-8 lg:pt-9"
      }
    >
      <div className="flex min-w-0 flex-col gap-1.5 px-1 sm:gap-2 sm:px-2 lg:px-3">
        <h3 className="display text-[22px] leading-[1.04] tracking-[-0.028em] text-[color:var(--foreground)] sm:text-[28px] sm:leading-[1.05] lg:text-[30px]">
          {label}
          <span className="italic-display font-normal text-[color:var(--foreground-dim)]">.</span>
        </h3>
        <p className="max-w-[60ch] text-[13.5px] leading-[1.55] text-[color:var(--foreground-dim)] sm:text-[14.5px]">
          {note}
        </p>
      </div>
      <Link
        href={`/explore${qs}`}
        prefetch
        className="shrink-0 self-start px-1 text-[12.5px] text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--gold)] hover:underline sm:self-end sm:px-2 lg:px-3"
      >
        <span className="num text-[color:var(--foreground)]">{count}</span>{" "}
        programs →
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Shared bits
   ───────────────────────────────────────────────────────────────────── */

function PulseDot() {
  return (
    <span
      aria-hidden
      className="pulse-dot inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-[color:var(--gold)] text-[color:var(--gold)]"
    />
  );
}
