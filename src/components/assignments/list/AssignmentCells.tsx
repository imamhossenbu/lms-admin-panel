"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AssignmentItem } from "@/types/assignment";
import { dueLabel } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";
import { formatDueDate, submissionPct } from "./assignmentListUtils";

/** Title + one-line muted meta ("Module 1 · Lesson 4"); full labels in the tooltip. */
export function AssignmentTitleCell({ title, meta, metaTitle }: { title: string; meta: string; metaTitle: string }) {
  return (
    <div className="min-w-0">
      <p className="body-sm-medium text-primary-500 truncate" title={title}>
        {title}
      </p>
      <p className="mt-0.5 body-xsm-regular text-primary-300 truncate" title={metaTitle}>
        {meta}
      </p>
    </div>
  );
}

/** "Oct 25, 2026" + "5 days left" (red when urgent / overdue). */
export function DueDateCell({ assignment }: { assignment: Pick<AssignmentItem, "dueDate" | "dueTime"> }) {
  const label = dueLabel(assignment);
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-medium text-primary-500">{formatDueDate(assignment)}</p>
      <p className={cn("mt-0.5 body-xsm-regular", label.tone === "red" ? "text-red" : "text-primary-300")}>{label.text}</p>
    </div>
  );
}

/** "28/32" (compact) or "28 / 32" + progress bar (green at ≥ 75 %, orange below). */
export function SubmissionsProgress({
  submitted,
  enrolled,
  compact = false,
  className,
}: {
  submitted: number;
  enrolled: number;
  /** Table cell: tight count + fixed narrow bar. */
  compact?: boolean;
  className?: string;
}) {
  const pct = submissionPct(submitted, enrolled);
  return (
    <div className={cn(compact ? "w-16" : "min-w-28", className)}>
      <p className="body-sm-medium text-primary-500 tabular-nums whitespace-nowrap">
        {compact ? `${submitted}/${enrolled}` : `${submitted} / ${enrolled}`}
      </p>
      <div
        className={cn("w-full rounded-full bg-slate-200 overflow-hidden", compact ? "mt-1 h-1" : "mt-1.5 h-1.5")}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% submitted`}
      >
        <motion.div
          className={cn("h-full rounded-full", pct >= 75 ? "bg-green" : "bg-brand-orange")}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
