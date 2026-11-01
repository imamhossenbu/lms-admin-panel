"use client";

import React from "react";
import { Clock, CircleCheck, CircleX, Users } from "lucide-react";
import type { AssignmentSubmission } from "@/types/assignment";
import { submissionStats } from "@/lib/assignmentStats";
import { AssignmentStatTile } from "./AssignmentStatTile";

export interface AssignmentStatCardsProps {
  submissions: AssignmentSubmission[];
}

/** Total / Graded / Pending Review / Late — rendered by the Overview, Submissions and Analytics tabs. */
export function AssignmentStatCards({ submissions }: AssignmentStatCardsProps) {
  const s = submissionStats(submissions);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AssignmentStatTile index={0} tone="purple" icon={<Users className="h-6 w-6" />} value={s.total} label="Total Submissions" />
      <AssignmentStatTile index={1} tone="green" icon={<CircleCheck className="h-6 w-6" />} value={s.graded} label="Graded" caption={`${s.gradedPct}%`} />
      <AssignmentStatTile index={2} tone="orange" icon={<Clock className="h-6 w-6" />} value={s.pending} label="Pending Review" caption={`${s.pendingPct}%`} />
      <AssignmentStatTile index={3} tone="red" icon={<CircleX className="h-6 w-6" />} value={s.late} label="Late Submissions" caption={`${s.latePct}%`} />
    </div>
  );
}

export default AssignmentStatCards;
