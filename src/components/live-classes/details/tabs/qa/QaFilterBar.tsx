"use client";

import React from "react";
import { Download, Search } from "lucide-react";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { QA_STATUS_OPTIONS } from "./useQaFilters";

export interface QaFilterBarProps {
  status: string;
  onStatusChange: (v: string) => void;
  student: string;
  students: AppSelectOption[];
  onStudentChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onExport: () => void;
  exportLabel: string;
  exportDisabled?: boolean;
}

/** All Status / All Students / search + "Export Q&A". */
export function QaFilterBar(p: QaFilterBarProps) {
  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:items-center">
      <AppSelect value={p.status} onValueChange={p.onStatusChange} options={QA_STATUS_OPTIONS} triggerClassName="min-w-36" />
      <AppSelect
        value={p.student}
        onValueChange={p.onStudentChange}
        options={[{ value: "All", label: "All Students" }, ...p.students]}
        triggerClassName="min-w-40"
      />
      <InputField
        type="search"
        value={p.search}
        onChange={(e) => p.onSearchChange(e.target.value)}
        placeholder="Search questions..."
        aria-label="Search questions"
        leftElement={<Search className="h-4 w-4" />}
        containerClassName="lg:w-56"
      />
      <SecondaryButton leftIcon={<Download />} onClick={p.onExport} disabled={p.exportDisabled}>
        {p.exportLabel}
      </SecondaryButton>
    </div>
  );
}

export default QaFilterBar;
