import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--gold)] text-black hover:brightness-110 active:brightness-95 shadow-[0_0_0_1px_var(--gold),0_0_20px_-4px_rgba(240,180,41,0.45)]",
  secondary:
    "bg-transparent text-[color:var(--foreground)] border border-[color:var(--rule-2)] hover:border-[color:var(--muted-2)] hover:bg-[color:var(--surface)]",
  ghost:
    "text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[12px]",
  md: "h-10 px-5 text-[13px]",
  lg: "h-12 px-7 text-[14px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "className" | "children">)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if ("href" in rest && rest.href) {
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
