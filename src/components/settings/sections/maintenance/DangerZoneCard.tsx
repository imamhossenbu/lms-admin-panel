"use client";

import React, { useState } from "react";
import { Download, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { fetchSettings } from "@/lib/settingsStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { downloadStoreJson } from "./maintenanceUtils";

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

/** "Danger zone": export every setting and the change log as JSON. */
export function DangerZoneCard() {
  const [exporting, setExporting] = useState(false);

  const exportAll = async () => {
    setExporting(true);
    const id = toast.loading("Preparing export...", { description: "Collecting all settings and the activity log." });
    try {
      downloadStoreJson(await fetchSettings());
      toast.success("Export ready", { id, description: "Your JSON file is downloading. Secrets are masked." });
    } catch (err) {
      toast.error("Couldn't export data", { id, description: apiErrorMessage(err, "Please try again.") });
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
      <DangerRow title="Export all data" description="Download every setting and log entry as a JSON file. Secrets stay masked.">
        <SecondaryButton leftIcon={<Download className="h-4 w-4" />} isLoading={exporting} onClick={exportAll}>
          {exporting ? "Exporting..." : "Export all data"}
        </SecondaryButton>
      </DangerRow>
    </SettingsCard>
  );
}

export default DangerZoneCard;
