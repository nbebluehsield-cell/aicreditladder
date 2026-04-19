import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "AI Credit Ladder — Verified startup AI and cloud credits on the frontier. Editorial index for solo founders and early teams.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OG / Twitter share image.
 *
 * This is the image that shows up in Slack previews, iMessage/email
 * link unfurls, X, LinkedIn — everywhere our URL gets pasted. It is
 * therefore the single most-seen brand artifact of the site.
 *
 * Composition: left column holds the mark centered vertically; right
 * column is a stacked editorial headline. Colors are the exact site
 * palette. Typography loads Instrument Serif + JetBrains Mono from
 * Google Fonts at build time so the card matches on-site text
 * perfectly.
 */
export default async function OpengraphImage() {
  const [serif, serifItalic, mono] = await Promise.all([
    loadGoogleFont("Instrument Serif", 400, false),
    loadGoogleFont("Instrument Serif", 400, true),
    loadGoogleFont("JetBrains Mono", 500, false),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0c0b0a",
          color: "#f2ece0",
          fontFamily: "InstrumentSerif",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Thin rule at top — matches the site's masthead border */}
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

        {/* Left: mark column */}
        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Same geometry as BrandMark.tsx / icon.tsx — A-frame + three rungs */}
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none">
            <line
              x1="10"
              y1="5"
              x2="4"
              y2="19"
              stroke="#f2ece0"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="5"
              x2="20"
              y2="19"
              stroke="#f2ece0"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="8.7"
              y1="8"
              x2="15.3"
              y2="8"
              stroke="#e04e2f"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="5.3"
              y1="16"
              x2="18.7"
              y2="16"
              stroke="#e04e2f"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="5.5"
              y1="12"
              x2="18.5"
              y2="12"
              stroke="#e04e2f"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "JetBrainsMono",
              fontSize: 18,
              letterSpacing: "0.28em",
              color: "#8f887a",
              textTransform: "uppercase",
            }}
          >
            <span>Founder-owned</span>
            <span style={{ marginTop: 6, color: "#e04e2f" }}>
              aicreditladder.com
            </span>
          </div>
        </div>

        {/* Right: editorial column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: 24,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrainsMono",
              fontSize: 18,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#8f887a",
              display: "flex",
            }}
          >
            <span style={{ color: "#f2ece0" }}>The Ladder</span>
            <span style={{ margin: "0 12px", color: "#4a433a" }}>·</span>
            <span>An editorial index</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 116,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#f2ece0" }}>Free AI credits.</span>
            <span
              style={{
                fontFamily: "InstrumentSerifItalic",
                fontStyle: "italic",
                color: "#c9c0ad",
              }}
            >
              For builders.
            </span>
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: "#c9c0ad",
              maxWidth: 720,
              display: "flex",
            }}
          >
            Find, verify, and claim startup AI and cloud credits —
            sequenced as a ladder from idea to traction.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "InstrumentSerif", data: serif, weight: 400, style: "normal" },
        {
          name: "InstrumentSerifItalic",
          data: serifItalic,
          weight: 400,
          style: "italic",
        },
        { name: "JetBrainsMono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

/**
 * Fetch a Google Font at build time.
 *
 * Satori (what powers ImageResponse) does not support WOFF2 — it
 * needs TTF or OTF. Google's CSS API returns WOFF2 when it sees a
 * modern browser UA and falls back to TTF for old UAs. We force the
 * TTF path by sending a vintage user agent.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  italic: boolean,
): Promise<ArrayBuffer> {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`;
  const css = await fetch(url, {
    headers: {
      // A minimal UA makes Google fall back to TTF in the stylesheet.
      // Satori (what powers ImageResponse) cannot parse WOFF/WOFF2.
      "User-Agent": "Mozilla/5.0",
    },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\((.+?)\)\s*format/);
  if (!match) throw new Error(`Could not resolve font: ${family}`);
  const font = await fetch(match[1]!).then((r) => r.arrayBuffer());
  return font;
}
