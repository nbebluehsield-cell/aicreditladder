"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Filters, SortKey } from "@/lib/offers";
import { buildSearchString, countActiveFilters } from "@/lib/offers";
import { PROJECT_TYPES } from "@/data/project-types";
import { cn } from "@/lib/cn";

/**
 * URL-driven filter/sort UI for /explore.
 *
 * State lives in the URL only — we never keep a local copy. This makes
 * every filter combination shareable, cacheable, and indexable, and it
 * guarantees that the filtered markup rendered on the server matches
 * what the client sees.
 */

type Props = {
  filters: Filters;
  sort: SortKey;
  total: number;
  filtered: number;
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "value_desc", label: "Highest value" },
  { key: "easiest_apply", label: "Easiest to apply" },
  { key: "fastest_review", label: "Fastest review" },
  { key: "newest_verified", label: "Newest verified" },
  { key: "value_asc", label: "Lowest value" },
];

const CREDIT_TYPE_OPTIONS: { key: NonNullable<Filters["creditType"]> | null; label: string }[] = [
  { key: "ai_api", label: "AI API" },
  { key: "cloud", label: "Cloud" },
  { key: "saas", label: "SaaS" },
  { key: "mixed", label: "Mixed" },
];

const PATH_OPTIONS: {
  key: NonNullable<Filters["creditPath"]> | null;
  label: string;
}[] = [
  { key: "signup", label: "Sign up & start" },
  { key: "startup_program", label: "Startup programs" },
  { key: "partner_or_investor", label: "Partner / VC path" },
];

const STAGE_OPTIONS: { key: NonNullable<Filters["stage"]> | null; label: string }[] = [
  { key: "now", label: "● Now" },
  { key: "next", label: "◐ Next" },
  { key: "later", label: "○ Later" },
];

