"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import type { AssignmentSubmission } from "@/types/assignment";
import { SubmissionCard } from "./SubmissionCard";

export interface SubmissionsGridProps {
  rows: AssignmentSubmission[];
  totalPoints: number;
  onView: (s: AssignmentSubmission) => void;
  onGrade: (s: AssignmentSubmission) => void;
  onDownload: (s: AssignmentSubmission) => void;
}

/** Grid view of submissions (same actions as the table). */
export function SubmissionsGrid({ rows, totalPoints, onView, onGrade, onDownload }: SubmissionsGridProps) {
  if (rows.length === 0) return <p className="rounded-xl border border-dash py-8 text-center body-sm-regular text-primary-300">No submissions match your filters.</p>;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {rows.map((s) => (
          <SubmissionCard key={s.id} submission={s} totalPoints={totalPoints} onView={() => onView(s)} onGrade={() => onGrade(s)} onDownload={() => onDownload(s)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default SubmissionsGrid;
