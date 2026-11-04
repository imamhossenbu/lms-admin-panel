"use client";

import React from "react";
import { LayoutList, Search, Table2 } from "lucide-react";
import { motion } from "framer-motion";
import { AppSelect } from "@/components/ui/AppSelect";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { CATEGORY_FILTER_OPTIONS, SORT_OPTIONS, courseFilterOptions, type CommunityFilters, type CommunityListView, type CommunitySort } from "./communityListUtils";

export interface CommunityFiltersBarProps {
  filters: CommunityFilters;
  sort: CommunitySort;
  view: CommunityListView;
  isFiltered: boolean;
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
  onViewChange: (view: CommunityListView) => void;
}

/**
 * Search + All Courses / All Categories / Date Range (last activity) / Sort + Reset, and the list/table toggle.
 * Laid out with container queries because it lives in the 8/12 main column.
 */
export function CommunityFiltersBar({ filters, sort, view, isFiltered, onChange, onReset, onViewChange }: CommunityFiltersBarProps) {
  const courseOptions = courseFilterOptions(useCourseCatalog());
  return (
    <div className="@container">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search by title, content, author or tag..."
              aria-label="Search discussions"
              className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 transition-colors placeholder:text-primary-300 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <SegmentedControl<CommunityListView>
            className="h-10 shrink-0"
            value={view}
            onChange={onViewChange}
            options={[
              { value: "list", label: "List view", icon: <LayoutList />, iconOnly: true },
              { value: "table", label: "Table view", icon: <Table2 />, iconOnly: true },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:flex @4xl:items-center">
          <AppSelect value={filters.course} onValueChange={(v) => onChange({ course: v })} options={courseOptions} className="w-full @4xl:w-48" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.category} onValueChange={(v) => onChange({ category: v })} options={CATEGORY_FILTER_OPTIONS} className="w-full @4xl:w-40" triggerClassName="w-full bg-white" />
          <DateRangeFilter
            value={{ from: filters.from || undefined, to: filters.to || undefined }}
            onChange={(r) => onChange({ from: r.from ?? null, to: r.to ?? null })}
            placeholder="Last activity"
            className="w-full @4xl:w-60"
          />
          <AppSelect value={sort} onValueChange={(v) => onChange({ sort: v === "activity" ? null : v })} options={SORT_OPTIONS} className="w-full @4xl:w-40" triggerClassName="w-full bg-white" />
          <motion.button
            type="button"
            whileTap={isFiltered ? { scale: 0.96 } : undefined}
            onClick={onReset}
            disabled={!isFiltered}
            className="h-10 shrink-0 cursor-pointer rounded-lg border border-dash bg-white px-5 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-40 @md:col-span-2 @4xl:ml-auto"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default CommunityFiltersBar;
