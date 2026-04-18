export function ConfidenceMeter({ value }: { value: number | null }) {
  const v = value ?? 0;
  const filled = Math.round(v * 5);
  const tone = v >= 0.85 ? "on-high" : v >= 0.6 ? "on-mid" : "on-low";
  return (
    <span
      className="meter"
      aria-label={`Verification confidence ${Math.round(v * 100)}%`}
      title={`Verification confidence ${Math.round(v * 100)}%`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? tone : undefined} />
      ))}
    </span>
  );
}
