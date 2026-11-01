"use client";

import React from "react";
import { ChevronDown, Download, FileSpreadsheet, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";

export interface LiveClassesHeaderProps {
  filteredCount: number;
  selectedCount: number;
  onExportFiltered: () => void;
  onExportSelected: () => void;
  onSchedule: () => void;
}

/** 🏠 › Live Classes, title + subtitle, "Export ▾" (CSV) and "+ Schedule Live Class". */
export function LiveClassesHeader({ filteredCount, selectedCount, onExportFiltered, onExportSelected, onSchedule }: LiveClassesHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Live Classes" }]}
      title={<span className="heading-h3 font-bold! text-primary-500 tracking-tight">Live Classes</span>}
      subtitle="Manage and schedule your live classes, webinars and online sessions."
    >
      <AppDropdownMenu
        items={[
          {
            key: "filtered",
            label: `Export ${filteredCount} class${filteredCount === 1 ? "" : "es"} (CSV)`,
            icon: <FileSpreadsheet className="w-3.5 h-3.5 text-primary-400" />,
            disabled: filteredCount === 0,
            onClick: onExportFiltered,
          },
          {
            key: "selected",
            label: `Export selected (${selectedCount})`,
            icon: <Download className="w-3.5 h-3.5 text-primary-400" />,
            disabled: selectedCount === 0,
            onClick: onExportSelected,
          },
        ]}
        trigger={
          <SecondaryButton rightIcon={<ChevronDown className="w-4 h-4" />}>Export</SecondaryButton>
        }
      />
      <PrimaryButton onClick={onSchedule} leftIcon={<Plus className="w-4 h-4" />}>
        Schedule Live Class
      </PrimaryButton>
    </PageHeader>
  );
}

export default LiveClassesHeader;
