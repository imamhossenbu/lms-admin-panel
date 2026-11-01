"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { CertificateTemplate } from "@/types/certificate";
import { AppSelect } from "@/components/ui/AppSelect";
import { DateRangeFilter, type DateRange } from "@/components/ui/DateRangeFilter";
import { METHOD_FILTER_OPTIONS, STATUS_FILTER_OPTIONS, courseFilterOptions, isIssuedFiltered, templateFilterOptions, type IssuedFilters } from "./certificateListUtils";

export interface IssuedFiltersBarProps {
  filters: IssuedFilters;
  templates: CertificateTemplate[];
  onChange: (updates: Record<string, string | null>) => void;
  onRangeChange: (range: DateRange) => void;
  onReset: () => void;
}

/**
 * Search (name / email / code) on its own row, then Course / Template / Status / Method / Issued date range + Reset.
 * Container queries keep it on two tidy rows inside the card at any width.
 */
export function IssuedFiltersBar({ filters, templates, onChange, onRangeChange, onReset }: IssuedFiltersBarProps) {
  const filtered = isIssuedFiltered(filters);
  return (
    <div className="@container">
      <div className="flex flex-col gap-3 @7xl:flex-row @7xl:items-center">
        <div className="relative min-w-0 @7xl:w-72 @7xl:shrink-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search name, email or code..."
            aria-label="Search certificates"
            className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 transition-colors placeholder:text-primary-300 focus:border-brand-orange focus:outline-none"
          />
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @7xl:flex @7xl:items-center">
          <AppSelect value={filters.courseId} onValueChange={(v) => onChange({ course: v })} options={courseFilterOptions()} className="w-full @7xl:w-auto @7xl:min-w-0 @7xl:flex-1" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.templateId} onValueChange={(v) => onChange({ template: v })} options={templateFilterOptions(templates)} className="w-full @7xl:w-auto @7xl:min-w-0 @7xl:flex-1" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.status} onValueChange={(v) => onChange({ status: v })} options={STATUS_FILTER_OPTIONS} className="w-full @7xl:w-32 @7xl:shrink-0" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.method} onValueChange={(v) => onChange({ method: v })} options={METHOD_FILTER_OPTIONS} className="w-full @7xl:w-36 @7xl:shrink-0" triggerClassName="w-full bg-white" />
          <DateRangeFilter value={filters.range} onChange={onRangeChange} placeholder="Issued date" className="w-full @7xl:w-56 @7xl:shrink-0" />
          <motion.button
            type="button"
            whileTap={filtered ? { scale: 0.96 } : undefined}
            onClick={onReset}
            disabled={!filtered}
            className="h-10 shrink-0 cursor-pointer rounded-lg border border-dash bg-white px-5 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default IssuedFiltersBar;
