import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  interactive?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5",
        interactive &&
          "transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-elevated)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
