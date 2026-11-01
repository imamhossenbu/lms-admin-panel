"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AssignmentCard } from "./AssignmentCard";
import type { AssignmentRowHandlers } from "./AssignmentRowActions";
import type { AssignmentRow } from "./AssignmentsTable";

export interface AssignmentsGridProps {
  rows: AssignmentRow[];
  handlers: AssignmentRowHandlers;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
}

/** Card grid view with staggered entry and layout animation on add/remove. */
export function AssignmentsGrid({ rows, handlers, selectedIds, onSelectRow }: AssignmentsGridProps) {
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {rows.map((row, idx) => (
          <motion.div
            key={row.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(idx, 8) * 0.04 }}
          >
            <AssignmentCard
              row={row}
              handlers={handlers}
              selected={selectedIds.includes(row.id)}
              onSelect={(checked) => onSelectRow(row.id, checked)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default AssignmentsGrid;
