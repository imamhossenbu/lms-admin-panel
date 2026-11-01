"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ATTEMPT_OPTIONS, RESULT_OPTIONS, SORT_OPTIONS } from "./submissionFilters";
import { FilterField } from "./FilterField";
import type { useQuizSubmissionsFilters } from "./useQuizSubmissionsFilters";

export interface SubmissionsFilterBarProps {
  f: ReturnType<typeof useQuizSubmissionsFilters>;
}

/** Search, Result, Attempt, Date Range, Sort and Reset — all URL-synced. */
export function SubmissionsFilterBar({ f }: SubmissionsFilterBarProps) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 items-end gap-3 @xl:grid-cols-2 @4xl:grid-cols-12">
        <FilterField label="Search" className="@4xl:col-span-3">
          <InputField
            value={f.search}
            onChange={(e) => f.setSearch(e.target.value)}
            placeholder="Search by student name or email..."
            aria-label="Search students"
            leftElement={<Search className="h-4 w-4" />}
          />
        </FilterField>
        <FilterField label="Result" className="@4xl:col-span-2">
          <AppSelect fullWidth value={f.filters.result} onValueChange={f.setResult} options={[...RESULT_OPTIONS]} />
        </FilterField>
        <FilterField label="Attempt" className="@4xl:col-span-2">
          <AppSelect fullWidth value={f.filters.attempt} onValueChange={f.setAttempt} options={[...ATTEMPT_OPTIONS]} />
        </FilterField>
        <FilterField label="Date Range" className="@4xl:col-span-2">
          <DateRangeFilter value={{ from: f.filters.from || undefined, to: f.filters.to || undefined }} onChange={f.setRange} placeholder="All Dates" className="w-full" />
        </FilterField>
        <FilterField label="Sort By" className="@4xl:col-span-2">
          <AppSelect fullWidth value={f.filters.sort} onValueChange={f.setSort} options={[...SORT_OPTIONS]} />
        </FilterField>
        <div className="@4xl:col-span-1">
          <SecondaryButton fullWidth leftIcon={<RotateCcw />} onClick={f.reset} disabled={!f.isFiltered}>
            Reset
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

export default SubmissionsFilterBar;
