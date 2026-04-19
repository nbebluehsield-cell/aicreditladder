import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { VendorMark } from "@/components/VendorMark";
import { ApplyUnlock } from "@/components/ApplyUnlock";
import { OfferEngagementTracker } from "@/components/analytics/OfferEngagementTracker";
import { AdSlot } from "@/components/ads/AdSlot";
import { getOffers, getOfferBySlug } from "@/lib/offers-source";
import { isAuthenticated } from "@/lib/auth";
import { formatAmount } from "@/lib/formatAmount";
import { freshness } from "@/lib/freshness";
import { SITE_URL } from "@/lib/site-url";
import type { Offer } from "@/lib/types";

type Params = { slug: string };

export async function generateStaticParams() {
  const all = await getOffers();
  return all.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: "Not found" };
  const { main, unit } = formatAmount(offer);
  const value = unit ? `${main} ${unit}` : main;
  const description = `${offer.vendor} credits for solo founders — ${value}. Verified eligibility, apply time, and what you actually get.`;
  const url = `${SITE_URL}/offers/${offer.slug}`;
  return {
    title: `${offer.title} — ${offer.vendor}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${offer.title} — ${offer.vendor}`,
      description,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: offer.title, description },
  };
}

/**
 * Offer detail — premium editorial layout.
 *
 * Rhythm
 * ──────
 *   • Tighter vertical pad + `wide` container so the offer reads as a
 *     dense product sheet, not a spread layout.
 *   • Identity → title → {amount/fit/chips → CTA → notes} — one column
 *     on mobile; ≥lg adds a narrow sticky rail (320–340px).
 *   • Section bands use reduced mt/pt vs marketing pages; spec grid
 *     gaps stay readable on small screens.
 *
 * Anti-patterns avoided
 * ─────────────────────
 *   • Apply button before the reader knows the amount.
 *   • Three repeated sign-in stubs — consolidated into one unlock card.
 *   • Back crumb shoved into the masthead instead of the page itself.
 */
