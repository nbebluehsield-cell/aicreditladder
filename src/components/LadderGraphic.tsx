/**
 * Signature ladder graphic. Abstract, geometric, gold-rung.
 * Used as hero motif and accent throughout the product.
 */
export function LadderGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#36323e" />
          <stop offset="50%" stopColor="#26232e" />
          <stop offset="100%" stopColor="#1a1821" />
        </linearGradient>
        <linearGradient id="goldRung" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8830f" />
          <stop offset="50%" stopColor="#fbd24e" />
          <stop offset="100%" stopColor="#b8830f" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Rails */}
      <rect x="40" y="20" width="6" height="560" rx="3" fill="url(#rail)" />
      <rect x="354" y="20" width="6" height="560" rx="3" fill="url(#rail)" />

      {/* Rungs — top (later/faint) to bottom (now/bright) */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 60 + i * 58;
        const intensity = Math.min(1, (i + 1) / 9);
        return (
          <g key={i}>
            <rect
              x="40"
              y={y}
              width="320"
              height="4"
              rx="1"
              fill="url(#goldRung)"
              opacity={intensity}
            />
            {i === 8 && (
              <rect
                x="40"
                y={y}
                width="320"
                height="4"
                rx="1"
                fill="#fbd24e"
                filter="url(#glow)"
                opacity="0.6"
              />
            )}
          </g>
        );
      })}

      {/* Climbing marker — a dot on a rung */}
      <circle cx="200" cy="524" r="7" fill="#f4ece0" />
      <circle cx="200" cy="524" r="11" fill="none" stroke="#f4ece0" strokeOpacity="0.3" />

      {/* Stage labels beside rungs */}
      <g fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="0.2em" fill="#8a8578">
        <text x="375" y="124" textAnchor="start">LATER</text>
        <text x="375" y="298" textAnchor="start">NEXT</text>
        <text x="375" y="528" textAnchor="start" fill="#5eead4">NOW ●</text>
      </g>
    </svg>
  );
}
