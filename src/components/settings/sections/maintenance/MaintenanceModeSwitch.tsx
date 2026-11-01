"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { Construction, Globe } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface MaintenanceModeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Large status tile with an oversized switch that turns red while the site is offline. */
export function MaintenanceModeSwitch({ checked, onChange }: MaintenanceModeSwitchProps) {
  const id = useId();
  const Icon = checked ? Construction : Globe;

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-200",
        checked ? "border-red/40 bg-red-14" : "border-dash bg-gray-bg"
      )}
    >
      <motion.span
        key={String(checked)}
        initial={{ scale: 0.7, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 20 }}
        className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", checked ? "bg-red text-white" : "bg-green-bg text-green")}
      >
        <Icon className="h-6 w-6" />
      </motion.span>
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer select-none">
        <span className="flex flex-wrap items-center gap-2">
          <span className="body-md-medium font-semibold! text-primary-500">Maintenance mode</span>
          <ToneBadge tone={checked ? "red" : "green"} size="sm" variant="pill" dot>
            {checked ? "Site offline" : "Site live"}
          </ToneBadge>
        </span>
        <span className="mt-0.5 block body-xsm-regular text-primary-300">
          {checked ? "Visitors and students see the maintenance banner instead of the platform." : "Take the student site offline while you upgrade or fix something."}
        </span>
      </label>
      <motion.button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        whileTap={{ scale: 0.94 }}
        onClick={() => onChange(!checked)}
        className={cn("relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red/40 focus-visible:ring-offset-2", checked ? "bg-red" : "bg-slate-300")}
      >
        <motion.span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-xs" animate={{ x: checked ? 24 : 0 }} transition={{ type: "spring", stiffness: 600, damping: 34 }} />
      </motion.button>
    </motion.div>
  );
}

export default MaintenanceModeSwitch;
