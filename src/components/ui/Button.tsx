import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "ink";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--gold)] text-[color:var(--background)] hover:bg-[color:var(--gold-bright)] border border-[color:var(--gold)]",
  secondary:
    "bg-transparent text-[color:var(--foreground)] border border-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]",
  ghost:
    "text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)] border border-transparent",
  ink:
    "bg-[color:var(--foreground)] text-[color:var(--background)] border border-[color:var(--foreground)] hover:bg-[color:var(--foreground-dim)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[12px]",
  md: "h-11 px-6 text-[13px]",
  lg: "h-14 px-8 text-[14px]",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] uppercase transition focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap mono";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "className" | "children">)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

/**
 * Button / Link button.
 *
 * External links (http/https) automatically open in a new tab with
 * safe rel attributes. This is a site-wide rule — vendor pages
 * should never replace our tab.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if ("href" in rest && rest.href) {
    const href = rest.href;
    const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
    const externalProps = isExternal
      ? { target: "_blank" as const, rel: "noopener noreferrer" }
      : {};
    return (
      <Link className={classes} {...externalProps} {...rest}>
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
