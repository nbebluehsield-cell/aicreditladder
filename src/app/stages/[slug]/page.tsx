import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { getOffersByStage } from "@/data/seed";
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
  return { title: `${STAGE_LABEL[slug as Stage]} — The Ladder · AI Credit Ladder` };
}

export default async function StagePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!STAGES.includes(slug as Stage)) notFound();
  const stage = slug as Stage;
  const offers = getOffersByStage(stage);
  const color =
    stage === "now" ? "var(--teal)" : stage === "next" ? "var(--gold)" : "var(--muted)";

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-16 sm:py-20">
          <Link
            href="/"
            className="eyebrow inline-flex items-center gap-2 mb-6 hover:text-[color:var(--foreground)]"
          >
            ← The Ladder
          </Link>
          <div className="flex gap-3 mb-6">
            {STAGES.map((s) => (
              <Link
                key={s}
                href={`/stages/${s}`}
                className="mono rounded-sm px-2.5 py-1 text-[10.5px] uppercase tracking-[0.2em]"
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
          <p className="mt-6 max-w-xl text-[15px] leading-[1.6] text-[color:var(--muted)]">
            {STAGE_DESCRIPTION[stage]}
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-8 sm:py-12">
          {offers.length === 0 ? (
            <p className="eyebrow py-12 text-center">No offers at this rung yet</p>
          ) : (
            <div className="border-t border-[color:var(--rule)]">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
