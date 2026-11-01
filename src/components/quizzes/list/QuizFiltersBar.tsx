"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { ListFilters } from "@/components/ui/ListFilters";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { QuizCourseRef } from "@/types/quiz";
import { DIFFICULTY_FILTER_OPTIONS, STATUS_FILTER_OPTIONS, courseFilterOptions, moduleFilterOptions, type QuizListFilters } from "./quizListUtils";

export type QuizListView = "table" | "grid";

export interface QuizFiltersBarProps {
  filters: QuizListFilters;
  courses: QuizCourseRef[];
  view: QuizListView;
  isFiltered: boolean;
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
  onViewChange: (view: QuizListView) => void;
}

/** Search + All Courses / All Modules (per course) / All Status / All Difficulty + Reset, and the list/grid toggle. */
export function QuizFiltersBar({ filters, courses, view, isFiltered, onChange, onReset, onViewChange }: QuizFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row">
      <div className="min-w-0 flex-1">
        <ListFilters
          query={filters.query}
          searchPlaceholder="Search quizzes..."
          onQueryChange={(q) => onChange({ q })}
          selects={[
            { key: "course", value: filters.courseId, options: courseFilterOptions(courses), onChange: (v) => onChange({ course: v, module: null }), className: "xl:w-44" },
            { key: "module", value: filters.moduleId, options: moduleFilterOptions(courses, filters.courseId), onChange: (v) => onChange({ module: v }), className: "xl:w-48" },
            { key: "status", value: filters.status, options: STATUS_FILTER_OPTIONS, onChange: (v) => onChange({ status: v }), className: "xl:w-36" },
            { key: "difficulty", value: filters.difficulty, options: DIFFICULTY_FILTER_OPTIONS, onChange: (v) => onChange({ difficulty: v }), className: "xl:w-40" },
          ]}
          onReset={onReset}
          isFiltered={isFiltered}
        />
      </div>
      <SegmentedControl<QuizListView>
        className="h-10 self-start"
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

export default QuizFiltersBar;
