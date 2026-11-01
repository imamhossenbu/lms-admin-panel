"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { getAssignmentsSnapshot } from "@/lib/assignmentStorage";
import type { AssignmentItem } from "@/types/assignment";

export interface CopyRubricModalProps {
  isOpen: boolean;
  courseId: string;
  onClose: () => void;
  onPick: (assignment: AssignmentItem) => void;
}

/** Lists the course's other assignments that have rubric criteria; picking one copies its rubric. */
export function CopyRubricModal({ isOpen, courseId, onClose, onPick }: CopyRubricModalProps) {
  const assignments = useMemo(
    () => (isOpen ? getAssignmentsSnapshot(courseId).filter((a) => a.rubric.criteria.length > 0) : []),
    [isOpen, courseId]
  );

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Copy Rubric" subtitle="Copy the rubric of another assignment in this course." maxWidth="md">
      {assignments.length === 0 ? (
        <p className="py-6 text-center body-sm-regular text-primary-300">No other assignments with a rubric yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {assignments.map((a, i) => (
            <motion.li key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: Math.min(i, 10) * 0.03 }}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                onClick={() => onPick(a)}
                className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-dash bg-white p-3.5 text-left transition-colors hover:border-blue hover:bg-blue-14"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
                  <ListChecks className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate body-sm-medium font-semibold! text-primary-500">{a.rubric.title || a.title}</span>
                  <span className="mt-0.5 block truncate body-xsm-regular text-primary-300">{a.title}</span>
                  <span className="mt-1 block truncate body-xsm-regular text-primary-400">{a.rubric.criteria.map((c) => c.title).join(" · ")}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <ToneBadge tone="blue" size="sm">
                    {a.rubric.criteria.length} criteria
                  </ToneBadge>
                  <ToneBadge tone="gray" size="sm">
                    {a.rubric.criteria.reduce((s, c) => s + c.points, 0)} pts
                  </ToneBadge>
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}

export default CopyRubricModal;
