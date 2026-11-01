"use client";

import React from "react";
import { Download, GitCompareArrows } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/primary-button";
import { RangePickerButton } from "@/components/ui/date-range/RangePickerButton";
import type { PickerRange } from "@/lib/analytics";

interface AnalyticsHeaderProps {
  range: PickerRange;
  rangeLabel: string;
  /** e.g. "vs previous 30 days" or "all time". */
  comparison: string;
  onRangeChange: (range: PickerRange) => void;
  onExport: () => void;
  exporting?: boolean;
}

/** 🏠 › Analytics header with the shared period picker, comparison note and "Export report". */
export function AnalyticsHeader({ range, rangeLabel, comparison, onRangeChange, onExport, exporting }: AnalyticsHeaderProps) {
  const note = comparison === "all time" ? "All time · no comparison" : `Compared ${comparison}`;
  return (
    <PageHeader
      breadcrumbs={[{ label: "Analytics" }]}
      title="Analytics"
      subtitle="Reports across revenue, students, courses and engagement"
      className="mb-3"
    >
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <span className="hidden lg:flex items-center gap-1.5 body-xsm-regular text-primary-300 whitespace-nowrap">
          <GitCompareArrows className="h-3.5 w-3.5" />
          {note}
        </span>
        <RangePickerButton value={range} label={rangeLabel} onChange={onRangeChange} />
        <PrimaryButton leftIcon={<Download className="h-4 w-4" strokeWidth={2.5} />} onClick={onExport} isLoading={exporting}>
          Export report
        </PrimaryButton>
      </div>
    </PageHeader>
  );
}

export default AnalyticsHeader;
