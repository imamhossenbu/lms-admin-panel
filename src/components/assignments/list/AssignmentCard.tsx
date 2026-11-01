"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarClock } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { dueLabel } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";
import { ASSIGNMENT_STATUS_VIEW, ASSIGNMENT_TYPE_VIEW, formatDueDate } from "./assignmentListUtils";
import { SubmissionsProgress } from "./AssignmentCells";
import { AssignmentRowActions, type AssignmentRowHandlers } from "./AssignmentRowActions";
import type { AssignmentRow } from "./AssignmentsTable";

export interface AssignmentCardProps {
  row: AssignmentRow;
  handlers: AssignmentRowHandlers;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

/** Grid-view card with the same data and actions as a table row. */
export function AssignmentCard({ row, handlers, selected, onSelect }: AssignmentCardProps) {
  const { assignment: a } = row;
  const due = dueLabel(a);
  return (
    <motion.article
      whileHover={{ y: -2 }}
      onClick={() => handlers.onView(a)}
      className={cn(
        "dashboard-card shadow-2xs p-4 flex flex-col gap-3.5 cursor-pointer hover:shadow-md transition-shadow",
        selected && "ring-2 ring-brand-orange"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            aria-label={`Select ${a.title}`}
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-dash"
          />
          <ToneBadge tone={ASSIGNMENT_TYPE_VIEW[a.type].tone}>{ASSIGNMENT_TYPE_VIEW[a.type].label}</ToneBadge>
        </div>
        <ToneBadge tone={ASSIGNMENT_STATUS_VIEW[a.status].tone} dot>
          {ASSIGNMENT_STATUS_VIEW[a.status].label}
        </ToneBadge>
      </div>

      <div className="min-w-0">
        <h3 className="body-medium font-semibold! text-primary-500 truncate" title={a.title}>
          {row.number}. {a.title}
        </h3>
        {row.courseLabel && (
          <p className="mt-1 flex items-center gap-1.5 body-sm-medium text-primary-500 min-w-0" title={row.courseLabel}>
            <BookOpen className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="truncate">{row.courseLabel}</span>
          </p>
        )}
        <p className="mt-1 body-sm-regular text-primary-400 truncate">{row.moduleLabel}</p>
        <p className="body-sm-regular text-primary-300 truncate">{row.lessonLabel ?? "No lesson linked"}</p>
      </div>

      <div className="flex items-center gap-2 body-sm-regular text-primary-400">
        <CalendarClock className="w-4 h-4 text-primary-300 shrink-0" />
        <span className="text-primary-500">{formatDueDate(a)}</span>
        <span aria-hidden>•</span>
        <span className={due.tone === "red" ? "text-red" : "text-primary-300"}>{due.text}</span>
      </div>

      <SubmissionsProgress submitted={row.submitted} enrolled={a.enrolledCount} />

      <div className="pt-3 border-t border-dash flex justify-end" onClick={(e) => e.stopPropagation()}>
        <AssignmentRowActions assignment={a} handlers={handlers} />
      </div>
    </motion.article>
  );
}

export default AssignmentCard;
