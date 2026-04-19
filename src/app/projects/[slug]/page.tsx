import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { PROJECT_TYPES } from "@/data/project-types";
import { getOffersByProject } from "@/lib/offers-source";

type Params = { slug: string };

export function generateStaticParams() {
  return PROJECT_TYPES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pt = PROJECT_TYPES.find((p) => p.slug === slug);
  return { title: pt ? `${pt.label} — startup credits` : "Not found" };
}

/**
 * Renders `headline` with the first occurrence of `accent` in gold italic.
 */
function ProjectHeadline({
  headline,
  accent,
}: {
  headline: string;
  accent?: string;
}) {
  if (!accent || !headline.includes(accent)) {
    return <>{headline}</>;
  }
  const i = headline.indexOf(accent);
  return (
    <>
      {headline.slice(0, i)}
      <span className="italic-display text-[color:var(--gold)]">{accent}</span>
      {headline.slice(i + accent.length)}
    </>
  );
}

export default async function ProjectTypePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pt = PROJECT_TYPES.find((p) => p.slug === slug);
  if (!pt) notFound();

  const offers = await getOffersByProject(slug);

  const freeCount = offers.filter((o) => {
    const v = o.value_display?.toLowerCase() ?? "";
    return v.includes("free") || v.startsWith("$0");
  }).length;

  const descriptionText = pt.description?.trim();
  const descriptionLine =
    descriptionText &&
    (descriptionText.endsWith(".") || descriptionText.endsWith("?") || descriptionText.endsWith("!")
      ? descriptionText
      : `${descriptionText}.`);

  return (
    <div className="flex flex-1 flex-col">
      <ProjectSwitcher activeSlug={slug} />
      <Container className="pt-10 pb-6 sm:pt-12 sm:pb-8">
        <p className="eyebrow mb-5 text-[color:var(--muted-2)]">The ladder</p>
        <h1 className="display-h2 max-w-[52rem] text-balance text-pretty leading-[1.12] tracking-[-0.022em] text-[color:var(--foreground)] sm:leading-[1.1] lg:leading-[1.08]">
          <ProjectHeadline headline={pt.headline} accent={pt.headlineAccent} />
        </h1>
        {descriptionLine && (
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-[color:var(--muted)] sm:text-[16px] sm:leading-[1.6]">
            {descriptionLine}
          </p>
        )}
        {offers.length > 0 && (
          <div className="mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted-2)]">
            <span>{offers.length} curated</span>
            <span aria-hidden className="text-[color:var(--rule-2)]">
              ·
            </span>
            {freeCount > 0 && (
              <>
                <span>
                  <span className="text-[color:var(--foreground-dim)]">{freeCount}</span> free tier
                  {freeCount === 1 ? "" : "s"}
                </span>
                <span aria-hidden className="text-[color:var(--rule-2)]">
                  ·
                </span>
              </>
            )}
            <span>Verified weekly</span>
          </div>
        )}
      </Container>

      <Container className="pb-14 sm:pb-16">
        {offers.length === 0 ? (
          <p className="eyebrow border-t border-[color:var(--rule)] py-12 text-center">
            No matched offers yet
          </p>
        ) : (
          <div className="border-t border-[color:var(--rule)]">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
