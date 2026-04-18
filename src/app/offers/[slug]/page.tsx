import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { SEED_OFFERS, getOffer } from "@/data/seed";
import { isAuthenticated } from "@/lib/auth";
import type { Offer } from "@/lib/types";

type Params = { slug: string };

export function generateStaticParams() {
  return SEED_OFFERS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const offer = getOffer(slug);
  return { title: offer ? `${offer.title} — AI Credit Ladder` : "Not found" };
}

const CREDIT_TYPE_LABEL: Record<Offer["credit_type"], string> = {
  ai_api: "AI API",
  cloud: "Cloud",
  saas: "SaaS",
  mixed: "Mixed",
};

export default async function OfferPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  const authed = await isAuthenticated();
  const publicOffer = maskForAnonymous(offer, authed);

  return (
    <main className="flex-1">
      {/* HEADER */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-12 sm:py-16">
          <Link
            href="/explore"
            className="eyebrow inline-flex items-center gap-2 mb-6 hover:text-[color:var(--foreground)]"
          >
            ← The Index
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="eyebrow">{publicOffer.vendor}</span>
            <span className="h-3 w-px bg-[color:var(--rule-2)]" />
            <Chip tone="neutral" mono>{CREDIT_TYPE_LABEL[publicOffer.credit_type]}</Chip>
            {publicOffer.founder_stage_fit.map((s) => (
              <Chip key={s} tone={`stage-${s}` as const} mono>
                {s === "now" ? "● NOW" : s === "next" ? "◐ NEXT" : "○ LATER"}
              </Chip>
            ))}
          </div>

          <h1 className="display text-[44px] sm:text-[64px] leading-[1] tracking-tight max-w-4xl">
            {publicOffer.title}
          </h1>

          <div className="mt-10 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <p className="eyebrow mb-3">Credit value</p>
              <p className="num text-[36px] sm:text-[48px] font-medium tracking-tight text-[color:var(--gold)] leading-none">
                {publicOffer.value_display}
              </p>
              {publicOffer.duration && (
                <p className="mono mt-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  {publicOffer.duration}
                </p>
              )}
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
              <div>
                <p className="eyebrow mb-2">Verification</p>
                <div className="flex items-center gap-2">
                  <ConfidenceMeter value={publicOffer.verification_confidence} />
                  <span className="mono text-[12px] text-[color:var(--foreground-dim)]">
                    {Math.round((publicOffer.verification_confidence ?? 0) * 100)}% confidence
                  </span>
                </div>
                {publicOffer.last_verified_at && (
                  <p className="mono mt-1 text-[10.5px] uppercase tracking-[0.2em] text-[color:var(--muted-2)]">
                    Last verified {publicOffer.last_verified_at}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col gap-2 md:items-end">
              <Button href={publicOffer.application_url} size="lg">
                Apply official →
              </Button>
              <Link
                href={publicOffer.official_url}
                className="editorial-link text-[12px] text-[color:var(--muted)]"
              >
                View source page
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ELIGIBILITY AT A GLANCE */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-12">
          <p className="section-number mb-6">Eligibility at a glance</p>
          <dl className="grid grid-cols-2 gap-px bg-[color:var(--rule)] border border-[color:var(--rule)] md:grid-cols-4">
            <Fact k="Solo founder" v={labelYesNo(publicOffer.solo_founder_friendly)} tone={publicOffer.solo_founder_friendly === "yes" ? "pos" : publicOffer.solo_founder_friendly === "no" ? "neg" : "neu"} />
            <Fact k="VC backing" v={publicOffer.requires_vc_backing ? "Required" : "Not required"} tone={publicOffer.requires_vc_backing ? "neg" : "pos"} />
            <Fact k="Company entity" v={publicOffer.requires_company_registration ? "Required" : "Not required"} tone={publicOffer.requires_company_registration ? "neu" : "pos"} />
            <Fact k="Partner referral" v={publicOffer.requires_partner_referral ? "Required" : "Not required"} tone={publicOffer.requires_partner_referral ? "neu" : "pos"} />
            <Fact k="Apply time" v={publicOffer.apply_time_minutes ? `~${publicOffer.apply_time_minutes} min` : "Varies"} />
            <Fact k="Review time" v={publicOffer.review_time_estimate ?? "Varies"} />
            <Fact k="Difficulty" v={publicOffer.difficulty_score ? `${publicOffer.difficulty_score}/5` : "Unknown"} />
            <Fact k="Status" v={publicOffer.status.toUpperCase()} tone={publicOffer.status === "active" ? "pos" : "neg"} />
          </dl>
        </Container>
      </section>

      {/* GATED DEPTH */}
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <div className="col-span-12 md:col-span-4">
              <p className="section-number mb-4">Founder guidance</p>
              <h2 className="display-h3 max-w-sm">
                What the page <span className="italic-display text-[color:var(--gold)]">won&apos;t tell you.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-8">
              <GatedBlock title="Application tips" authed={authed}>
                {publicOffer.application_tips}
              </GatedBlock>
              <GatedBlock title="Documents needed" authed={authed}>
                {publicOffer.documents_needed?.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </GatedBlock>
              <GatedBlock title="Common rejection reasons" authed={authed}>
                {publicOffer.common_rejection_reasons?.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </GatedBlock>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
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

function labelYesNo(v: "yes" | "no" | "unclear"): string {
  return v === "yes" ? "Yes" : v === "no" ? "No" : "Unclear";
}

function Fact({
  k,
  v,
  tone = "neu",
}: {
  k: string;
  v: string;
  tone?: "pos" | "neg" | "neu";
}) {
  const color =
    tone === "pos" ? "var(--teal)" : tone === "neg" ? "var(--crimson)" : "var(--foreground)";
  return (
    <div className="bg-[color:var(--background)] p-5">
      <dt className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{k}</dt>
      <dd className="mt-2 text-[15px] font-medium" style={{ color }}>
        {v}
      </dd>
    </div>
  );
}

function GatedBlock({
  title,
  children,
  authed,
}: {
  title: string;
  children: React.ReactNode;
  authed: boolean;
}) {
  const empty = !children || (Array.isArray(children) && children.length === 0);
  return (
    <div className="relative border-t border-[color:var(--rule)] pt-6">
      <p className="eyebrow mb-3">{title}</p>
      {!authed ? (
        <div className="relative overflow-hidden rounded-md border border-dashed border-[color:var(--rule-2)] bg-[color:var(--surface)]/60 p-5">
          <div className="space-y-2 select-none">
            <div className="h-3 w-[92%] rounded bg-[color:var(--rule-2)]" />
            <div className="h-3 w-[78%] rounded bg-[color:var(--rule-2)]" />
            <div className="h-3 w-[85%] rounded bg-[color:var(--rule-2)]" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-[13px] text-[color:var(--muted)]">
              Sign in with your email to unlock founder guidance. Free. Magic link.
            </p>
            <Button href="/auth/login" variant="primary" size="sm">
              Unlock →
            </Button>
          </div>
        </div>
      ) : empty ? (
        <p className="text-[14px] text-[color:var(--muted)]">No notes recorded.</p>
      ) : (
        <div className="prose prose-invert max-w-none text-[14.5px] leading-[1.7] text-[color:var(--foreground-dim)]">
          {typeof children === "string" ? <p>{children}</p> : <ul className="list-disc pl-5 space-y-1">{children}</ul>}
        </div>
      )}
    </div>
  );
}
