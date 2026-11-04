"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Activity, Archive, CalendarClock, History, Globe } from "lucide-react";
import type { SettingsAuditEntry } from "@/lib/settingsStorage";
import type { MaintenanceSettings } from "@/validations/platformSettingsSchema";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { settingsFullDate, settingsTimeAgo } from "@/components/settings/shared/settingsTime";
import { SECTION_META, nextBackupLabel } from "./maintenanceUtils";

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

/** Aside: live status — site status, backup schedule / retention and the last settings change. */
export function MaintenanceStatusCard({ audit }: { audit: SettingsAuditEntry[] }) {
  const { control } = useFormContext<MaintenanceSettings>();
  const [on, auto, frequency, retention] = useWatch({ control, name: ["maintenanceMode", "autoBackup", "backupFrequency", "backupRetentionDays"] });
  const last = audit[0];

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
        <StatusRow icon={<CalendarClock className="h-3.5 w-3.5" />} label="Next backup" delay={0.04}>
          {auto ? (
            <span className={value}>{nextBackupLabel(frequency)}</span>
          ) : (
            <ToneBadge tone="yellow" size="sm">
              Paused
            </ToneBadge>
          )}
        </StatusRow>
        <StatusRow icon={<Archive className="h-3.5 w-3.5" />} label="Keep backups for" delay={0.08}>
          <span className={value}>{retention} days</span>
        </StatusRow>
        <StatusRow icon={<History className="h-3.5 w-3.5" />} label="Last change" delay={0.12}>
          {last ? (
            <span className="inline-flex items-center gap-2">
              <ToneBadge tone={SECTION_META[last.section]?.tone ?? "navy"} size="sm">
                {SECTION_META[last.section]?.label ?? last.section}
              </ToneBadge>
              <span className={value} title={settingsFullDate(last.at)}>
                {settingsTimeAgo(last.at)}
              </span>
            </span>
          ) : (
            <span className={value}>None yet</span>
          )}
        </StatusRow>
      </ul>
    </motion.section>
  );
}

export default MaintenanceStatusCard;
