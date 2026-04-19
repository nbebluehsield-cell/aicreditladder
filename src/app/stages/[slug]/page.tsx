import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { getOffersByStage } from "@/lib/offers-source";
import { STAGE_DESCRIPTION, STAGE_LABEL } from "@/data/project-types";

type Params = { slug: string };
const STAGES = ["now", "next", "later"] as const;
type Stage = (typeof STAGES)[number];

export function generateStaticParams() {
  return STAGES.map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!STAGES.includes(slug as Stage)) return { title: "Not found" };
  return { title: `${STAGE_LABEL[slug as Stage]} — The Ladder` };
}

export default async function StagePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!STAGES.includes(slug as Stage)) notFound();
  const stage = slug as Stage;
  const offers = await getOffersByStage(stage);
  const color =
    stage === "now" ? "var(--teal)" : stage === "next" ? "var(--gold)" : "var(--muted)";

  return (
    <div className="flex flex-1 flex-col">
      <Container className="pt-10 pb-6 sm:pt-12 sm:pb-8">
        <div className="flex gap-3 mb-6">
          {STAGES.map((s) => (
            <Link
              key={s}
              href={`/stages/${s}`}
              prefetch
              className="mono rounded-sm px-2.5 py-1 text-[10.5px] uppercase tracking-[0.2em] transition-colors"
              style={{
                color: s === stage ? color : "var(--muted)",
                border: `1px solid ${s === stage ? color : "var(--rule-2)"}`,
                background: s === stage ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
              }}
            >
              {s === "now" ? "●" : s === "next" ? "◐" : "○"} {STAGE_LABEL[s]}
            </Link>
          ))}
        </div>
        <h1 className="display-h2 max-w-3xl">
          <span style={{ color }}>{STAGE_LABEL[stage]}</span>
          <br />
          <span className="italic-display text-[color:var(--foreground-dim)]">
            on the ladder.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.6] text-[color:var(--muted)]">
          {STAGE_DESCRIPTION[stage]}
        </p>
      </Container>

      <Container className="pb-14 sm:pb-16">
        {offers.length === 0 ? (
          <p className="eyebrow border-t border-[color:var(--rule)] py-12 text-center">
            No offers at this rung yet
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
