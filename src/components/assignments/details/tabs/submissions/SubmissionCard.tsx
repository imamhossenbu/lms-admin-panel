"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AssignmentSubmission } from "@/types/assignment";
import { timeAgo } from "@/lib/assignmentStats";
import { formatDuration } from "../../assignmentFormat";
import { StudentCell } from "./StudentCell";
import { SubmissionStatusBadges } from "./SubmissionStatusBadges";
import { SubmissionRowActions } from "./SubmissionRowActions";

export interface SubmissionCardProps {
  submission: AssignmentSubmission;
  totalPoints: number;
  onView: () => void;
  onGrade: () => void;
  onDownload: () => void;
}

/** Grid-view card for one submission. */
export function SubmissionCard({ submission: s, totalPoints, onView, onGrade, onDownload }: SubmissionCardProps) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="space-y-3 rounded-xl border border-dash bg-white p-4">
      <StudentCell student={s.student} />
      <SubmissionStatusBadges submission={s} />
      <dl className="grid grid-cols-3 gap-2 body-xsm-regular">
        <div>
          <dt className="text-primary-300">Submitted</dt>
          <dd className="body-sm-medium text-primary-500">{timeAgo(s.submittedAt)}</dd>
        </div>
        <div>
          <dt className="text-primary-300">Score</dt>
          <dd className="body-sm-medium text-primary-500">{s.score === null ? "-" : `${s.score} / ${totalPoints}`}</dd>
        </div>
        <div>
          <dt className="text-primary-300">Time</dt>
          <dd className="body-sm-medium text-primary-500">{formatDuration(s.timeTakenMinutes)}</dd>
        </div>
      </dl>
      <div className="border-t border-dash pt-3">
        <SubmissionRowActions onView={onView} onGrade={onGrade} onDownload={onDownload} canDownload={Boolean(s.fileName)} />
      </div>
    </motion.div>
  );
}

export default SubmissionCard;
