import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { OfferCard } from "@/components/OfferCard";
import { OfferRail } from "@/components/OfferRail";
import { GatedPreview } from "@/components/GatedPreview";
import { SponsorStrip } from "@/components/SponsorStrip";
import { VerificationNotice } from "@/components/VerificationNotice";
import { Grain } from "@/components/Grain";
import { HeroLadder } from "@/components/HeroLadder";
import { Marquee } from "@/components/Marquee";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PROJECT_TYPES } from "@/data/project-types";
import { SEED_OFFERS } from "@/data/seed";
import { rails, sortOffers } from "@/lib/offers";

export default function Home() {
  const soloCount = SEED_OFFERS.filter((o) => o.solo_founder_friendly === "yes").length;
  const noVcCount = SEED_OFFERS.filter(
    (o) => !o.requires_vc_backing && !o.requires_partner_referral,
  ).length;
  const topValue = SEED_OFFERS.reduce(
    (m, o) => Math.max(m, o.credit_value_amount ?? 0),
    0,
  );

  const soloRail = rails.soloFriendly(SEED_OFFERS);
  const noVcRail = rails.noVcRequired(SEED_OFFERS);
  const valueRail = rails.highestValue(SEED_OFFERS);
  const fastRail = rails.fastestApprovals(SEED_OFFERS);

  const byStage = {
    now: SEED_OFFERS.filter((o) => o.founder_stage_fit.includes("now")),
    next: SEED_OFFERS.filter((o) => o.founder_stage_fit.includes("next")),
    later: SEED_OFFERS.filter((o) => o.founder_stage_fit.includes("later")),
  };

  // Gated preview: pick a meaty offer with real gated fields
  const previewOffer =
    SEED_OFFERS.find((o) => o.slug === "microsoft-for-startups-founders-hub") ??
    SEED_OFFERS[0];

  return (
    <main className="flex-1">
      <VerificationNotice />

      {/* ═══════════════════════════════════════════════════════════════
          HERO — SEO-shaped H1, dual CTA, HeroLadder right
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[color:var(--rule)]">
        <Grain />
        <div className="absolute inset-0 dot-grid opacity-60" aria-hidden />
        <div
          className="absolute -top-32 left-1/3 h-[700px] w-[700px] -translate-x-1/2 gold-glow opacity-[0.35]"
          aria-hidden
        />

        <Container className="relative grid grid-cols-12 gap-10 pt-14 pb-20 sm:pt-20 sm:pb-24 lg:gap-16 lg:pt-28 lg:pb-28">
          {/* LEFT — editorial */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 fade-up">
              <span className="inline-flex items-center gap-2">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] text-[color:var(--gold)]" />
                <span className="mono text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--gold)]">
                  The index · Pre-launch
                </span>
              </span>
              <span className="h-3 w-px bg-[color:var(--rule-2)]" />
              <span className="eyebrow">
                Curated · Verified · Founder-native
              </span>
            </div>

            {/* PRD H1 — Free AI Credits for Solo Founders and Early-Stage Startups */}
            <h1
              className="display-hero mt-8 max-w-[18ch] fade-up"
              style={{ animationDelay: "80ms" }}
            >
              Free AI credits for{" "}
              <span className="italic-display text-[color:var(--gold)]">
                solo founders
              </span>{" "}
              and early-stage startups.
            </h1>

            <p
              className="mt-8 max-w-xl text-[16px] leading-[1.6] text-[color:var(--foreground-dim)] sm:text-[18px] sm:leading-[1.55] fade-up"
              style={{ animationDelay: "180ms" }}
            >
              A curated index of startup AI and cloud credits — sequenced as a
              ladder, organized around the app you&apos;re actually building.
              Skip the bad-fit applications. Reduce burn before funding.
            </p>

            {/* DUAL CTA per blueprint */}
            <div
              className="mt-9 flex flex-col gap-3 fade-up sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              style={{ animationDelay: "260ms" }}
            >
              <Button href="/explore" size="lg">
                Explore credits <span aria-hidden>→</span>
              </Button>
              <Button href="/#projects" variant="secondary" size="lg">
                See credits for your project <span aria-hidden>→</span>
              </Button>
            </div>

            <div
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[color:var(--muted)] fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[color:var(--teal)]" />
                {soloCount} solo-friendly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[color:var(--gold)]" />
                {noVcCount} no-VC required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[color:var(--muted)]" />
                Up to ${(topValue / 1000).toFixed(0)}K per program
              </span>
            </div>
          </div>

          {/* RIGHT — the ladder of real offers */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative h-[460px] sm:h-[500px] lg:h-[540px]">
              <HeroLadder offers={SEED_OFFERS} />
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MARQUEE — trusted sources
          ═══════════════════════════════════════════════════════════════ */}
      <Marquee
        items={[
          "AWS Activate",
          "Google for Startups Cloud",
          "Microsoft Founders Hub",
          "Anthropic for Startups",
          "OpenAI Startup Program",
          "Cloudflare for Startups",
          "Supabase",
          "DigitalOcean Hatch",
          "Vercel for Startups",
          "Modal",
          "Together AI",
          "ElevenLabs",
          "Neon",
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════
          PROJECT TYPES
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="projects"
        className="relative overflow-hidden border-b border-[color:var(--rule)] scroll-mt-16"
      >
        <div
          className="absolute top-1/2 left-1/4 h-[400px] w-[600px] -translate-y-1/2 gold-glow opacity-[0.15]"
          aria-hidden
        />
        <Container className="relative py-14 sm:py-20">
          <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-number mb-4">01 / By project type</p>
              <h2 className="display-h2 max-w-2xl">
                Credits for what
                <br />
                you&apos;re{" "}
                <span className="italic-display text-[color:var(--gold)]">
                  actually building.
                </span>
              </h2>
            </div>
            <Link
              href="/explore"
              className="editorial-link self-start text-[13px] text-[color:var(--gold)] sm:self-end"
            >
              Full directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_TYPES.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="focus-ring group relative block min-h-[140px] bg-[color:var(--background)] p-5 transition hover:bg-[color:var(--surface)] sm:p-6"
              >
                <span className="mono absolute right-4 top-4 text-[10px] text-[color:var(--muted-2)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="display text-[22px] leading-[1.05] sm:text-[26px]">
                  {p.label}
                </p>
                <p className="mt-2 text-[13px] text-[color:var(--muted)]">
                  {p.description}
                </p>
                <span className="mt-5 flex items-center gap-2 text-[11px] text-[color:var(--muted-2)] transition group-hover:text-[color:var(--gold)]">
                  <span className="h-px w-6 bg-current transition-all group-hover:w-10" />
                  <span className="mono uppercase tracking-[0.2em]">
                    View credits →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RAILS — the four founder-native angles on the dataset
          ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-10 sm:py-14">
          <div className="mb-2">
            <p className="section-number mb-3">02 / Ways in</p>
            <h2 className="display-h2 max-w-2xl">
              Four ways to find
              <br />
              <span className="italic-display text-[color:var(--foreground-dim)]">
                the right one.
              </span>
            </h2>
          </div>

          <OfferRail
            eyebrow="Best for solo founders"
            title="Claim without a company."
            subtitle="Pre-incorporation friendly. No VC, no corporate domain, no partner required."
            offers={soloRail}
            href="/explore?solo=1"
            accent="teal"
          />
          <OfferRail
            eyebrow="No VC required"
            title="Apply on your own."
            subtitle="Programs that don't gate on funding or accelerator partners."
            offers={noVcRail}
            href="/explore?noVc=1&noPartner=1"
            accent="gold"
          />
          <OfferRail
            eyebrow="Highest credit value"
            title="The biggest runway."
            subtitle="Top-of-ladder programs — ranked by maximum credit value."
            offers={valueRail}
            href="/explore?sort=value_desc"
            accent="gold"
          />
          <OfferRail
            eyebrow="Fastest approvals"
            title="Credits this week, not next month."
            subtitle="Programs with short review windows or instant baseline tiers."
            offers={fastRail}
            href="/explore?sort=fastest_review"
            accent="muted"
          />
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE LADDER — NOW / NEXT / LATER
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[color:var(--rule)] bg-[color:var(--background-2)]">
        <Grain />
        <Container className="relative py-14 sm:py-20">
          <p className="section-number mb-4">03 / The Ladder</p>
          <h2 className="display-h2 mb-10 max-w-2xl sm:mb-14">
            Climb from idea
            <br />
            <span className="italic-display text-[color:var(--foreground-dim)]">
              to traction.
            </span>
          </h2>

          <div className="space-y-0">
            <LadderRung
              code="NOW"
              tone="teal"
              title="Claim today"
              sub="Low-friction credits you can apply for before incorporation. Perfect for solo builders validating."
              offers={sortOffers(byStage.now, "easiest_apply").slice(0, 2)}
              href="/stages/now"
            />
            <LadderRung
              code="NEXT"
              tone="gold"
              title="Once you incorporate"
              sub="Programs that open up with a registered entity or corporate domain. Where the biggest practical credits live."
              offers={sortOffers(byStage.next, "value_desc").slice(0, 3)}
              href="/stages/next"
            />
            <LadderRung
              code="LATER"
              tone="muted"
              title="With traction or funding"
              sub="Partner-gated and VC-linked programs. The largest credit values — the longest runway."
              offers={sortOffers(byStage.later, "value_desc").slice(0, 2)}
              href="/stages/later"
            />
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          GATED PREVIEW — show what unlocks
          ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-14 sm:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <div className="col-span-12 md:col-span-5">
              <p className="section-number mb-4">04 / Sign in</p>
              <h2 className="display-h2">
                What the public page
                <br />
                <span className="italic-display text-[color:var(--gold)]">
                  won&apos;t tell you.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-[1.6] text-[color:var(--muted)]">
                Application tips, documents needed, common rejection
                patterns, and our reviewer notes — unlocked with one magic
                link. No password. No credit card. No spam.
              </p>
            </div>
            <div className="col-span-12 md:col-span-7">
              <GatedPreview offer={previewOffer} />
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SPONSOR STRIP — single labeled slot
          ═══════════════════════════════════════════════════════════════ */}
      <SponsorStrip />

      {/* ═══════════════════════════════════════════════════════════════
          NEWSLETTER
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[color:var(--rule)]">
        <div
          className="absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 gold-glow opacity-20"
          aria-hidden
        />
        <Container className="relative py-14 sm:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <div className="col-span-12 md:col-span-5">
              <p className="section-number mb-4">05 / The Digest</p>
              <h2 className="display-h2">
                Every Sunday,
                <br />
                <span className="italic-display text-[color:var(--foreground-dim)]">
                  credits worth claiming.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <p className="text-[16px] leading-[1.6] text-[color:var(--foreground-dim)] sm:text-[18px]">
                3–5 newly verified offers. One deeper comparison. No hype, no
                scraped junk. Built for the founder optimizing burn.
              </p>
              <NewsletterForm source="home" />
              <p className="eyebrow mt-4">
                Magic-link signup · Unlocks full offer depth · No spam, ever
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRUST — honest version (aspirational process, not overclaim)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-14 sm:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <div className="col-span-12 md:col-span-5">
              <p className="section-number mb-4">06 / Trust</p>
              <h2 className="display-h2">
                Verification
                <br />
                <span className="italic-display text-[color:var(--gold)]">
                  is the product.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                <TrustItem
                  k="Official source on every offer"
                  v="Every program links back to the vendor's own page. We don't republish unverifiable claims as facts."
                />
                <TrustItem
                  k="Dated verification"
                  v="Each listing shows the date it was last re-checked against source, or an honest 'unverified' state."
                />
                <TrustItem
                  k="Confidence, not certainty"
                  v="A 5-bar meter signals how much we're willing to stand behind each detail — never hidden behind a logo."
                />
                <TrustItem
                  k="Community signal, separated"
                  v="Founder experience reports are valuable commentary. They're never presented as the program's claim."
                />
              </dl>
              <div className="mt-10">
                <Link
                  href="/methodology"
                  className="editorial-link text-[13px] text-[color:var(--gold)]"
                >
                  Read the full methodology →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED INDEX PREVIEW
          ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-14 sm:py-20">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-number mb-4">07 / The index</p>
              <h2 className="display-h2">
                Everything, filterable
                <span className="text-[color:var(--gold)]">.</span>
              </h2>
            </div>
            <Link
              href="/explore"
              className="editorial-link self-start text-[13px] text-[color:var(--gold)] sm:self-end"
            >
              Browse all {SEED_OFFERS.length} →
            </Link>
          </div>
          <div className="border-t border-[color:var(--rule)]">
            {sortOffers(SEED_OFFERS, "recommended")
              .slice(0, 5)
              .map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
          </div>
        </Container>
      </section>

      {/* Mobile sticky CTA bar */}
      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--rule)] bg-[color:var(--background)]/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link
            href="/explore"
            className="flex-1 rounded-full bg-[color:var(--gold)] px-5 py-3 text-center text-[13px] font-medium text-black"
          >
            Explore credits →
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-[color:var(--rule-2)] px-5 py-3 text-[13px]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

function TrustItem({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-[color:var(--rule)] pt-4">
      <dt className="mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold)]">
        {k}
      </dt>
      <dd className="mt-2 text-[14px] leading-[1.55] text-[color:var(--foreground-dim)]">
        {v}
      </dd>
    </div>
  );
}

function LadderRung({
  code,
  tone,
  title,
  sub,
  offers,
  href,
}: {
  code: string;
  tone: "teal" | "gold" | "muted";
  title: string;
  sub: string;
  offers: typeof SEED_OFFERS;
  href: string;
}) {
  const color =
    tone === "teal" ? "var(--teal)" : tone === "gold" ? "var(--gold)" : "var(--muted)";
  return (
    <div className="relative grid grid-cols-12 gap-6 border-t border-[color:var(--rule)] py-10 first:border-t-0 sm:py-12 lg:gap-10">
      <div className="col-span-12 lg:col-span-4">
        <div className="flex items-center gap-3">
          <span
            className="mono inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10.5px] tracking-[0.2em]"
            style={{
              color,
              border: `1px solid ${color}`,
              background: `color-mix(in srgb, ${color} 10%, transparent)`,
            }}
          >
            {code === "NOW" ? "●" : code === "NEXT" ? "◐" : "○"} {code}
          </span>
          <Link
            href={href}
            className="editorial-link text-[11px] text-[color:var(--muted)]"
          >
            See all →
          </Link>
        </div>
        <p className="display mt-5 text-[28px] leading-[1] sm:text-[34px]">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-[14px] leading-[1.55] text-[color:var(--muted)]">
          {sub}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-8 lg:border-l lg:border-[color:var(--rule)] lg:pl-10">
        {offers.length === 0 ? (
          <p className="eyebrow py-4">No offers yet — check back soon</p>
        ) : (
          <div className="border-t border-[color:var(--rule)] lg:border-t-0">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

