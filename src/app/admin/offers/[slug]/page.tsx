import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Chip } from "@/components/ui/Chip";
import { VerifyForm } from "@/components/admin/VerifyForm";
import { getOffers, getOfferBySlug } from "@/lib/offers-source";

type Params = { slug: string };

export async function generateStaticParams() {
  const all = await getOffers();
  return all.map((o) => ({ slug: o.slug }));
}

export default async function AdminOfferDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Link
        href="/admin/offers"
        className="eyebrow inline-flex items-center gap-2 text-[color:var(--muted)]"
      >
        ← Verification queue
      </Link>

      <h1 className="display-h2 mt-6">{offer.title}</h1>
      <p className="mt-2 text-[13px] text-[color:var(--muted)]">
        {offer.vendor} · <span className="num">{offer.value_display}</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {offer.last_verified_at ? (
          <Chip tone="success" mono>Verified {offer.last_verified_at}</Chip>
        ) : (
          <Chip tone="danger" mono>Unverified</Chip>
        )}
        <Chip tone="neutral" mono>{offer.credit_type}</Chip>
        {offer.founder_stage_fit.map((s) => (
          <Chip key={s} tone="neutral" mono>{s.toUpperCase()}</Chip>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-12 gap-10">
        <section className="col-span-12 space-y-6 md:col-span-7">
          <Block title="Official URL">
            <a
              href={offer.official_url}
              target="_blank"
              rel="noopener nofollow ugc"
              className="editorial-link break-all text-[13px] text-[color:var(--gold)]"
            >
              {offer.official_url} ↗
            </a>
          </Block>
          <Block title="Application URL">
            <a
              href={offer.application_url}
              target="_blank"
              rel="noopener nofollow ugc"
              className="editorial-link break-all text-[13px] text-[color:var(--gold)]"
            >
              {offer.application_url} ↗
            </a>
          </Block>

          <Block title="Listed details">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12.5px]">
              <dt className="text-[color:var(--muted)]">Solo-friendly</dt>
              <dd>{offer.solo_founder_friendly}</dd>
              <dt className="text-[color:var(--muted)]">Requires VC</dt>
              <dd>{String(offer.requires_vc_backing)}</dd>
              <dt className="text-[color:var(--muted)]">Requires partner</dt>
              <dd>{String(offer.requires_partner_referral)}</dd>
              <dt className="text-[color:var(--muted)]">Requires entity</dt>
              <dd>{String(offer.requires_company_registration)}</dd>
              <dt className="text-[color:var(--muted)]">Apply time</dt>
              <dd>{offer.apply_time_minutes ? `${offer.apply_time_minutes}m` : "—"}</dd>
              <dt className="text-[color:var(--muted)]">Review time</dt>
              <dd>{offer.review_time_estimate ?? "—"}</dd>
              <dt className="text-[color:var(--muted)]">Difficulty</dt>
              <dd>{offer.difficulty_score ?? "—"}</dd>
              <dt className="text-[color:var(--muted)]">Duration</dt>
              <dd>{offer.duration ?? "—"}</dd>
            </dl>
          </Block>

          {offer.application_tips && (
            <Block title="Application tips (gated)">
              <p className="text-[13px] leading-[1.6] text-[color:var(--foreground-dim)]">
                {offer.application_tips}
              </p>
            </Block>
          )}
          {offer.documents_needed && offer.documents_needed.length > 0 && (
            <Block title="Documents needed (gated)">
              <ul className="list-disc pl-4 text-[13px] leading-[1.6] text-[color:var(--foreground-dim)]">
                {offer.documents_needed.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Block>
          )}
          {offer.common_rejection_reasons && offer.common_rejection_reasons.length > 0 && (
            <Block title="Common rejection reasons (gated)">
              <ul className="list-disc pl-4 text-[13px] leading-[1.6] text-[color:var(--foreground-dim)]">
                {offer.common_rejection_reasons.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Block>
          )}
        </section>

        <aside className="col-span-12 md:col-span-5">
          <div className="sticky top-20 rounded-lg border border-[color:var(--rule-2)] bg-[color:var(--surface)] p-6">
            <p className="section-number mb-4">Verify</p>
            <p className="text-[13px] leading-[1.55] text-[color:var(--muted)]">
              Open the official URL, confirm today&apos;s terms match the
              listing, paste a snapshot link (Wayback or vendor), set a
              confidence score, and submit.
            </p>
            <div className="mt-6">
              <VerifyForm slug={offer.slug} />
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--rule-2)] bg-[color:var(--surface)]/60 p-5">
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}
