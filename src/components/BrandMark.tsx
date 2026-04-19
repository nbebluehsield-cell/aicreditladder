import type { CSSProperties } from "react";

/**
 * AI Credit Ladder — minimal mark.
 *
 * A-frame rails (splayed, narrower at the apex, wider at the feet) +
 * three vermilion rungs: thin top/bottom, heavier center bridge which
 * extends past the rails — reads as a step-ladder at favicon size.
 */

export const BRIDGE_COLOR = "#e04e2f";

/** Secondary rungs — same hue, lighter stroke than the center bridge */
const RUNG_THIN = 2;

export function BrandMark({
  size = 28,
  className,
  style,
  title = "AI Credit Ladder",
  tone = "rail",
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
  tone?: "rail" | "solid";
}) {
  const rail = tone === "solid" ? "#f2ece0" : "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >
      {/* Left rail — apex at top, splayed foot at bottom */}
      <line
        x1="10"
        y1="5"
        x2="4"
        y2="19"
        stroke={rail}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Right rail — mirror */}
      <line
        x1="14"
        y1="5"
        x2="20"
        y2="19"
        stroke={rail}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Top rung — tight to the apex */}
      <line
        x1="8.7"
        y1="8"
        x2="15.3"
        y2="8"
        stroke={BRIDGE_COLOR}
        strokeWidth={RUNG_THIN}
        strokeLinecap="round"
      />
      {/* Bottom rung — wide, matching the feet */}
      <line
        x1="5.3"
        y1="16"
        x2="18.7"
        y2="16"
        stroke={BRIDGE_COLOR}
        strokeWidth={RUNG_THIN}
        strokeLinecap="round"
      />
      {/* Middle rung — heaviest, extends past rails (the signature) */}
      <line
        x1="5.5"
        y1="12"
        x2="18.5"
        y2="12"
        stroke={BRIDGE_COLOR}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
