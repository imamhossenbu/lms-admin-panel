"use client";

import React from "react";
import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface ReviewIssuesAlertProps {
  issues: string[];
}

/** Yellow warning box listing what still blocks publishing. */
export function ReviewIssuesAlert({ issues }: ReviewIssuesAlertProps) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-yellow/30 bg-yellow-bg p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <TriangleAlert className="w-4.5 h-4.5 text-yellow shrink-0" />
        <span className="body-sm-medium text-primary-500">Fix these before publishing</span>
        <ToneBadge tone="warning" size="sm" variant="pill">
          {issues.length} {issues.length === 1 ? "issue" : "issues"}
        </ToneBadge>
      </div>
      <ul className="mt-2.5 space-y-1.5 pl-6 list-disc marker:text-yellow">
        {issues.map((issue) => (
          <li key={issue} className="body-sm-regular text-primary-400">
            {issue}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default ReviewIssuesAlert;
