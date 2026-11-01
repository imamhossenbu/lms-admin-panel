"use client";

import React from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface CommunityHeaderProps {
  /** Disables Export when nothing matches the current tab + filters. */
  exportCount: number;
  onExport: () => void;
  onCreate: () => void;
}

/** 🏠 › Community, title + subtitle, "Export" (CSV of the filtered threads) and "+ New Discussion". */
export function CommunityHeader({ exportCount, onExport, onCreate }: CommunityHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Community" }]}
      title={<span className="heading-h3 font-bold! text-primary-500">Community</span>}
      subtitle="Moderate course discussions, answer questions and keep conversations healthy."
    >
      <SecondaryButton leftIcon={<Download className="h-4 w-4" />} disabled={exportCount === 0} onClick={onExport} title={`Export ${exportCount} discussion${exportCount === 1 ? "" : "s"} (CSV)`}>
        Export
      </SecondaryButton>
      <PrimaryButton leftIcon={<Plus className="h-4 w-4" />} onClick={onCreate}>
        New Discussion
      </PrimaryButton>
    </PageHeader>
  );
}

export default CommunityHeader;
