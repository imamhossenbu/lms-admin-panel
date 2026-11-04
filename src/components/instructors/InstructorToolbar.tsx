"use client";

import React from "react";
import { Search, Download } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface InstructorToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  expertiseFilter: string;
  onExpertiseChange: (expertise: string) => void;
  dateFilter: string;
  onDateChange: (date: string) => void;
  onExport: () => void;
  /** Expertise values used in this workspace. */
  expertiseOptions: string[];
  isExporting?: boolean;
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const DATE_OPTIONS = [
  { value: "All", label: "Join Date" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 3 Months" },
];

export function InstructorToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  expertiseFilter,
  onExpertiseChange,
  dateFilter,
  onDateChange,
  onExport,
  expertiseOptions,
  isExporting = false,
}: InstructorToolbarProps) {
  return (
    <div className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-dash">
      {/* Search Input and Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="w-full sm:w-72">
          <InputField
            id="instructor-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search instructors by name, email..."
            leftElement={<Search className="w-4 h-4 text-primary-300" />}
          />
        </div>

        <div className="w-31.25">
          <DropdownSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full"
          />
        </div>

        <div className="w-38.75">
          <DropdownSelect
            options={[{ value: "All", label: "All Expertise" }, ...expertiseOptions.map((e) => ({ value: e, label: e }))]}
            value={expertiseFilter}
            onChange={onExpertiseChange}
            className="w-full"
          />
        </div>

        <div className="w-32.5">
          <DropdownSelect
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={onDateChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Export CTA Button */}
      <div className="self-end lg:self-auto shrink-0">
        <SecondaryButton
          onClick={onExport}
          disabled={isExporting}
          leftIcon={<Download className="w-4 h-4" />}
          size="md"
        >
          Export
        </SecondaryButton>
      </div>
    </div>
  );
}

export default InstructorToolbar;