export function FilterTray({ filters, sort, total, filtered }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const update = useCallback(
    (patch: Partial<Filters> & { sort?: SortKey }) => {
      const nextSort = patch.sort ?? sort;
      const nextFilters: Filters = { ...filters, ...patch };
      delete (nextFilters as Record<string, unknown>).sort;
      const qs = buildSearchString(nextFilters, nextSort);
      router.push(`${pathname}${qs}`, { scroll: false });
    },
    [filters, sort, router, pathname],
  );

  const reset = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const onSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const q = String(data.get("q") ?? "").trim();
      update({ search: q || null });
    },
    [update],
  );

  const currentQ = searchParams.get("q") ?? "";

  const chips = (
    <>
      {filters.solo && (
        <ActiveChip label="Solo-friendly" onRemove={() => update({ solo: false })} />
      )}
      {filters.noVc && (
        <ActiveChip label="No VC" onRemove={() => update({ noVc: false })} />
      )}
      {filters.noPartner && (
        <ActiveChip label="No partner" onRemove={() => update({ noPartner: false })} />
      )}
      {filters.noRegistration && (
        <ActiveChip
          label="No entity required"
          onRemove={() => update({ noRegistration: false })}
        />
      )}
      {filters.creditType && (
        <ActiveChip
          label={CREDIT_TYPE_OPTIONS.find((o) => o.key === filters.creditType)?.label ?? filters.creditType}
          onRemove={() => update({ creditType: null })}
        />
      )}
      {filters.creditPath && (
        <ActiveChip
          label={PATH_OPTIONS.find((o) => o.key === filters.creditPath)?.label ?? filters.creditPath}
          onRemove={() => update({ creditPath: null })}
        />
      )}
      {filters.stage && (
        <ActiveChip
          label={STAGE_OPTIONS.find((o) => o.key === filters.stage)?.label ?? filters.stage}
          onRemove={() => update({ stage: null })}
        />
      )}
      {filters.projectType && (
        <ActiveChip
          label={PROJECT_TYPES.find((p) => p.slug === filters.projectType)?.label ?? filters.projectType}
          onRemove={() => update({ projectType: null })}
        />
      )}
      {typeof filters.maxDifficulty === "number" && (
        <ActiveChip
          label={`Difficulty ≤ ${filters.maxDifficulty}`}
          onRemove={() => update({ maxDifficulty: null })}
        />
      )}
      {typeof filters.maxApplyMinutes === "number" && (
        <ActiveChip
          label={`Apply ≤ ${filters.maxApplyMinutes}m`}
          onRemove={() => update({ maxApplyMinutes: null })}
        />
      )}
      {filters.search && (
        <ActiveChip
          label={`"${filters.search}"`}
          onRemove={() => update({ search: null })}
        />
      )}
    </>
  );

  return (
    <>
      {/* Sticky control bar — one compact row only (search + sort + filters + count).
       *  Chips + "N of M" detail render below, non-sticky, so the sticky footprint
       *  stays small on scroll. */}
      <div className="sticky top-[var(--masthead-clearance)] z-30 border-b border-[color:var(--rule)] bg-[color:var(--background)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2 page-gutter-x py-2.5 sm:gap-3 sm:py-3">
          <form onSubmit={onSearch} className="flex min-w-0 flex-1 items-center">
            <label className="sr-only" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={currentQ}
              placeholder="Search vendor or program…"
              className="mono h-9 w-full min-w-0 rounded-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-4 text-[13px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-2)] focus-ring sm:h-10"
            />
          </form>

          <div className="hidden items-center gap-2 sm:flex">
            <label className="eyebrow" htmlFor="sort">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="mono h-10 rounded-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 pr-8 text-[12px] text-[color:var(--foreground)] focus-ring"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "mono inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[11.5px] uppercase tracking-[0.16em] focus-ring sm:h-10 sm:px-4 sm:text-[12px]",
              activeCount > 0
                ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                : "border-[color:var(--rule-2)] text-[color:var(--foreground-dim)]",
            )}
            aria-expanded={mobileOpen}
          >
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden" aria-hidden>⚙</span>
            {activeCount > 0 && (
              <span className="num inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--gold)] px-1.5 text-[11px] text-black">
                {activeCount}
              </span>
            )}
          </button>

          <span className="hidden shrink-0 text-[12px] text-[color:var(--muted)] md:inline">
            <span className="num text-[color:var(--foreground)]">{filtered}</span>
            <span className="mx-1 text-[color:var(--muted-2)]">/</span>
            <span className="num">{total}</span>
          </span>
        </div>
      </div>

      {/* Below-the-stick summary row — chips + count. Scrolls away with content. */}
      {(activeCount > 0 || filtered !== total) && (
        <div className="border-b border-[color:var(--rule)] bg-[color:var(--background)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 page-gutter-x py-3">
            <p className="text-[12px] text-[color:var(--muted)]">
              <span className="num text-[color:var(--foreground)]">{filtered}</span> of{" "}
              <span className="num">{total}</span> offers
            </p>
            {activeCount > 0 && (
              <>
                <span aria-hidden className="text-[color:var(--muted-2)]">·</span>
                <div className="flex flex-wrap items-center gap-2">
                  {chips}
                  <button
                    type="button"
                    onClick={reset}
                    className="editorial-link ml-1 text-[11px] text-[color:var(--muted)]"
                  >
                    Clear all
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filter tray — slides down on mobile, inline on desktop */}
      <div
        className={cn(
          "border-b border-[color:var(--rule)] bg-[color:var(--background-2)] transition-[max-height,opacity] duration-300 ease-out overflow-hidden",
          mobileOpen ? "max-h-[2400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-6xl page-gutter-x py-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <FilterGroup title="Founder fit">
              <ToggleRow
                label="Solo-friendly"
                checked={!!filters.solo}
                onChange={(v) => update({ solo: v })}
              />
              <ToggleRow
                label="No VC required"
                checked={!!filters.noVc}
                onChange={(v) => update({ noVc: v })}
              />
              <ToggleRow
                label="No partner referral"
                checked={!!filters.noPartner}
                onChange={(v) => update({ noPartner: v })}
              />
              <ToggleRow
                label="No company entity needed"
                checked={!!filters.noRegistration}
                onChange={(v) => update({ noRegistration: v })}
              />
            </FilterGroup>

            <FilterGroup title="How you get credits">
              <PillRow
                value={filters.creditPath ?? null}
                options={[{ key: null, label: "Any" }, ...PATH_OPTIONS]}
                onChange={(v) => update({ creditPath: v as Filters["creditPath"] })}
              />
            </FilterGroup>

            <FilterGroup title="Stage">
              <PillRow
                value={filters.stage ?? null}
                options={[{ key: null, label: "Any" }, ...STAGE_OPTIONS]}
                onChange={(v) => update({ stage: v as Filters["stage"] })}
              />
            </FilterGroup>

            <FilterGroup title="Credit type">
              <PillRow
                value={filters.creditType ?? null}
                options={[{ key: null, label: "Any" }, ...CREDIT_TYPE_OPTIONS]}
                onChange={(v) => update({ creditType: v as Filters["creditType"] })}
              />
            </FilterGroup>

            <FilterGroup title="Effort">
              <RangeRow
                label="Max difficulty"
                value={filters.maxDifficulty ?? 5}
                min={1}
                max={5}
                onChange={(v) => update({ maxDifficulty: v === 5 ? null : v })}
                format={(v) => `${v}/5`}
              />
              <RangeRow
                label="Max apply time"
                value={filters.maxApplyMinutes ?? 60}
                min={5}
                max={60}
                step={5}
                onChange={(v) => update({ maxApplyMinutes: v === 60 ? null : v })}
                format={(v) => `${v}m`}
              />
            </FilterGroup>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[color:var(--rule)] pt-5">
            <p className="text-[12px] text-[color:var(--muted)]">
              {activeCount > 0 ? `${activeCount} active` : "No filters active"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="mono rounded-full border border-[color:var(--rule-2)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[color:var(--foreground-dim)] focus-ring"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mono rounded-full border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-black focus-ring"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="mono inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)] bg-[color:var(--gold-soft)] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-black"
    >
      {label}
      <span aria-hidden>×</span>
    </button>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 py-2 text-[13px] transition hover:border-[color:var(--rule-3)]">
      <span className="text-[color:var(--foreground-dim)]">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--gold)]"
      />
    </label>
  );
}

function PillRow<T extends string | null>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.key)}
            className={cn(
              "mono rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] focus-ring",
              active
                ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)] text-[color:var(--gold)]"
                : "border-[color:var(--rule-2)] text-[color:var(--foreground-dim)] hover:border-[color:var(--rule-3)]",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function RangeRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div className="rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-3 py-2">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-[color:var(--foreground-dim)]">{label}</span>
        <span className="mono text-[color:var(--gold)]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[color:var(--gold)]"
      />
    </div>
  );
}
