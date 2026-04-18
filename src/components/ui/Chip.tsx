import { cn } from "@/lib/cn";

type Tone = "neutral" | "gold" | "teal" | "success" | "danger" | "muted" | "stage-now" | "stage-next" | "stage-later";

const tones: Record<Tone, string> = {
  neutral:
    "bg-transparent text-[color:var(--foreground-dim)] border border-[color:var(--rule-2)]",
  gold:
    "bg-[color:var(--gold-soft)] text-[color:var(--gold)] border border-[color:var(--gold-rule)]",
  teal:
    "bg-[color:var(--teal-soft)] text-[color:var(--teal)] border border-teal-400/30",
  success:
    "bg-green-500/10 text-green-300 border border-green-500/25",
  danger:
    "bg-red-500/10 text-red-300 border border-red-500/25",
  muted:
    "bg-transparent text-[color:var(--muted)] border border-[color:var(--rule)]",
  "stage-now":
    "bg-[color:var(--teal-soft)] text-[color:var(--teal)] border border-teal-400/30",
  "stage-next":
    "bg-[color:var(--gold-soft)] text-[color:var(--gold)] border border-[color:var(--gold-rule)]",
  "stage-later":
    "bg-transparent text-[color:var(--muted)] border border-[color:var(--rule-2)]",
};

export function Chip({
  children,
  tone = "neutral",
  className,
  mono = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10.5px] leading-none tracking-wider uppercase",
        mono && "mono",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
