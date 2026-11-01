import React from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import type { AssignmentSubmission } from "@/types/assignment";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** Graded (green) / Pending (orange) + a red "Late" badge when submitted after the deadline. */
export function SubmissionStatusBadges({ submission }: { submission: Pick<AssignmentSubmission, "status" | "isLate"> }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {submission.status === "GRADED" ? (
        <ToneBadge tone="green" icon={<CircleCheck className="h-3 w-3" />}>
          Graded
        </ToneBadge>
      ) : (
        <ToneBadge tone="orange" icon={<CircleAlert className="h-3 w-3" />}>
          Pending
        </ToneBadge>
      )}
      {submission.isLate && <ToneBadge tone="red">Late</ToneBadge>}
    </span>
  );
}

export default SubmissionStatusBadges;
