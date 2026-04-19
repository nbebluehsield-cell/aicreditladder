import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon — minimal ladder mark (two rails + three rungs).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0c0b0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* A-frame rails — apex at top, splayed feet */}
          <line x1="10" y1="5" x2="4" y2="19" stroke="#f2ece0" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="14" y1="5" x2="20" y2="19" stroke="#f2ece0" strokeWidth="2.2" strokeLinecap="round" />
          {/* Rungs — vermilion */}
          <line x1="8.7" y1="8" x2="15.3" y2="8" stroke="#e04e2f" strokeWidth="2" strokeLinecap="round" />
          <line x1="5.3" y1="16" x2="18.7" y2="16" stroke="#e04e2f" strokeWidth="2" strokeLinecap="round" />
          <line x1="5.5" y1="12" x2="18.5" y2="12" stroke="#e04e2f" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
