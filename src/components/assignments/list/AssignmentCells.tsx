"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AssignmentItem } from "@/types/assignment";
import { dueLabel } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";
import { formatDueDate, submissionPct } from "./assignmentListUtils";

/** "Module 1: Getting Started" over "Lesson 3: Your First HTML Page". */
export function ModuleLessonCell({ module, lesson }: { module: string; lesson: string | null }) {
  return (
    <div className="min-w-48 max-w-64">
      <p className="body-sm-regular text-primary-400 truncate" title={module}>
        {module}
      </p>
      <p className="body-sm-regular text-primary-300 truncate" title={lesson ?? undefined}>
        {lesson ?? "No lesson linked"}
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
      <p className={cn("body-sm-regular", label.tone === "red" ? "text-red" : "text-primary-300")}>{label.text}</p>
    </div>
  );
}

/** "28 / 32" + progress bar (green at ≥ 75 %, orange below). */
export function SubmissionsProgress({ submitted, enrolled, className }: { submitted: number; enrolled: number; className?: string }) {
  const pct = submissionPct(submitted, enrolled);
  return (
    <div className={cn("min-w-28", className)}>
      <p className="body-sm-medium text-primary-500 tabular-nums">
        {submitted} / {enrolled}
      </p>
      <div
        className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden"
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
