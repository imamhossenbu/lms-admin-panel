"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { ListFilters } from "@/components/ui/ListFilters";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from "./assignmentListUtils";

export type AssignmentListView = "table" | "grid";

export interface AssignmentFiltersBarProps {
  query: string;
  moduleId: string;
  status: string;
  type: string;
  view: AssignmentListView;
  moduleOptions: AppSelectOption[];
  isFiltered: boolean;
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
  onViewChange: (view: AssignmentListView) => void;
}

/** Search + All Modules / All Status / All Types + Reset, and the list/grid toggle. */
export function AssignmentFiltersBar({
  query,
  moduleId,
  status,
  type,
  view,
  moduleOptions,
  isFiltered,
  onChange,
  onReset,
  onViewChange,
}: AssignmentFiltersBarProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-3">
      <div className="flex-1 min-w-0">
        <ListFilters
          query={query}
          searchPlaceholder="Search assignments..."
          onQueryChange={(q) => onChange({ q })}
          selects={[
            { key: "module", value: moduleId, options: moduleOptions, onChange: (v) => onChange({ module: v }), className: "xl:w-52" },
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