export default async function OfferPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const authed = await isAuthenticated();
  const publicOffer = maskForAnonymous(offer, authed);
  const formatted = formatAmount(publicOffer);
  const { main: amountMain, unit: amountUnit, qualifier: amountQualifier } =
    formatted;
  const longAmount =
    !publicOffer.credit_value_amount || publicOffer.credit_value_amount <= 0
      ? amountMain.length > 18
      : false;
  const fitSentence = buildFitSentence(publicOffer);

  return (
    <div className="flex flex-1 flex-col">
      <OfferEngagementTracker
        offerSlug={publicOffer.slug}
        vendor={publicOffer.vendor}
        offerTitle={publicOffer.title}
      />
      <OfferJsonLd offer={publicOffer} />
      <Container
        size="wide"
        className="pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20"
      >
        {/* ─── Back crumb ──────────────────────────────────────────── */}
        <div className="mb-5 sm:mb-8 lg:mb-10">
          <Link
            href="/"
            prefetch
            className="mono focus-ring inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
          >
            <span aria-hidden>←</span>
            <span>The Ladder</span>
          </Link>
        </div>

        {/* ─── Identity row ────────────────────────────────────────── */}
        <header className="flex items-start gap-3 sm:gap-4">
          <span className="mt-1 shrink-0 sm:hidden">
            <VendorMark
              vendor={publicOffer.vendor}
              officialUrl={publicOffer.official_url}
              logoUrl={publicOffer.logo_url}
              size={44}
              tone="bright"
            />
          </span>
          <span className="mt-1 hidden shrink-0 sm:inline-flex">
            <VendorMark
              vendor={publicOffer.vendor}
              officialUrl={publicOffer.official_url}
              logoUrl={publicOffer.logo_url}
              size={52}
              tone="bright"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {publicOffer.vendor}
            </p>
            <h1 className="display mt-1.5 text-[24px] leading-[1.1] tracking-[-0.01em] sm:mt-2 sm:text-[30px] lg:text-[36px] lg:leading-[1.06]">
              {publicOffer.title}
            </h1>
          </div>
        </header>

        {/* ─── Two-column body (tighter rail + gap; still stacks <lg) ─ */}
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:mt-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:gap-x-10 lg:gap-y-10 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-12">
          {/* ── Narrative column ─────────────────────────────────── */}
          <div className="min-w-0">
            {/* Mobile/tablet: amount lives INSIDE narrative flow so the
                reader learns the stat before the CTA. Hidden ≥lg where
                the sticky rail carries it. */}
            <AmountBlock
              qualifier={amountQualifier}
              main={amountMain}
              unit={amountUnit}
              duration={publicOffer.duration}
              long={longAmount}
              className="mb-6 sm:mb-8 lg:hidden"
            />

            {/* Fit sentence — real prose, not a dot-separated data
                dump. Two or three short sentences that answer "is this
                for me?" in human English. */}
            <p className="max-w-[52ch] text-[15px] leading-[1.58] text-[color:var(--foreground-dim)] sm:text-[16px] sm:leading-[1.55] lg:text-[17px]">
              {fitSentence}
            </p>

            {/* Mobile CTA — sits exactly where the decision is made:
                after amount + fit. Hidden ≥lg where the sticky rail
                carries it. */}
            <div className="mt-6 sm:mt-8 lg:hidden">
              <ApplyUnlock
                authed={authed}
                applyUrl={publicOffer.application_url}
                vendor={publicOffer.vendor}
                offerSlug={publicOffer.slug}
                offerTitle={publicOffer.title}
              />
              <FreshnessNote offer={publicOffer} className="mt-4" />
            </div>

            {/* ─── What you get ─────────────────────────────────
                Ungated. The actual products, intended use, and any
                caveats — answers "is this real, and is it for me?"
                before the reader clicks apply. */}
            {(hasItems(publicOffer.eligible_products) ||
              hasItems(publicOffer.best_for) ||
              hasItems(publicOffer.restrictions)) && (
              <section className="mt-10 border-t border-[color:var(--rule)] pt-8 sm:mt-12 sm:pt-10">
                <p className="section-number">What you get</p>

                {hasItems(publicOffer.eligible_products) && (
                  <ul className="mt-5 space-y-2.5 text-[14.5px] leading-[1.5] text-[color:var(--foreground-dim)] sm:text-[15px]">
                    {publicOffer.eligible_products!.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[0.7em] h-px w-3 shrink-0 bg-[color:var(--rule-3)]"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {hasItems(publicOffer.best_for) && (
                  <div className="mt-6">
                    <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted-2)]">
                      Best for
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {publicOffer.best_for!.map((tag) => (
                        <li
                          key={tag}
                          className="border border-[color:var(--rule-2)] px-2 py-1 text-[12.5px] leading-none tracking-[0.01em] text-[color:var(--foreground-dim)]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasItems(publicOffer.restrictions) && (
                  <div className="mt-6 border-l-2 border-[color:var(--gold)] pl-4">
                    <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
                      Watch out
                    </p>
                    <ul className="mt-2.5 space-y-1.5 text-[14.5px] leading-[1.6] text-[color:var(--foreground-dim)]">
                      {publicOffer.restrictions!.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* ─── How it works ─────────────────────────────────
                Datasheet view, grouped into three semantic bands so
                the eye lands on the right answer immediately:
                  · The application — how long, how hard
                  · The program     — what you actually receive
                  · Who qualifies   — the fit gates */}
            <section className="mt-10 border-t border-[color:var(--rule)] pt-8 sm:mt-12 sm:pt-10">
              <p className="section-number">How it works</p>

              <div className="mt-5 space-y-6 sm:space-y-7">
                <SpecGroup title="The application">
                  <SpecItem
                    label="Time to apply"
                    value={
                      publicOffer.apply_time_minutes
                        ? `~${publicOffer.apply_time_minutes} min`
                        : null
                    }
                  />
                  <SpecItem
                    label="Review"
                    value={publicOffer.review_time_estimate}
                  />
                  <SpecItem
                    label="Difficulty"
                    value={
                      publicOffer.difficulty_score
                        ? `${publicOffer.difficulty_score}/5`
                        : null
                    }
                  />
                </SpecGroup>

                <SpecGroup title="The program">
                  <SpecItem label="Duration" value={publicOffer.duration} />
                  <SpecItem
                    label="Renewal"
                    value={formatRenewal(publicOffer.renewal_type)}
                  />
                  <SpecItem
                    label="Credit type"
                    value={formatCreditType(publicOffer.credit_type)}
                  />
                </SpecGroup>

                <SpecGroup title="Who qualifies">
                  <SpecItem
                    label="Stage"
                    value={humanize(publicOffer.company_stage)}
                  />
                  <SpecItem
                    label="Funding"
                    value={humanize(publicOffer.funding_requirement)}
                  />
                  <SpecItem
                    label="Solo founder"
                    value={formatYesNo(publicOffer.solo_founder_friendly)}
                  />
                  <SpecItem
                    label="Entity"
                    value={
                      publicOffer.requires_company_registration
                        ? "Required"
                        : "Not needed"
                    }
                  />
                  <SpecItem
                    label="Referral"
                    value={
                      publicOffer.requires_partner_referral
                        ? "Required"
                        : "Not needed"
                    }
                  />
                  <SpecItem
                    label="VC backing"
                    value={
                      publicOffer.requires_vc_backing
                        ? "Required"
                        : "Not needed"
                    }
                  />
                </SpecGroup>
              </div>
            </section>

            {/* ─── Founder notes ─────────────────────────────────
                When signed in: three concrete blocks with real tips.
                When anonymous: a slim strip at the end of the page —
                an invitation, not the main content. */}
            {authed ? (
              <section className="mt-10 border-t border-[color:var(--rule)] pt-8 sm:mt-12 sm:pt-10">
                <p className="section-number">Founder notes</p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
                  <NoteBlock title="How to apply well">
                    {publicOffer.application_tips ? (
                      <p>{publicOffer.application_tips}</p>
                    ) : null}
                  </NoteBlock>
                  <NoteBlock title="Have ready">
                    {publicOffer.documents_needed?.length ? (
                      <ul className="list-disc space-y-1 pl-4">
                        {publicOffer.documents_needed.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : null}
                  </NoteBlock>
                  <NoteBlock title="Watch for">
                    {publicOffer.common_rejection_reasons?.length ? (
                      <ul className="list-disc space-y-1 pl-4">
                        {publicOffer.common_rejection_reasons.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : null}
                  </NoteBlock>
                </div>
              </section>
            ) : (
              <UnlockStrip />
            )}
          </div>

          {/* ── Desktop action rail ──────────────────────────────── */}
          <aside className="hidden lg:sticky lg:top-[calc(var(--masthead-clearance)+0.75rem)] lg:block lg:self-start">
            <AmountBlock
              qualifier={amountQualifier}
              main={amountMain}
              unit={amountUnit}
              duration={publicOffer.duration}
              long={longAmount}
            />
            <div className="mt-6">
              <ApplyUnlock
                authed={authed}
                applyUrl={publicOffer.application_url}
                vendor={publicOffer.vendor}
                offerSlug={publicOffer.slug}
                offerTitle={publicOffer.title}
              />
              <FreshnessNote offer={publicOffer} className="mt-4" />
            </div>
          </aside>
        </div>
      </Container>

      {/* Sponsored rail — separated from the notes by generous air so
          it reads as its own editorial block, not a footer scrap. */}
      <div className="mt-6 sm:mt-8 lg:mt-10">
        <AdSlot placement="offer_rail" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Pieces
   ───────────────────────────────────────────────────────────────────── */

/**
 * The value display.
 *
 * When `main` is a short phrase (dollar amounts, "Free Hobby", etc.)
 * it renders as the big display number — the hero stat.
 *
 * When it's long prose ("Free serverless inference with monthly
 * quota"), we swap to an italic Instrument Serif treatment: it reads
 * as an editorial subhead, not a forced dollar amount, and scales
 * down sensibly so it doesn't devour the viewport.
 */
function AmountBlock({
  qualifier,
  main,
  unit,
  duration,
  long,
  className,
}: {
  qualifier: string | null;
  main: string;
  unit: string;
  duration: string | null;
  long: boolean;
  className?: string;
}) {
  const u = unit.trim();
  const d = duration?.trim() ?? "";
  const secondLine = (() => {
    if (u && d && !unitIncludesDuration(u, d)) return `${u} · ${d}`;
    if (u) return u;
    if (d) return d;
    return "";
  })();

  return (
    <div className={className}>
      {qualifier && !long && (
        <p className="mono mb-2 text-[10px] uppercase tracking-[0.26em] text-[color:var(--muted-2)]">
          {qualifier}
        </p>
      )}
      <p
        className={
          long
            ? "italic-display text-[color:var(--foreground)] text-[22px] leading-[1.2] sm:text-[26px] sm:leading-[1.18] lg:text-[28px] lg:leading-[1.15]"
            : "display tabular-nums text-[color:var(--foreground)] text-[34px] leading-[0.95] tracking-[-0.015em] sm:text-[40px] lg:text-[44px]"
        }
      >
        {main}
      </p>
      {secondLine && (
        <p className="mt-3 font-sans text-[13.5px] leading-[1.45] text-[color:var(--foreground-dim)] sm:text-[14px]">
          {secondLine}
        </p>
      )}
    </div>
  );
}

function unitIncludesDuration(unit: string, duration: string): boolean {
  const low = duration.trim().toLowerCase();
  if (low.length < 3) return false;
  return unit.toLowerCase().includes(low);
}

function FreshnessNote({
  offer,
  className = "",
}: {
  offer: Offer;
  className?: string;
}) {
  const f = freshness(offer.last_verified_at);
  const tone =
    f.tone === "fresh"
      ? "text-[color:var(--teal)]"
      : f.tone === "stale"
      ? "text-[color:var(--gold)]"
      : "text-[color:var(--muted)]";
  return (
    <p
      className={`mono text-[10.5px] uppercase leading-[1.7] tracking-[0.22em] text-[color:var(--muted)] ${className}`}
    >
      <span className={tone}>{f.long}</span>
      <span className="text-[color:var(--muted-2)]"> · </span>
      <Link
        href={offer.official_url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:text-[color:var(--foreground)] hover:underline"
      >
        Source ↗
      </Link>
    </p>
  );
}

function NoteBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const empty =
    !children ||
    (Array.isArray(children) && children.filter(Boolean).length === 0);
  return (
    <div className="border-t border-[color:var(--rule)] pt-5">
      <p className="mono mb-3 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        {title}
      </p>
      {empty ? (
        <p className="text-[13.5px] text-[color:var(--muted)]">—</p>
      ) : (
        <div className="text-[14.5px] leading-[1.6] text-[color:var(--foreground-dim)]">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Slim unlock strip — sits at the end of the page, an invitation
 * rather than a wall. Anonymous readers have already seen what they
 * need to decide (amount, fit, products, timing, restrictions) in the
 * ungated sections above; the strip is a "want the founder-only
 * playbook?" bonus, not a gate.
 */
function UnlockStrip() {
  return (
    <aside className="mt-10 flex flex-col gap-4 border-t border-[color:var(--rule)] pt-8 sm:mt-12 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:pt-10">
      <div className="max-w-prose">
        <p className="section-number">Founder notes</p>
        <p className="mt-3 text-[14.5px] leading-[1.55] text-[color:var(--foreground-dim)] sm:text-[15px]">
          Sign in for the tips, docs to queue up, and rejection reasons
          founders hit on this program.
        </p>
      </div>
      <Link
        href="/auth/login"
        prefetch
        className="mono inline-flex shrink-0 items-center gap-2 self-start border-b-2 border-[color:var(--gold)] pb-1.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-[color:var(--background)] sm:self-auto"
      >
        Unlock · magic link
        <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}

/**
 * A labelled band inside the "How it works" datasheet. The small italic
 * rubric sits tight to the top of a 3-column data grid, giving the
 * reader one sentence of orientation before the dense data rows. On
 * mobile the grid collapses to two columns.
 */
function SpecGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="italic-display text-[14px] leading-none text-[color:var(--muted)] sm:text-[15px]">
        {title}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-4">
        {children}
      </dl>
    </div>
  );
}

/**
 * One line of the spec grid: small uppercase label over a human value.
 * Renders an em-dash when the value is missing so the grid still holds
 * rhythm instead of collapsing unevenly.
 */
function SpecItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0">
      <dt className="mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-2)]">
        {label}
      </dt>
      <dd className="mt-1.5 text-[14px] leading-[1.4] text-[color:var(--foreground-dim)] sm:text-[14.5px]">
        {value && value.trim() ? value : "—"}
      </dd>
    </div>
  );
}

/**
 * schema.org JSON-LD for the offer — gives Google a structured
 * understanding of each program (Offer on a Product/Organization),
 * unlocking rich results and making ACL's listings attributable.
 */
function OfferJsonLd({ offer }: { offer: Offer }) {
  const url = `${SITE_URL}/offers/${offer.slug}`;
  const priceSpec =
    offer.credit_value_amount && offer.credit_value_amount > 0
      ? {
          "@type": "UnitPriceSpecification",
          price: offer.credit_value_amount,
          priceCurrency: offer.credit_value_currency || "USD",
          valueAddedTaxIncluded: false,
        }
      : undefined;
  const data = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.title,
    url,
    description: offer.value_display,
    category: "Startup credits",
    availability:
      offer.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/Discontinued",
    seller: {
      "@type": "Organization",
      name: offer.vendor,
      url: offer.official_url,
    },
    ...(priceSpec ? { priceSpecification: priceSpec } : {}),
    ...(offer.last_verified_at
      ? { validThrough: offer.last_verified_at }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function hasItems(xs: readonly unknown[] | null | undefined): boolean {
  return Array.isArray(xs) && xs.length > 0;
}

/**
 * Lift a lowercase taxonomy value ("any", "pre-seed", "none") into
 * Title Case for human display while leaving already-cased strings
 * ("No VC required") untouched.
 */
function humanize(v: string | null | undefined): string | null {
  if (!v) return null;
  if (v !== v.toLowerCase()) return v;
  return v.replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

function formatRenewal(r: Offer["renewal_type"]): string | null {
  switch (r) {
    case "one_time":
      return "One-time";
    case "monthly":
      return "Monthly";
    case "daily":
      return "Daily";
    case "annual":
      return "Annual";
    case "unknown":
    default:
      return null;
  }
}

function formatCreditType(t: Offer["credit_type"]): string {
  switch (t) {
    case "ai_api":
      return "AI API credits";
    case "cloud":
      return "Cloud credits";
    case "saas":
      return "SaaS credits";
    case "mixed":
    default:
      return "Mixed stack";
  }
}

function formatYesNo(v: Offer["solo_founder_friendly"]): string {
  switch (v) {
    case "yes":
      return "Welcome";
    case "no":
      return "Not a fit";
    case "unclear":
    default:
      return "Case by case";
  }
}

/**
 * Build a short, human fit paragraph — one or two real sentences, not
 * a dot-separated data dump. The goal is to answer "is this for me?"
 * in the voice of a magazine buyer's note, while the spec grid below
 * carries the structured facts.
 */
function buildFitSentence(offer: Offer): string {
  const parts: string[] = [];

  // Sentence 1 — who it's open to.
  const openers: string[] = [];
  if (offer.solo_founder_friendly === "yes") {
    openers.push("Open to solo founders");
  } else if (offer.solo_founder_friendly === "no") {
    openers.push("Built for teams, not solo founders");
  } else {
    openers.push("Solo-founder fit is case-by-case");
  }
  if (offer.requires_vc_backing) {
    openers.push("VC backing is expected");
  } else if (offer.requires_partner_referral) {
    openers.push("a partner or accelerator referral helps");
  } else {
    openers.push("no VC or referral needed");
  }
  if (offer.requires_company_registration) {
    openers.push("a registered entity is expected");
  }
  parts.push(openers.join(", ") + ".");

  // Sentence 2 — how much work it is.
  const timing: string[] = [];
  if (offer.apply_time_minutes) {
    const mins = offer.apply_time_minutes;
    timing.push(
      mins <= 3
        ? `two to three minutes to apply`
        : mins <= 10
        ? `about ${mins} minutes to apply`
        : `around ${mins} minutes to apply`
    );
  }
  if (offer.review_time_estimate) {
    const review = offer.review_time_estimate.trim().toLowerCase();
    // Any "instant…" value reads best as a single crisp clause; the
    // full qualifier ("Instant baseline tier", etc.) still surfaces
    // verbatim in the spec grid below.
    if (review.includes("instant")) {
      timing.push("approval is near-instant");
    } else {
      timing.push(`hear back ${review}`);
    }
  }
  if (timing.length > 0) {
    parts.push(capitalize(timing.join(", ")) + ".");
  }

  return parts.join(" ");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function maskForAnonymous(offer: Offer, authed: boolean): Offer {
  if (authed) return offer;
  return {
    ...offer,
    application_tips: null,
    documents_needed: null,
    common_rejection_reasons: null,
  };
}
