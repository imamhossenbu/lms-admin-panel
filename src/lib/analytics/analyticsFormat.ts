/**
 * Analytics core: formatters (English, en-US).
 *
 *   formatCurrency(1234.5, "USD")           → "$1,234.50"   (`{ decimals: 0 }` → "$1,235")
 *   formatCompactCurrency(24580, "USD")     → "$24.6K"      (axis ticks)
 *   formatNumber(2580)                      → "2,580"
 *   formatCompact(15300)                    → "15.3K"
 *   formatPercent(42.37)                    → "42.4%"       (`decimals` default 1, trailing ".0" dropped)
 *   formatChange(kpi.changePct)             → "+12.5%" / "−3%" / "—"
 *   changeDirection(kpi.changePct)          → "up" | "down" | "flat"
 *   rangeLabel(resolvedRange)               → "Last 30 days" | "Oct 2 – Nov 1, 2026" | "All time"
 *   comparisonLabel(resolvedRange)          → "vs previous 30 days" | "all time"
 *   formatShortDate(iso)                    → "Oct 20, 2026"
 *
 * Currency defaults to the Settings → General currency (`sources.currency`); orders are stored in USD,
 * so values are formatted, never converted.
 */

import { DEFAULT_PRESETS, formatDateRange, sameRange, type DateRange as PickerDateRange } from "@/components/ui/date-range/dateRangeUtils";
import type { ResolvedRange } from "./analyticsTypes";

const trimZero = (s: string) => s.replace(/\.0+(?=\D*$)/, "");

export function formatCurrency(value: number, currency = "USD", opts: { decimals?: number } = {}): string {
  const decimals = opts.decimals ?? 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Number.isFinite(value) ? value : 0);
  } catch {
    return `$${(Number.isFinite(value) ? value : 0).toFixed(decimals)}`;
  }
}

export function formatCompactCurrency(value: number, currency = "USD"): string {
  if (Math.abs(value) < 1000) return formatCurrency(value, currency, { decimals: 0 });
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(value);
  } catch {
    return `$${formatCompact(value)}`;
  }
}

export const formatNumber = (value: number) => (Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "0");

export const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number.isFinite(value) ? value : 0);

export const formatPercent = (value: number, decimals = 1) =>
  `${trimZero((Number.isFinite(value) ? value : 0).toFixed(decimals))}%`;

export function changeDirection(changePct: number | null): "up" | "down" | "flat" {
  if (changePct === null || changePct === 0) return "flat";
  return changePct > 0 ? "up" : "down";
}

export function formatChange(changePct: number | null): string {
  if (changePct === null) return "—";
  if (changePct === 0) return "0%";
  const abs = trimZero(Math.abs(changePct).toFixed(1));
  return `${changePct > 0 ? "+" : "−"}${abs}%`;
}

/** Preset name when the range equals a picker preset for today, else the formatted dates. */
export function rangeLabel(range: Pick<ResolvedRange, "fromKey" | "toKey" | "isAllTime">, today: Date = new Date()): string {
  if (range.isAllTime) return "All time";
  const picker: PickerDateRange = { from: range.fromKey, to: range.toKey };
  const preset = DEFAULT_PRESETS.find((p) => p.id !== "all" && sameRange(p.range(today), picker));
  return preset ? preset.label : formatDateRange(picker);
}

/** Caption under a KPI change, e.g. "vs previous 30 days". */
export function comparisonLabel(range: Pick<ResolvedRange, "days" | "isAllTime">): string {
  if (range.isAllTime) return "all time";
  return range.days === 1 ? "vs previous day" : `vs previous ${range.days} days`;
}

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
