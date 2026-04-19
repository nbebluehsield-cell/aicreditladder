import { ImageResponse } from "next/og";
import { getOfferBySlug } from "@/lib/offers-source";
import { formatAmount } from "@/lib/formatAmount";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Credit Ladder — verified startup credits";

/**
 * Per-offer OG image. Renders the offer's value + vendor against the
 * site palette so Slack/X/LinkedIn unfurls feel bespoke, not template.
 * A-frame mark + editorial title + value display + credit-type eyebrow.
 */
export default async function OfferOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const offer = await getOfferBySlug(params.slug);

  const [serif, serifItalic, mono] = await Promise.all([
    loadGoogleFont("Instrument Serif", 400, false),
    loadGoogleFont("Instrument Serif", 400, true),
    loadGoogleFont("JetBrains Mono", 500, false),
  ]);

  const vendor = offer?.vendor ?? "AI Credit Ladder";
  const title = offer?.title ?? "Verified startup credits";
  const { main: amountMain, unit: amountUnit } = offer
    ? formatAmount(offer)
    : { main: "Free credits", unit: "" };

  const creditType =
    offer?.credit_type === "ai_api"
      ? "AI API credits"
      : offer?.credit_type === "cloud"
      ? "Cloud credits"
      : offer?.credit_type === "saas"
      ? "SaaS credits"
      : offer?.credit_type === "mixed"
      ? "Mixed stack credits"
      : "Verified credits";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0c0b0a",
          color: "#f2ece0",
          fontFamily: "InstrumentSerif",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "#2a241e",
          }}
        />

        {/* Top rail — mark + wordmark + eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: "JetBrainsMono",
            fontSize: 16,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#8f887a",
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <line x1="10" y1="5" x2="4" y2="19" stroke="#f2ece0" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="14" y1="5" x2="20" y2="19" stroke="#f2ece0" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8.7" y1="8" x2="15.3" y2="8" stroke="#e04e2f" strokeWidth="2" strokeLinecap="round" />
            <line x1="5.3" y1="16" x2="18.7" y2="16" stroke="#e04e2f" strokeWidth="2" strokeLinecap="round" />
            <line x1="5.5" y1="12" x2="18.5" y2="12" stroke="#e04e2f" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={{ color: "#f2ece0" }}>AI Credit Ladder</span>
          <span style={{ color: "#4a433a" }}>·</span>
          <span>{creditType}</span>
        </div>

        {/* Headline — vendor + value */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrainsMono",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#e04e2f",
              marginBottom: 18,
              display: "flex",
            }}
          >
            {vendor}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "#f2ece0",
              maxWidth: 1040,
            }}
          >
            <span>{title}</span>
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              fontFamily: "InstrumentSerifItalic",
              fontStyle: "italic",
              color: "#c9c0ad",
              fontSize: 52,
            }}
          >
            <span>{amountMain}</span>
            {amountUnit ? (
              <span
                style={{
                  fontFamily: "JetBrainsMono",
                  fontStyle: "normal",
                  fontSize: 22,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8f887a",
                }}
              >
                {amountUnit}
              </span>
            ) : null}
          </div>
        </div>

        {/* Bottom rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrainsMono",
            fontSize: 16,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#8f887a",
          }}
        >
          <span>Verified · Solo-founder ready</span>
          <span style={{ color: "#e04e2f" }}>aicreditladder.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "InstrumentSerif", data: serif, weight: 400, style: "normal" },
        { name: "InstrumentSerifItalic", data: serifItalic, weight: 400, style: "italic" },
        { name: "JetBrainsMono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

async function loadGoogleFont(
  family: string,
  weight: number,
  italic: boolean,
): Promise<ArrayBuffer> {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`;
  const css = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(
    (r) => r.text(),
  );
  const match = css.match(/src:\s*url\((.+?)\)\s*format/);
  if (!match) throw new Error(`Could not resolve font: ${family}`);
  return fetch(match[1]!).then((r) => r.arrayBuffer());
}
