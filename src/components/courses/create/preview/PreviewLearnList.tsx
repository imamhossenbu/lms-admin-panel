"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ListChecks } from "lucide-react";
import { PreviewEmptyState } from "./PreviewEmptyState";

/** "What You'll Learn" checklist (AI learning outcomes or description bullets). */
export function PreviewLearnList({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-dash p-4 text-left">
      <h4 className="body-md-medium font-semibold text-primary-500">What You&apos;ll Learn</h4>
      {items.length ? (
        <ul className="mt-3 space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <motion.li
                key={`${index}-${item}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: index * 0.03 }}
                className="flex items-start gap-2.5 body-sm-regular text-primary-400"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-green shrink-0 mt-0.5" />
                <span className="min-w-0 break-words">{item}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <PreviewEmptyState
          icon={<ListChecks />}
          title="No learning outcomes yet"
          description="Generate a curriculum with AI or add a bullet list to the full description."
        />
      )}
    </div>
  );
}

export default PreviewLearnList;
