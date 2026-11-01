"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, CircleHelp, Eye, MessageCircle, Settings2, SlidersHorizontal, Video, XCircle } from "lucide-react";
import type { LiveClassSettings } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

const ROWS: { key: keyof LiveClassSettings; title: string; description: string; icon: React.ReactNode; tile: string }[] = [
  { key: "allowQa", title: "Allow Q&A", description: "Let students ask questions during the class.", icon: <CircleHelp className="h-4.5 w-4.5" />, tile: "bg-purple-14 text-purple" },
  { key: "makePublic", title: "Make Class Public", description: "Visible to all enrolled students.", icon: <Eye className="h-4.5 w-4.5" />, tile: "bg-gray-bg text-primary-400" },
  { key: "enableChat", title: "Enable Chat", description: "Allow live chat for students.", icon: <MessageCircle className="h-4.5 w-4.5" />, tile: "bg-blue-14 text-blue" },
  { key: "sendReminder", title: "Send Reminder", description: "Send a reminder before the class starts.", icon: <Bell className="h-4.5 w-4.5" />, tile: "bg-yellow-bg text-yellow" },
  { key: "recordClass", title: "Record Class", description: "Automatically record the session.", icon: <Video className="h-4.5 w-4.5" />, tile: "bg-red-14 text-red" },
  { key: "autoAttendance", title: "Auto Attendance", description: "Mark attendance automatically.", icon: <CheckCircle2 className="h-4.5 w-4.5" />, tile: "bg-green-bg text-green" },
];

/** Read-only summary of the 6 class settings; "Manage" jumps to the Settings tab (the full editor). */
export function ClassSettingsSummaryCard({ settings, onManage }: { settings: LiveClassSettings; onManage: () => void }) {
  return (
    <IconSectionCard
      icon={<Settings2 className="h-5 w-5" />}
      tone="orange"
      title="Class Settings"
      action={
        <CardActionButton icon={<SlidersHorizontal />} onClick={onManage}>
          Manage
        </CardActionButton>
      }
      bodyClassName="@container"
    >
      <ul className="grid grid-cols-1 gap-x-6 gap-y-4 @2xl:grid-cols-2">
        {ROWS.map((row, i) => {
          const on = settings[row.key];
          return (
            <motion.li
              key={row.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-center gap-3"
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", row.tile)}>{row.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="body-sm-medium font-semibold! text-primary-500">{row.title}</p>
                <p className="body-xsm-regular text-primary-300">{row.description}</p>
              </div>
              <ToneBadge tone={on ? "green" : "gray"} variant="pill" icon={on ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}>
                {on ? "On" : "Off"}
              </ToneBadge>
            </motion.li>
          );
        })}
      </ul>
    </IconSectionCard>
  );
}

export default ClassSettingsSummaryCard;
