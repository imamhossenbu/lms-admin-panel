"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { SeoCheck } from "./seoAnalysis";

/** Live list of passed / pending SEO checks. */
export function SeoChecklist({ checks }: { checks: SeoCheck[] }) {
  return (
    <ul className="min-w-0 flex-1 space-y-2.5">
      {checks.map((check) => (
        <li key={check.id} className="flex items-start gap-2.5">
          <AnimatePresence mode="wait" initial={false}>
            {check.passed ? (
              <motion.span
                key="ok"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-white"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </motion.span>
            ) : (
              <motion.span
                key="pending"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={check.optional ? "h-5 w-5 shrink-0 rounded-full border-2 border-dash" : "h-5 w-5 shrink-0 rounded-full border-2 border-yellow"}
              />
            )}
          </AnimatePresence>
          <span className={check.passed ? "body-sm-regular text-primary-500" : "body-sm-regular text-primary-300"}>{check.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default SeoChecklist;
