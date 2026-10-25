"use client";

import React from "react";
import { Search } from "lucide-react";
import { AppSelect, AppSelectOption } from "@/components/ui/AppSelect";
import { cn } from "@/lib/cn";

export interface TabFilter {
  key: string;
  value: string;
  options: AppSelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

interface TabFilterBarProps {
  search?: {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    className?: string;
  };
  filters: TabFilter[];
  onReset?: () => void;
  className?: string;
}

/** Search + dropdown filters (+ optional Reset) row shared by the details tabs. */
export function TabFilterBar({ search, filters, onReset, className }: TabFilterBarProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center gap-3", className)}>
      {search && (
        <div className={cn("relative w-full", search.className ?? "md:flex-1")}>
          <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder}
            className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-dash bg-white body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
          />
        </div>
      )}

      {filters.map((filter) => (
        <AppSelect
          key={filter.key}
          value={filter.value}
          onValueChange={filter.onChange}
          options={filter.options}
          className={cn("w-full", filter.className ?? "md:w-56")}
          triggerClassName="w-full h-11 bg-white"
        />
      ))}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-11 px-5 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer md:ml-auto shrink-0"
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default TabFilterBar;
