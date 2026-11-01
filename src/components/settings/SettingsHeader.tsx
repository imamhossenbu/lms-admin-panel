"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SystemStatusPill } from "./SystemStatusPill";

export interface SettingsHeaderProps {
  maintenanceMode: boolean;
  onOpenMaintenance: () => void;
}

/** 🏠 › Settings, title + subtitle and the live "System status" pill on the right. */
export function SettingsHeader({ maintenanceMode, onOpenMaintenance }: SettingsHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Settings" }]}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">Settings</span>}
      subtitle="Configure your platform, payments, email and security."
    >
      <SystemStatusPill maintenanceMode={maintenanceMode} onClick={onOpenMaintenance} />
    </PageHeader>
  );
}

export default SettingsHeader;
