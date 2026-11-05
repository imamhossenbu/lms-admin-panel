"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, DatabaseBackup } from "lucide-react";
import type { MaintenanceSettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "../security/NumberStepper";
import { nextBackupLabel } from "./maintenanceUtils";
import { BackupHistory } from "./BackupHistory";

const FREQUENCIES: { value: MaintenanceSettings["backupFrequency"]; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
];

/** "Backups": automatic-backup schedule and retention (saved with the Maintenance section). */
export function BackupsCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MaintenanceSettings>();
  const [auto, frequency] = useWatch({ control, name: ["autoBackup", "backupFrequency"] });

  return (
    <SettingsCard
      icon={<DatabaseBackup className="h-5 w-5" />}
      tone="blue"
      title="Backups"
      description="Schedule and retention for snapshots of this workspace's data."
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
        <BackupHistory />
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default BackupsCard;
