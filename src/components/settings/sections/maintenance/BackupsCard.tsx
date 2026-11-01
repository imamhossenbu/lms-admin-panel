"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, DatabaseBackup, HardDrive } from "lucide-react";
import { toast } from "sonner";
import type { MaintenanceSettings } from "@/validations/platformSettingsSchema";
import { runBackupNow, type BackupEntry } from "@/lib/settingsStorage";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "../security/NumberStepper";
import { BackupsTable } from "./BackupsTable";
import { formatSize, nextBackupLabel } from "./maintenanceUtils";

const FREQUENCIES: { value: MaintenanceSettings["backupFrequency"]; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
];

export interface BackupsCardProps {
  backups: BackupEntry[];
}

/** "Backups": schedule + retention (form fields), "Back up now" and the recent backups table. */
export function BackupsCard({ backups }: BackupsCardProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MaintenanceSettings>();
  const [auto, frequency] = useWatch({ control, name: ["autoBackup", "backupFrequency"] });
  const [running, setRunning] = useState(false);

  const backUpNow = async () => {
    setRunning(true);
    const id = toast.loading("Backing up...", { description: "Creating a snapshot of the database and media." });
    try {
      const entry = await runBackupNow();
      toast.success("Backup completed", { id, description: `${formatSize(entry.sizeMb)} snapshot saved.` });
    } catch (err) {
      toast.error("Backup failed", { id, description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <SettingsCard
      icon={<DatabaseBackup className="h-5 w-5" />}
      tone="blue"
      title="Backups"
      description="Snapshots of your database and uploaded media."
      action={
        <SecondaryButton size="sm" leftIcon={<HardDrive className="h-4 w-4" />} isLoading={running} onClick={backUpNow}>
          {running ? "Backing up..." : "Back up now"}
        </SecondaryButton>
      }
    >
      <SettingsBlockRow>
        <Controller
          control={control}
          name="autoBackup"
          render={({ field }) => <SettingToggleRow title="Automatic backups" description="Run a backup on a schedule, at 2:00 AM platform time." checked={field.value} onChange={field.onChange} />}
        />
        <AnimatePresence initial={false}>
          {auto && (
            <motion.p
              key="next"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-14 flex items-center gap-1.5 overflow-hidden body-xsm-medium text-blue"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Next backup {nextBackupLabel(frequency)}
            </motion.p>
          )}
        </AnimatePresence>
      </SettingsBlockRow>

      <SettingsRow label="Frequency" description="How often automatic backups run.">
        <Controller
          control={control}
          name="backupFrequency"
          render={({ field }) => (
            <div className={auto ? undefined : "pointer-events-none opacity-50"} aria-disabled={!auto}>
              <SegmentedControl options={FREQUENCIES} value={field.value} onChange={field.onChange} />
            </div>
          )}
        />
      </SettingsRow>

      <SettingsRow label="Keep backups for" description="Older backups are deleted automatically (7–365 days)." htmlFor="mnt-retention" required>
        <Controller
          control={control}
          name="backupRetentionDays"
          render={({ field }) => (
            <NumberStepper id="mnt-retention" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={7} max={365} step={7} unit="days" error={errors.backupRetentionDays?.message} />
          )}
        />
      </SettingsRow>

      <SettingsBlockRow>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="body-sm-medium font-semibold! text-primary-500">Recent backups</p>
          <p className="body-xsm-regular text-primary-300">{backups.length} stored</p>
        </div>
        <BackupsTable backups={backups} />
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default BackupsCard;
