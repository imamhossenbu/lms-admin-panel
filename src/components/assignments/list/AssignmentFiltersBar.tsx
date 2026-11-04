"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { ListFilters } from "@/components/ui/ListFilters";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { courseFilterOptions, STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from "./assignmentListUtils";
import { useCourseCatalog } from "@/lib/courseCatalog";

export type AssignmentListView = "table" | "grid";

export interface AssignmentFiltersBarProps {
  query: string;
  /** Selected course id, or "All". */
  courseId: string;
  moduleId: string;
  status: string;
  type: string;
  view: AssignmentListView;
  /** Modules of the selected course (empty while "All Courses" is selected → module filter disabled). */
  moduleOptions: AppSelectOption[];
  isFiltered: boolean;
  onChange: (updates: Record<string, string | null>) => void;
  /** Course change (the view also resets module + page). */
  onCourseChange: (courseId: string) => void;
  onReset: () => void;
  onViewChange: (view: AssignmentListView) => void;
}

/** Search + All Courses / All Modules / All Status / All Types + Reset, and the list/grid toggle. */
export function AssignmentFiltersBar({
  query,
  courseId,
  moduleId,
  status,
  type,
  view,
  moduleOptions,
  isFiltered,
  onChange,
  onCourseChange,
  onReset,
  onViewChange,
}: AssignmentFiltersBarProps) {
  const courses = useCourseCatalog();
  const hasCourse = courseId !== "All";
  return (
    <div className="flex flex-col xl:flex-row gap-3">
      <div className="flex-1 min-w-0">
        <ListFilters
          query={query}
          searchPlaceholder="Search assignments..."
          onQueryChange={(q) => onChange({ q })}
          selects={[
            { key: "course", value: courseId, options: courseFilterOptions(courses ?? []), onChange: onCourseChange, className: "xl:w-48" },
            {
              key: "module",
              value: hasCourse ? moduleId : "",
              options: moduleOptions,
              onChange: (v) => onChange({ module: v }),
              placeholder: "Select a course first",
              disabled: !hasCourse,
              className: "xl:w-52",
            },
            { key: "status", value: status, options: STATUS_FILTER_OPTIONS, onChange: (v) => onChange({ status: v }), className: "xl:w-40" },
            { key: "type", value: type, options: TYPE_FILTER_OPTIONS, onChange: (v) => onChange({ type: v }), className: "xl:w-44" },
          ]}
          onReset={onReset}
          isFiltered={isFiltered}
        />
      </div>
      <SegmentedControl<AssignmentListView>
        className="self-start h-10"
        value={view}
        onChange={onViewChange}
        options={[
          { value: "table", label: "List view", icon: <List />, iconOnly: true },
          { value: "grid", label: "Grid view", icon: <LayoutGrid />, iconOnly: true },
        ]}
      />
    </div>
  );
}

export default AssignmentFiltersBar;
