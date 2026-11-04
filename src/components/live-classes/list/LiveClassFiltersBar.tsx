"use client";

import React, { useMemo } from "react";
import { ListFilters } from "@/components/ui/ListFilters";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { useLiveInstructors } from "@/lib/liveClassStorage";
import { STATUS_FILTER_OPTIONS, withAllOption } from "./liveListUtils";
import { UPCOMING_PRESETS } from "@/components/ui/date-range/dateRangeUtils";

export interface LiveClassFiltersBarProps {
  query: string;
  status: string;
  instructor: string;
  course: string;
  from: string;
  to: string;
  isFiltered: boolean;
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
}

/** Search + All Status / All Instructors / All Courses + Date Range + Reset. */
export function LiveClassFiltersBar({ query, status, instructor, course, from, to, isFiltered, onChange, onReset }: LiveClassFiltersBarProps) {
  const catalog = useCourseCatalog();
  const instructors = useLiveInstructors();
  const courseOptions = useMemo(() => withAllOption("All Courses", catalog ?? []), [catalog]);
  const instructorOptions = useMemo(() => withAllOption("All Instructors", (instructors ?? []).map((i) => ({ value: i.id, label: i.name }))), [instructors]);
  return (
    <ListFilters
      query={query}
      searchPlaceholder="Search live classes by title, course, instructor..."
      onQueryChange={(q) => onChange({ q })}
      selects={[
        { key: "status", value: status, options: STATUS_FILTER_OPTIONS, onChange: (v) => onChange({ status: v }), className: "xl:w-36" },
        { key: "instructor", value: instructor, options: instructorOptions, onChange: (v) => onChange({ instructor: v }), className: "xl:w-40" },
        { key: "course", value: course, options: courseOptions, onChange: (v) => onChange({ course: v }), className: "xl:w-44" },
      ]}
      dateRange={{ from: from || undefined, to: to || undefined }}
      dateRangePresets={UPCOMING_PRESETS}
      onDateRangeChange={(r) => onChange({ from: r.from ?? null, to: r.to ?? null })}
      onReset={onReset}
      isFiltered={isFiltered}
    />
  );
}

export default LiveClassFiltersBar;
