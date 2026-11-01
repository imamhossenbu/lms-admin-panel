"use client";

import React, { useSyncExternalStore } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { DateRangePicker as SharedDateRangePicker } from "@/components/ui/date-range/DateRangePicker";
import { addDays, toKey, type DateRange } from "@/components/ui/date-range/dateRangeUtils";

const STORAGE_KEY = "edupro_global_date_range";
export const GLOBAL_DATE_RANGE_EVENT = "edupro_global_date_range_changed";

const last30 = (): DateRange => ({ from: toKey(addDays(new Date(), -29)), to: toKey(new Date()) });

/** Read the navbar's reporting period (defaults to the last 30 days). */
export function getGlobalDateRange(): DateRange {
  if (typeof window === "undefined") return last30();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DateRange;
  } catch {
    /* fall through */
  }
  return last30();
}

/** Set the navbar's reporting period (session) and broadcast GLOBAL_DATE_RANGE_EVENT. */
export function setGlobalDateRange(next: DateRange) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(GLOBAL_DATE_RANGE_EVENT));
}

export const subscribeGlobalDateRange = (cb: () => void) => {
  window.addEventListener(GLOBAL_DATE_RANGE_EVENT, cb);
  return () => window.removeEventListener(GLOBAL_DATE_RANGE_EVENT, cb);
};
/** Stable string snapshot (JSON) so useSyncExternalStore compares by value. */
const readRaw = () => JSON.stringify(getGlobalDateRange());

/**
 * Navbar reporting-period picker: the shared DateRangePicker with a compact pill trigger.
 * The choice is kept for the browser session and broadcast with GLOBAL_DATE_RANGE_EVENT so
 * dashboards can listen.
 */
export function DateRangePicker() {
  // Session value on the client, empty on the server (no hydration mismatch).
  const raw = useSyncExternalStore(subscribeGlobalDateRange, readRaw, () => "");
  const range: DateRange = raw ? (JSON.parse(raw) as DateRange) : {};

  const update = setGlobalDateRange;

  return (
    <SharedDateRangePicker
      value={range}
      onChange={update}
      align="right"
      clearable={false}
      renderTrigger={({ open, label, toggle }) => (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className={cn(
            "flex h-10 cursor-pointer items-center gap-2 rounded-lg border bg-white px-3.5 shadow-2xs transition-colors hover:bg-gray-bg",
            open ? "border-brand-orange" : "border-dash"
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-primary-400" />
          <span className="whitespace-nowrap body-sm-medium text-primary-500">{label || "All time"}</span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-primary-300 transition-transform", open && "rotate-180")} />
        </button>
      )}
    />
  );
}

export default DateRangePicker;
