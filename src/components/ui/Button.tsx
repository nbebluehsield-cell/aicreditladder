"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cta-primary-fill text-[color:var(--background)]",
        outline:
          "border border-[color:var(--gold)]/45 bg-[color:var(--surface)]/92 text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(242,236,224,0.07),0_1px_2px_rgba(0,0,0,0.45)] hover:border-[color:var(--gold)] hover:bg-[color:var(--gold-soft)] hover:text-[color:var(--gold-bright)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_18px_rgba(224,78,47,0.12)] active:translate-y-px",
        secondary:
          "border border-[color:var(--foreground)]/35 bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]",
        ghost:
          "border border-transparent bg-transparent text-[color:var(--foreground-dim)] hover:border-[color:var(--rule-2)] hover:bg-[color:var(--surface-2)]/80 hover:text-[color:var(--foreground)]",
        link: "h-auto rounded-none border-0 bg-transparent p-0 text-[color:var(--gold-bright)] underline-offset-[5px] hover:underline shadow-none",
      },
      size: {
        xs: "h-8 gap-1 px-3 text-[11px] leading-none tracking-[0.06em]",
        sm: "h-9 px-3.5 text-[11.5px] tracking-[0.05em]",
        md: "h-10 px-5 text-[12.5px] tracking-[0.04em]",
        default: "h-10 px-5 text-[12.5px] tracking-[0.04em]",
        lg: "h-12 px-7 text-[13px] tracking-[0.04em] sm:h-11",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
