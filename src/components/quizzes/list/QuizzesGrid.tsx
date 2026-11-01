"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuizCard } from "./QuizCard";
import type { QuizRowHandlers } from "./QuizRowActions";
import type { QuizRow } from "./quizListUtils";

export interface QuizzesGridProps {
  rows: QuizRow[];
  handlers: QuizRowHandlers;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
}

/** Card grid with staggered entry and layout animation on add/remove. */
export function QuizzesGrid({ rows, handlers, selectedIds, onSelectRow }: QuizzesGridProps) {
  return (
    <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            <QuizCard row={row} handlers={handlers} selected={selectedIds.includes(row.id)} onSelect={(checked) => onSelectRow(row.id, checked)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuizzesGrid;
