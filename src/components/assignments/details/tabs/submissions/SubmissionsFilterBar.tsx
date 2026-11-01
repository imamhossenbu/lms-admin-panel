"use client";

import React from "react";
import { ChevronDown, Download, FileSpreadsheet, ListChecks, Search } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SUBMISSION_SORT_OPTIONS, SUBMISSION_STATUS_OPTIONS } from "./submissionFilters";
import { ViewToggle } from "./ViewToggle";
import type { SubmissionsView } from "./useSubmissionsFilters";

export interface SubmissionsFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  group: string;
  groups: string[];
  onGroupChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  selectedCount: number;
  onExportAll: () => void;
  onExportSelected: () => void;
  view: SubmissionsView;
  onViewChange: (v: SubmissionsView) => void;
}

/** Search, status/group/sort selects, Export ▾ and list/grid toggle. */
export function SubmissionsFilterBar(p: SubmissionsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <InputField
        value={p.search}
        onChange={(e) => p.onSearchChange(e.target.value)}
        placeholder="Search students..."
        aria-label="Search students"
        leftElement={<Search className="h-4 w-4" />}
        containerClassName="lg:max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-2.5 lg:ml-auto">
        <AppSelect value={p.status} onValueChange={p.onStatusChange} options={SUBMISSION_STATUS_OPTIONS} triggerClassName="min-w-36" />
        <AppSelect
          value={p.group}
          onValueChange={p.onGroupChange}
          options={[{ value: "All", label: "All Groups" }, ...p.groups.map((g) => ({ value: g, label: g }))]}
          triggerClassName="min-w-36"
        />
        <AppSelect value={p.sort} onValueChange={p.onSortChange} options={SUBMISSION_SORT_OPTIONS} triggerClassName="min-w-40" />
        <AppDropdownMenu
          items={[
            { key: "all", label: "Export all as CSV", icon: <FileSpreadsheet className="h-4 w-4" />, onClick: p.onExportAll },
            {
              key: "selected",
              label: `Export selected (${p.selectedCount})`,
              icon: <ListChecks className="h-4 w-4" />,
              onClick: p.onExportSelected,
              disabled: p.selectedCount === 0,
            },
          ]}
          trigger={
            <SecondaryButton leftIcon={<Download />} rightIcon={<ChevronDown />} className="text-blue!">
              Export
            </SecondaryButton>
          }
        />
        <ViewToggle value={p.view} onChange={p.onViewChange} />
      </div>
    </div>
  );
}

export default SubmissionsFilterBar;
