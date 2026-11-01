"use client";

import React from "react";
import { Download, Search } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ATTENDANCE_STATUS_OPTIONS, PROGRESS_OPTIONS } from "./enrollmentFilters";

export interface EnrollmentFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  /** Omit to hide the progress select (Attendance tab). */
  progress?: string;
  onProgressChange?: (v: string) => void;
  exportLabel: string;
  onExport: () => void;
  /** Extra trailing actions (e.g. "Send Reminder"). */
  children?: React.ReactNode;
}

/** Search + status (+ progress) selects + Export (+ extra actions). */
export function EnrollmentFilterBar(p: EnrollmentFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <InputField
        value={p.search}
        onChange={(e) => p.onSearchChange(e.target.value)}
        placeholder="Search students by name or email..."
        aria-label="Search students"
        leftElement={<Search className="h-4 w-4" />}
        containerClassName="lg:max-w-sm"
      />
      <div className="flex flex-wrap items-center gap-2.5 lg:ml-auto">
        <AppSelect value={p.status} onValueChange={p.onStatusChange} options={ATTENDANCE_STATUS_OPTIONS} triggerClassName="min-w-36" />
        {p.progress !== undefined && p.onProgressChange && (
          <AppSelect value={p.progress} onValueChange={p.onProgressChange} options={PROGRESS_OPTIONS} triggerClassName="min-w-36" />
        )}
        <SecondaryButton leftIcon={<Download />} onClick={p.onExport}>
          {p.exportLabel}
        </SecondaryButton>
        {p.children}
      </div>
    </div>
  );
}

export default EnrollmentFilterBar;
