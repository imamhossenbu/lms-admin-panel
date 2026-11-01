"use client";

import React, { useState } from "react";
import { Download, RotateCcw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { getSettingsSnapshot } from "@/lib/settingsStorage";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { ResetDemoDataModal } from "./ResetDemoDataModal";
import { downloadStoreJson, wait } from "./maintenanceUtils";

function DangerRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 last:pb-0 @lg:flex-row @lg:items-center @lg:justify-between">
      <div className="min-w-0">
        <p className="body-sm-medium font-semibold! text-primary-500">{title}</p>
        <p className="mt-0.5 body-xsm-regular text-primary-300">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** "Danger zone": export everything as JSON, or wipe all demo data (type RESET to confirm). */
export function DangerZoneCard() {
  const [exporting, setExporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const exportAll = async () => {
    setExporting(true);
    const id = toast.loading("Preparing export...", { description: "Collecting all settings, backups and the activity log." });
    try {
      await wait(700);
      downloadStoreJson(getSettingsSnapshot());
      toast.success("Export ready", { id, description: "Your JSON file is downloading. Secrets are masked." });
    } catch {
      toast.error("Couldn't export data", { id, description: "Please try again." });
    } finally {
      setExporting(false);
    }
  };

  return (
    <SettingsCard
      icon={<TriangleAlert className="h-5 w-5" />}
      tone="red"
      title="Danger zone"
      description="Irreversible or data-wide actions. Proceed with care."
      className="border-red"
    >
      <DangerRow title="Export all data" description="Download every setting, backup record and log entry as a JSON file.">
        <SecondaryButton leftIcon={<Download className="h-4 w-4" />} isLoading={exporting} onClick={exportAll}>
          {exporting ? "Exporting..." : "Export all data"}
        </SecondaryButton>
      </DangerRow>
      <DangerRow title="Reset demo data" description="Wipe everything saved in this browser and start over with fresh sample data.">
        <PrimaryButton variant="danger" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setResetOpen(true)}>
          Reset demo data
        </PrimaryButton>
      </DangerRow>
      <ResetDemoDataModal isOpen={resetOpen} onClose={() => setResetOpen(false)} />
    </SettingsCard>
  );
}

export default DangerZoneCard;
