"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Download, Eye, Settings, Trash2, Upload } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { cn } from "@/lib/cn";

export type RubricActionKey = "preview" | "duplicate" | "import" | "export" | "delete";

const ACTIONS: { key: RubricActionKey; label: string; icon: React.ReactNode; danger?: boolean }[] = [
  { key: "preview", label: "Preview Rubric (Student View)", icon: <Eye className="h-4.5 w-4.5" /> },
  { key: "duplicate", label: "Duplicate Rubric", icon: <Copy className="h-4.5 w-4.5" /> },
  { key: "import", label: "Import Rubric", icon: <Upload className="h-4.5 w-4.5" /> },
  { key: "export", label: "Export Rubric", icon: <Download className="h-4.5 w-4.5" /> },
  { key: "delete", label: "Delete Rubric", icon: <Trash2 className="h-4.5 w-4.5" />, danger: true },
];

export interface RubricQuickActionsProps {
  onAction: (key: RubricActionKey) => void;
  /** Keys rendered disabled (e.g. nothing to export). */
  disabled?: Partial<Record<RubricActionKey, boolean>>;
}

/** Sidebar "Quick Actions" list for the Rubric tab. */
export function RubricQuickActions({ onAction, disabled = {} }: RubricQuickActionsProps) {
  return (
    <IconSectionCard icon={<Settings className="h-5 w-5" />} title="Quick Actions" bodyClassName="mt-4 space-y-2.5">
      {ACTIONS.map((a) => (
        <motion.button
          key={a.key}
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={disabled[a.key]}
          onClick={() => onAction(a.key)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left body-sm-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            a.danger ? "border-red/30 text-red hover:bg-red-14" : "border-dash text-blue hover:bg-blue-14"
          )}
        >
          <span className="shrink-0">{a.icon}</span>
          {a.label}
        </motion.button>
      ))}
    </IconSectionCard>
  );
}

export default RubricQuickActions;
