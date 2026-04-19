import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "xwide" | "bleed" | "narrow";
}) {
  const max =
    size === "bleed"
      ? "max-w-none"
      : size === "xwide"
      ? "max-w-[1560px]"
      : size === "wide"
      ? "max-w-7xl"
      : size === "narrow"
      ? "max-w-3xl"
      : "max-w-6xl";
  return (
    <div className={cn("mx-auto w-full page-gutter-x", max, className)}>
      {children}
    </div>
  );
}
