"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Activity, CalendarClock, CheckCircle2, Database, Globe, HardDrive } from "lucide-react";
import type { BackupEntry } from "@/lib/settingsStorage";
import type { MaintenanceSettings } from "@/validations/platformSettingsSchema";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { settingsFullDate, settingsTimeAgo } from "@/components/settings/shared/settingsTime";
import { formatSize, nextBackupLabel } from "./maintenanceUtils";

function StatusRow({ icon, label, children, delay }: { icon: React.ReactNode; label: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.li initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay }} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex min-w-0 items-center gap-2.5 body-sm-regular text-primary-400">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-bg text-primary-400">{icon}</span>
        {label}
      </span>
      <span className="shrink-0 text-right">{children}</span>
    </motion.li>
  );
}

/** Aside: live system health — site status, last / next backup, storage and success rate. */
export function MaintenanceStatusCard({ backups }: { backups: BackupEntry[] }) {
  const { control } = useFormContext<MaintenanceSettings>();
  const [on, auto, frequency] = useWatch({ control, name: ["maintenanceMode", "autoBackup", "backupFrequency"] });
  const lastOk = backups.find((b) => b.status === "COMPLETED");
  const completed = backups.filter((b) => b.status === "COMPLETED");
  const storage = completed.reduce((sum, b) => sum + b.sizeMb, 0);
  const rate = backups.length ? Math.round((completed.length / backups.length) * 100) : 100;

  const value = "body-sm-medium font-semibold! text-primary-500 tabular-nums";

  return (
    <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="dashboard-card shadow-2xs p-5">
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
          <Activity className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <h3 className="body-sm-medium font-semibold! text-primary-500">System status</h3>
          <p className="body-xsm-regular text-primary-300">Reflects your unsaved edits.</p>
        </div>
      </header>
      <ul className="divide-y divide-dash">
        <StatusRow icon={<Globe className="h-3.5 w-3.5" />} label="Student site" delay={0}>
          <ToneBadge tone={on ? "red" : "green"} size="sm" variant="pill" dot>
            {on ? "Maintenance" : "Live"}
          </ToneBadge>
        </StatusRow>
        <StatusRow icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Last backup" delay={0.04}>
          <span className={value} title={lastOk ? settingsFullDate(lastOk.at) : undefined}>
            {lastOk ? settingsTimeAgo(lastOk.at) : "None yet"}
          </span>
        </StatusRow>
        <StatusRow icon={<CalendarClock className="h-3.5 w-3.5" />} label="Next backup" delay={0.08}>
          {auto ? (
            <span className={value}>{nextBackupLabel(frequency)}</span>
          ) : (
            <ToneBadge tone="yellow" size="sm">
              Paused
            </ToneBadge>
          )}
        </StatusRow>
        <StatusRow icon={<HardDrive className="h-3.5 w-3.5" />} label="Backup storage" delay={0.12}>
          <span className={value}>{formatSize(storage)}</span>
        </StatusRow>
        <StatusRow icon={<Database className="h-3.5 w-3.5" />} label="Success rate" delay={0.16}>
          <ToneBadge tone={rate >= 90 ? "green" : rate >= 70 ? "yellow" : "red"} size="sm">
            {rate}%
          </ToneBadge>
        </StatusRow>
      </ul>
    </motion.section>
  );
}

export default MaintenanceStatusCard;
