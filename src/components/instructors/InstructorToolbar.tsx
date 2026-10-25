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
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EXPERTISE_OPTIONS = [
  { value: "All", label: "All Expertise" },
  { value: "Web Development", label: "Web Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Business Strategy", label: "Business Strategy" },
  { value: "Photography", label: "Photography" },
  { value: "Data Science", label: "Data Science" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Content Writing", label: "Content Writing" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "English Language", label: "English Language" },
];

const DATE_OPTIONS = [
  { value: "All", label: "Join Date" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 3 Months" },
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

        <div className="w-[125px]">
          <DropdownSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full"
          />
        </div>

        <div className="w-[155px]">
          <DropdownSelect
            options={EXPERTISE_OPTIONS}
            value={expertiseFilter}
            onChange={onExpertiseChange}
            className="w-full"
          />
        </div>

        <div className="w-[130px]">
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
