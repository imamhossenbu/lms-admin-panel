"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface SegmentedControlProps<K extends string> {
  options: { value: K; label: string }[];
  value: K;
  onChange: (value: K) => void;
  className?: string;
}

/** Joined button group (e.g. Month / Week / Day) with a solid active segment. */
export function SegmentedControl<K extends string>({ options, value, onChange, className }: SegmentedControlProps<K>) {
  return (
    <div role="radiogroup" className={cn("inline-flex rounded-lg border border-dash bg-white overflow-hidden shrink-0", className)}>
      {options.map((option, idx) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 px-4 body-sm-medium transition-colors cursor-pointer",
              idx > 0 && "border-l border-dash",
              isActive ? "bg-blue text-white" : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
