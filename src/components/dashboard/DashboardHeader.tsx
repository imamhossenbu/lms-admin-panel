"use client";

import React from "react";
import { Plus } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import { RangePickerButton } from "@/components/ui/date-range/RangePickerButton";
import type { PickerRange } from "@/lib/analytics";

interface DashboardHeaderProps {
  /** Shared reporting period (navbar picker ⇄ URL). */
  range: PickerRange;
  /** Human label, e.g. "Last 30 days" or "All time". */
  rangeLabel: string;
  onRangeChange: (range: PickerRange) => void;
  onCreateCourse: () => void;
}

export function DashboardHeader({ range, rangeLabel, onRangeChange, onCreateCourse }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      {/* Title & Subtitle - Compact & Sleek */}
      <div className="text-left">
        <h1 className="h3-semibold font-bold! text-primary-500 tracking-tight leading-tight!">Overview</h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">Here&apos;s what&apos;s happening across your LMS.</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Period selector: the shared date range picker (same range as the navbar) */}
        <RangePickerButton value={range} label={rangeLabel} onChange={onRangeChange} />

        {/* Create Course */}
        <PrimaryButton leftIcon={<Plus className="w-4 h-4" strokeWidth={2.5} />} onClick={onCreateCourse}>
          Create Course
        </PrimaryButton>
      </div>
    </div>
  );
}
