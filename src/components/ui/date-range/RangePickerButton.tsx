"use client";

import React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "./dateRangeUtils";

interface RangePickerButtonProps {
  /** Current range ("YYYY-MM-DD" keys; empty = All time). */
  value: DateRange;
  /** Human label shown on the trigger, e.g. "Last 30 days". */
  label: string;
  onChange: (range: DateRange) => void;
  align?: "left" | "right";
  className?: string;
}

/**
 * Report-period picker for page headers (Dashboard, Analytics): the shared DateRangePicker behind a
 * bordered "📅 Last 30 days ⌄" button. Not clearable — "All time" is a preset.
 */
export function RangePickerButton({ value, label, onChange, align = "right", className }: RangePickerButtonProps) {
  return (
    <DateRangePicker
      value={value}
      onChange={onChange}
      align={align}
      clearable={false}
      className={className}
      renderTrigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className={cn(
            "flex h-10 items-center gap-2 px-3.5 rounded-lg border bg-white body-sm-medium text-primary-500 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer",
            open ? "border-brand-orange" : "border-dash"
          )}
        >
          <CalendarDays className="w-3.5 h-3.5 text-primary-300" />
          <span className="whitespace-nowrap">{label}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-primary-300 transition-transform", open && "rotate-180")} />
        </button>
      )}
    />
  );
}

export default RangePickerButton;
