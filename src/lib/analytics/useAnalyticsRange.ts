"use client";

/**
 * Analytics core: the shared reporting period.
 *
 * ONE range for the whole app: the navbar picker's session value (`getGlobalDateRange`,
 * `GLOBAL_DATE_RANGE_EVENT`, default Last 30 days), mirrored into the page URL as `?from=YYYY-MM-DD&to=YYYY-MM-DD`
 * (the same keys Orders/Payments use for their date filters):
 *
 *  - URL wins on load: opening `/?from=2026-10-01&to=2026-10-31` (or reloading) pushes that range into the
 *    navbar picker, so a shared link reproduces the view.
 *  - No URL range: the page uses the navbar range and writes it into the URL.
 *  - Changing the navbar picker updates the URL; `setKeys` (an in-page picker) updates the navbar.
 *  - All time = no `from`/`to` in the URL and `{}` in the session.
 *
 * Usage (component must sit inside <Suspense> because it reads useSearchParams):
 *   const { keys, setKeys } = useAnalyticsRange();
 *   const sources = useAnalyticsSources();
 *   const range = useMemo(() => sources && resolveAnalyticsRange(sources, keys), [sources, keys]);
 */

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useUrlParams } from "@/lib/useUrlParams";
import { getGlobalDateRange, setGlobalDateRange, subscribeGlobalDateRange } from "@/components/layout/DateRangePicker";
import { isDateKey, type PickerRange } from "./analyticsRange";

const readGlobal = () => JSON.stringify(getGlobalDateRange());

const parse = (raw: string): PickerRange => {
  try {
    const v = JSON.parse(raw) as PickerRange;
    return { from: isDateKey(v?.from) ? v.from : undefined, to: isDateKey(v?.to) ? v.to : undefined };
  } catch {
    return {};
  }
};

const keyOf = (r: PickerRange) => `${r.from ?? ""}|${r.to ?? ""}`;

export function useAnalyticsRange(): { keys: PickerRange; setKeys: (next: PickerRange) => void; rangeKey: string } {
  const searchParams = useSearchParams();
  const { set } = useUrlParams();
  const globalRaw = useSyncExternalStore(subscribeGlobalDateRange, readGlobal, readGlobal);

  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");
  const urlRange = useMemo<PickerRange>(
    () => ({ from: isDateKey(urlFrom) ? urlFrom : undefined, to: isDateKey(urlTo) ? urlTo : undefined }),
    [urlFrom, urlTo]
  );
  const urlHas = !!(urlRange.from || urlRange.to);
  const globalRange = useMemo(() => parse(globalRaw), [globalRaw]);

  // URL → navbar (load, reload, back/forward, shared links).
  useEffect(() => {
    if (urlHas && keyOf(urlRange) !== keyOf(parse(readGlobal()))) setGlobalDateRange(urlRange);
  }, [urlHas, urlRange]);

  // Navbar → URL (navbar picker changes, or first visit without a URL range).
  const lastGlobal = useRef<string | null>(null);
  useEffect(() => {
    const first = lastGlobal.current === null;
    const changed = lastGlobal.current !== globalRaw;
    lastGlobal.current = globalRaw;
    if (first ? urlHas : !changed) return;
    if (keyOf(globalRange) !== keyOf(urlRange)) set({ from: globalRange.from ?? null, to: globalRange.to ?? null });
  }, [globalRaw, globalRange, urlRange, urlHas, set]);

  const keys = urlHas ? urlRange : globalRange;
  const setKeys = useCallback((next: PickerRange) => setGlobalDateRange({ from: next.from, to: next.to }), []);

  return { keys, setKeys, rangeKey: keyOf(keys) };
}
