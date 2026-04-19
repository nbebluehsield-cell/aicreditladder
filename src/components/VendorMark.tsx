"use client";

import { useState } from "react";
import { isDeadClearbit, logoUrlForDomain, safeDomain } from "@/lib/logos";
import { cn } from "@/lib/cn";

/** Flat-top hex in 0–100 space — matches `.logo-hex__clip` in globals.css */
const HEX_POINTS = "25,0 75,0 100,50 75,100 25,100 0,50";

/**
 * VendorMark — vendor identity in the ledger.
 *
 * * **bare** (default) — no frame; editorial sponsor mark. Desaturated at
 *   rest, full-color on any `a:hover` / `.row-hover:hover` ancestor.
 * * **hex** — honeycomb cell; logos are hex-clipped so marks read crisp
 *   at any size (no square corners in a hex frame).
 * * **showcase** — rounded tile, full-color logo on a lift surface.
 */
export function VendorMark({
  vendor,
  officialUrl,
  logoUrl,
  size = 28,
  variant = "bare",
  tone = "muted",
  className,
}: {
  vendor: string;
  officialUrl: string;
  logoUrl?: string | null;
  size?: number;
  variant?: "bare" | "hex" | "showcase";
  /** `bright` renders the mark in full colour at rest (detail/hero use). */
  tone?: "muted" | "bright";
  className?: string;
}) {
  const override = logoUrl && !isDeadClearbit(logoUrl) ? logoUrl : null;
  const domain = safeDomain(officialUrl);
  const src = override ?? logoUrlForDomain(domain, size);
  const [failed, setFailed] = useState(!src);

  // With hex clip-path, corners are masked — we can run the mark slightly
  // larger for a compact, icon-like read without kissing the stroke.
  const ratio =
    variant === "showcase"
      ? size < 48
        ? 0.62
        : 0.58
      : size <= 22
        ? 0.58
        : size <= 36
          ? 0.62
          : size <= 52
            ? 0.64
            : 0.62;
  const inner = Math.round(size * ratio);

  if (variant === "bare") {
    return (
      <span
        aria-hidden
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {failed || !src ? (
          <Monogram vendor={vendor} size={Math.round(size * 0.72)} variant="showcase" />
        ) : (
          <img
            src={src}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={cn(
              "object-contain",
              tone === "bright" ? "" : "sponsor-mark",
            )}
            style={{ width: size, height: size }}
            draggable={false}
          />
        )}
      </span>
    );
  }

  if (variant === "showcase") {
    return (
      <span
        aria-hidden
        className={cn(
          "logo-showcase relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--rule-2)] bg-gradient-to-b from-[color:var(--background-2)] to-[color:var(--background-3)] shadow-[inset_0_1px_0_rgba(242,236,224,0.05)]",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {failed || !src ? (
          <Monogram vendor={vendor} size={inner} variant="showcase" />
        ) : (
          <img
            src={src}
            alt=""
            width={inner}
            height={inner}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="relative object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            style={{ width: inner, height: inner }}
            draggable={false}
          />
        )}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "logo-hex logo-mono relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <polygon
          points={HEX_POINTS}
          fill="var(--background-2)"
          stroke="var(--rule-2)"
          strokeWidth="0.65"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="logo-hex__clip pointer-events-none absolute inset-[1px] flex items-center justify-center">
        {failed || !src ? (
          <Monogram vendor={vendor} size={inner} variant="hex" />
        ) : (
          <img
            src={src}
            alt=""
            width={inner}
            height={inner}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="relative object-contain [image-rendering:auto]"
            style={{ width: inner, height: inner }}
            draggable={false}
          />
        )}
      </span>
    </span>
  );
}

function Monogram({
  vendor,
  size,
  variant,
}: {
  vendor: string;
  size: number;
  variant: "hex" | "showcase";
}) {
  const letters = initials(vendor);
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center font-semibold",
        variant === "showcase"
          ? "text-[color:var(--foreground-dim)]"
          : "text-[color:var(--muted)]",
      )}
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: Math.round(size * 0.44),
        letterSpacing: "0.02em",
      }}
    >
      {letters}
    </span>
  );
}

function initials(vendor: string): string {
  const clean = vendor
    .replace(/\b(inc|llc|ltd|co|corporation|corp)\.?\b/gi, "")
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}
