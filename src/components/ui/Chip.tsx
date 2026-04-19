import { cn } from "@/lib/cn";

type Tone =
  | "neutral"
  | "gold"
  | "teal"
  | "success"
  | "danger"
  | "muted"
  | "stage-now"
  | "stage-next"
  | "stage-later";

const tones: Record<Tone, string> = {
  neutral:
    "bg-transparent text-[color:var(--foreground-dim)] border-[color:var(--rule-2)]",
  gold:
    "bg-[color:var(--gold-soft)] text-[color:var(--gold)] border-[color:var(--gold)]",
  teal:
    "bg-[color:var(--teal-soft)] text-[color:var(--teal)] border-[color:var(--teal)]",
  success:
    "bg-[color:var(--teal-soft)] text-[color:var(--teal)] border-[color:var(--teal)]",
  danger:
    "bg-[color:var(--gold-soft)] text-[color:var(--gold)] border-[color:var(--gold)]",
  muted:
    "bg-transparent text-[color:var(--muted)] border-[color:var(--rule-2)]",
  "stage-now":
    "bg-[color:var(--teal-soft)] text-[color:var(--teal)] border-[color:var(--teal)]",
  "stage-next":
    "bg-[color:var(--gold-soft)] text-[color:var(--gold)] border-[color:var(--gold)]",
  "stage-later":
    "bg-transparent text-[color:var(--muted)] border-[color:var(--rule-2)]",
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
        "inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-[10px] leading-none tracking-[0.14em] uppercase",
        mono && "mono",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
