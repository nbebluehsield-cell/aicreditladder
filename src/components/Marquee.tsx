export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[color:var(--rule)] bg-[color:var(--background-2)]">
      <div className="flex w-max marquee gap-12 py-4">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[color:var(--foreground-dim)]"
          >
            <span className="h-1 w-1 rounded-full bg-[color:var(--gold)]" />
            <span className="mono text-[11px] uppercase tracking-[0.22em]">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
