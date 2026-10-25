"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export interface OutlineValidationBannerProps {
  issues: string[];
}

/** Inline error banner listing why the outline cannot be added to the curriculum yet. */
export function OutlineValidationBanner({ issues }: OutlineValidationBannerProps) {
  return (
    <AnimatePresence initial={false}>
      {issues.length > 0 && (
        <motion.div
          role="alert"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-xl border border-red bg-red-14 p-3.5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red" />
            <div className="min-w-0">
              <p className="body-sm-medium text-red-dark">Fix these before adding the outline to your curriculum:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 body-sm-regular text-red-dark">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OutlineValidationBanner;
