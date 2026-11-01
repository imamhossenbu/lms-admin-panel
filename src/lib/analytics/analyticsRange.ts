/**
 * Analytics core: date-range maths (pure, local time).
 *
 * The shared picker (`components/ui/date-range`) speaks inclusive "YYYY-MM-DD" keys (`PickerRange`);
 * the metrics speak absolute instants (`DateRange`). Convert once with `resolveRange`.
 *
 *   resolveRange(keys, { now, earliest })  → ResolvedRange   (empty keys = All time: earliest data day → today)
 *   previousRange(range)                   → DateRange       (same length, ending 1 ms before range.from)
 *   autoGranularity(range)                 → "day" ≤ 31 days, "week" ≤ 182 days, else "month"
 *   buildBuckets(range, granularity)       → TimeBucket[]    (day / rolling 7-day weeks from range.from / calendar months, clipped)
 *   splitRange(range, n = 10)              → DateRange[]     (n equal segments, used for KPI sparklines)
 *   isWithin(iso | Date, range)            → boolean         (inclusive)
 *   parseDisplayDate("Oct 18, 2026")       → Date | null     (store fields saved as display text)
 */

import type { DateRange, Granularity, ResolvedRange, TimeBucket } from "./analyticsTypes";

/** Picker value: inclusive "YYYY-MM-DD" keys; both empty = All time. */
export interface PickerRange {
  from?: string;
  to?: string;
}

const DAY_MS = 86400000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
export const isDateKey = (v: unknown): v is string => typeof v === "string" && KEY_RE.test(v);

/** "Oct 18, 2026" / "Oct 8, 2026" → local Date (null when unparseable). */
export function parseDisplayDate(text: string | undefined | null): Date | null {
  if (!text) return null;
  const m = /^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/.exec(text.trim());
  if (m) {
    const month = MONTHS.indexOf(m[1].slice(0, 1).toUpperCase() + m[1].slice(1, 3).toLowerCase());
    if (month >= 0) return new Date(Number(m[3]), month, Number(m[2]));
  }
  const t = Date.parse(text);
  return Number.isNaN(t) ? null : new Date(t);
}

const daysBetween = (from: Date, to: Date) => Math.max(1, Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS) + 1);

/**
 * Picker keys → absolute window. Missing `from` = earliest data day, missing `to` = today.
 * `earliest` should be the first data point (see `dataStart(sources)` in analyticsMetrics).
 */
export function resolveRange(keys: PickerRange, opts: { now: Date; earliest?: Date }): ResolvedRange {
  const fromKey = isDateKey(keys.from) ? keys.from : undefined;
  const toKey = isDateKey(keys.to) ? keys.to : undefined;
  const isAllTime = !fromKey && !toKey;
  let to = toKey ? endOfDay(fromDateKey(toKey)) : endOfDay(opts.now);
  let from = fromKey ? startOfDay(fromDateKey(fromKey)) : startOfDay(opts.earliest ?? addDays(opts.now, -29));
  if (from > to) [from, to] = [startOfDay(to), endOfDay(from)];
  return { from, to, fromKey, toKey, isAllTime, days: daysBetween(from, to) };
}

/** Window of equal length immediately before `range`. */
export function previousRange(range: DateRange): DateRange {
  const length = range.to.getTime() - range.from.getTime();
  const to = new Date(range.from.getTime() - 1);
  return { from: new Date(to.getTime() - length), to };
}

export function autoGranularity(range: DateRange): Granularity {
  const days = daysBetween(range.from, range.to);
  if (days <= 31) return "day";
  if (days <= 182) return "week";
  return "month";
}

const pad = (n: number) => String(n).padStart(2, "0");
const shortDay = (d: Date) => `${MONTHS[d.getMonth()]} ${pad(d.getDate())}`;
const longDay = (d: Date) => `${shortDay(d)}, ${d.getFullYear()}`;

/** X-axis buckets covering the range (last bucket clipped to range.to). */
export function buildBuckets(range: DateRange, granularity: Granularity = autoGranularity(range)): TimeBucket[] {
  const buckets: TimeBucket[] = [];
  const endMs = range.to.getTime();
  let start = startOfDay(range.from);
  let guard = 0;
  while (start.getTime() <= endMs && guard++ < 1000) {
    let next: Date;
    if (granularity === "day") next = addDays(start, 1);
    else if (granularity === "week") next = addDays(start, 7);
    else next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const lastDay = new Date(Math.min(next.getTime(), endMs + 1) - 1);
    const label =
      granularity === "month" ? `${MONTHS[start.getMonth()]} ${start.getFullYear()}` : shortDay(start);
    const fullLabel =
      granularity === "day"
        ? longDay(start)
        : startOfDay(lastDay).getTime() === start.getTime()
          ? longDay(start)
          : `${shortDay(start)} – ${longDay(lastDay)}`;
    buckets.push({ key: dateKey(start), label, fullLabel, start, end: new Date(Math.min(next.getTime(), endMs + 1)) });
    start = next;
  }
  return buckets;
}

/** n equal consecutive segments (inclusive ends) — used for KPI sparklines. */
export function splitRange(range: DateRange, n = 10): DateRange[] {
  const startMs = range.from.getTime();
  const span = range.to.getTime() - startMs + 1;
  return Array.from({ length: n }, (_, i) => ({
    from: new Date(startMs + Math.floor((span * i) / n)),
    to: new Date(startMs + Math.floor((span * (i + 1)) / n) - 1),
  }));
}

/** Inclusive containment for an ISO string, Date or epoch ms. */
export function isWithin(value: string | Date | number | null | undefined, range: DateRange): boolean {
  if (value === null || value === undefined || value === "") return false;
  const t = typeof value === "number" ? value : typeof value === "string" ? Date.parse(value) : value.getTime();
  return !Number.isNaN(t) && t >= range.from.getTime() && t <= range.to.getTime();
}

/** Bucket index for a timestamp (−1 when outside). Buckets must be sorted (buildBuckets output). */
export function bucketIndex(value: string | Date | number, buckets: TimeBucket[]): number {
  const t = typeof value === "number" ? value : typeof value === "string" ? Date.parse(value) : value.getTime();
  if (Number.isNaN(t)) return -1;
  for (let i = 0; i < buckets.length; i++) {
    if (t >= buckets[i].start.getTime() && t < buckets[i].end.getTime()) return i;
  }
  return -1;
}
