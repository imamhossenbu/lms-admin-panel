"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SubmissionsView } from "./useSubmissionsFilters";

const OPTIONS: { value: SubmissionsView; label: string; icon: React.ReactNode }[] = [
  { value: "list", label: "List view", icon: <List className="h-4.5 w-4.5" /> },
  { value: "grid", label: "Grid view", icon: <LayoutGrid className="h-4.5 w-4.5" /> },
];

/** List / grid toggle with an animated active pill. */
export function ViewToggle({ value, onChange }: { value: SubmissionsView; onChange: (v: SubmissionsView) => void }) {
  return (
    <div className="flex h-10 items-center rounded-lg border border-dash bg-white p-0.5" role="radiogroup" aria-label="Layout">
      {OPTIONS.map((o) => (
        <motion.button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.label}
          title={o.label}
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange(o.value)}
          className={cn("relative flex h-full w-9 cursor-pointer items-center justify-center rounded-md transition-colors", value === o.value ? "text-blue" : "text-primary-300")}
        >
          {value === o.value && (
            <motion.span layoutId="submissions-view-pill" className="absolute inset-0 rounded-md bg-blue-14" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          )}
          <span className="relative">{o.icon}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default ViewToggle;
