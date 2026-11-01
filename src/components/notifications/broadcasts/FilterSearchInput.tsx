"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}

/** Search box used by the broadcast list and recipients filter bars. */
export function FilterSearchInput({ value, onChange, placeholder, ariaLabel, className }: FilterSearchInputProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 transition-colors placeholder:text-primary-300 focus:border-brand-orange focus:outline-none"
      />
    </div>
  );
}

export default FilterSearchInput;
