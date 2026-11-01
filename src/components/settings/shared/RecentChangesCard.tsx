"use client";

import React from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import type { SettingsStore } from "@/lib/settingsStorage";
import type { SettingsSection } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { Avatar } from "@/components/ui/Avatar";
import { settingsFullDate, settingsTimeAgo } from "./settingsTime";

export interface RecentChangesCardProps {
  store: SettingsStore;
  section: SettingsSection;
  /** How many entries to show (default 4). */
  limit?: number;
}

/** "Recent changes" — audit entries of one section: who changed what, and when. */
export function RecentChangesCard({ store, section, limit = 4 }: RecentChangesCardProps) {
  const entries = store.audit.filter((a) => a.section === section).slice(0, limit);

  return (
    <IconSectionCard icon={<History className="h-5 w-5" />} title="Recent changes" description="Who changed this section, and when." tone="blue">
      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-6 text-center">
          <History className="h-5 w-5 text-primary-300" />
          <p className="body-sm-medium text-primary-500">No changes yet</p>
          <p className="body-xsm-regular text-primary-300">Saved edits to this section will show up here.</p>
        </div>
      ) : (
        <ol className="relative space-y-4">
          {entries.map((entry, i) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="flex items-start gap-3"
            >
              <Avatar name={entry.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="body-sm-regular text-primary-400">
                  <span className="body-sm-medium font-semibold! text-primary-500">{entry.actor}</span> updated{" "}
                  <span className="text-primary-500">{entry.summary}</span>
                </p>
                <p className="mt-0.5 body-xsm-regular text-primary-300" title={settingsFullDate(entry.at)}>
                  {settingsTimeAgo(entry.at)}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </IconSectionCard>
  );
}

export default RecentChangesCard;
