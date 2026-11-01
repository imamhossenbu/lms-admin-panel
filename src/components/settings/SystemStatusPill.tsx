"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface SystemStatusPillProps {
  /** store.settings.maintenance.maintenanceMode — updates live after Maintenance is saved. */
  maintenanceMode: boolean;
  /** Click → jump to the Maintenance section. */
  onClick?: () => void;
}

/** "System status" capsule: green "All systems normal" or red "Maintenance mode on". */
export function SystemStatusPill({ maintenanceMode, onClick }: SystemStatusPillProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title="Open maintenance settings"
      className="inline-flex items-center gap-2.5 rounded-full border border-dash bg-white py-1.5 pl-3.5 pr-1.5 shadow-2xs transition-colors hover:border-slate-300"
    >
      <span className="body-xsm-medium whitespace-nowrap text-primary-300">System status</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={maintenanceMode ? "maintenance" : "normal"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex"
        >
          {maintenanceMode ? (
            <ToneBadge tone="red" variant="pill" dot>
              Maintenance mode on
            </ToneBadge>
          ) : (
            <ToneBadge tone="green" variant="pill" dot>
              All systems normal
            </ToneBadge>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default SystemStatusPill;
