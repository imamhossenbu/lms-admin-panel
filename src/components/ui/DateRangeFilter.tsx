"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DateRange {
  /** yyyy-mm-dd, inclusive */
  from?: string;
  /** yyyy-mm-dd, inclusive */
  to?: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmt = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Today", range: () => ({ from: toKey(new Date()), to: toKey(new Date()) }) },
  {
    label: "Last 7 days",
    range: () => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return { from: toKey(d), to: toKey(new Date()) };
    },
  },
  {
    label: "Last 30 days",
    range: () => {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      return { from: toKey(d), to: toKey(new Date()) };
    },
  },
  {
    label: "This month",
    range: () => {
      const d = new Date();
      return { from: toKey(new Date(d.getFullYear(), d.getMonth(), 1)), to: toKey(d) };
    },
  },
];

/** "is this ISO timestamp inside the range" (inclusive, local days). */
export const isInDateRange = (iso: string, range: DateRange) => {
  const key = toKey(new Date(iso));
  return (!range.from || key >= range.from) && (!range.to || key <= range.to);
};

export const formatDateRange = (range: DateRange) =>
  range.from && range.to
    ? range.from === range.to
      ? fmt(range.from)
      : `${fmt(range.from)} - ${fmt(range.to)}`
    : range.from
      ? `From ${fmt(range.from)}`
      : range.to
        ? `Until ${fmt(range.to)}`
        : "";

/** Button + dropdown with quick presets and a custom from/to range. */
export function DateRangeFilter({ value, onChange, placeholder = "Select Date Range", className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const label = formatDateRange(value);
  const invalid = !!(draft.from && draft.to && draft.from > draft.to);

  const apply = (range: DateRange) => {
    onChange(range);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setDraft(value);
          setIsOpen((prev) => !prev);
        }}
        className="w-full h-10 px-3.5 rounded-lg border border-dash bg-white flex items-center gap-2.5 body-sm-regular transition-colors hover:border-primary-300 cursor-pointer"
      >
        <CalendarDays className="w-4 h-4 text-primary-400 shrink-0" />
        <span className={cn("flex-1 text-left truncate", label ? "text-primary-500" : "text-primary-300")}>
          {label || placeholder}
        </span>
        {label ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date range"
            onClick={(e) => {
              e.stopPropagation();
              onChange({});
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                onChange({});
              }
            }}
            className="p-0.5 rounded text-primary-300 hover:text-red hover:bg-red-14 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <ChevronDown className="w-4 h-4 text-primary-400 shrink-0" />
        )}
      </button>

      <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-label="Choose a date range"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-dash bg-white shadow-xl p-4 space-y-4 text-left origin-top-right"
        >
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => apply(preset.range())}
                className="h-8 rounded-lg border border-dash body-xsm-medium text-primary-500 hover:bg-slate-50 hover:border-brand-orange transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <span className="body-xsm-medium text-primary-400">From</span>
              <input
                type="date"
                value={draft.from ?? ""}
                max={draft.to}
                onChange={(e) => setDraft((prev) => ({ ...prev, from: e.target.value || undefined }))}
                className="w-full h-9 px-2 rounded-lg border border-dash body-xsm-regular text-primary-500 focus:outline-none focus:border-brand-orange"
              />
            </label>
            <label className="space-y-1">
              <span className="body-xsm-medium text-primary-400">To</span>
              <input
                type="date"
                value={draft.to ?? ""}
                min={draft.from}
                onChange={(e) => setDraft((prev) => ({ ...prev, to: e.target.value || undefined }))}
                className="w-full h-9 px-2 rounded-lg border border-dash body-xsm-regular text-primary-500 focus:outline-none focus:border-brand-orange"
              />
            </label>
          </div>
          {invalid && <p className="body-xsm-regular text-red">&quot;From&quot; must be before &quot;To&quot;.</p>}

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-dash">
            <button
              type="button"
              onClick={() => apply({})}
              className="body-sm-medium text-primary-400 hover:text-red transition-colors cursor-pointer pt-3"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={invalid || (!draft.from && !draft.to)}
              onClick={() => apply(draft)}
              className="mt-3 h-8 px-4 rounded-lg bg-brand-orange text-white body-sm-medium hover:bg-brand-orange-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default DateRangeFilter;
