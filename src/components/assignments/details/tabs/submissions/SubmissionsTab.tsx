"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { AssignmentTabProps } from "../../tabTypes";
import { AssignmentTabLayout } from "../../AssignmentTabLayout";
import { AssignmentStatCards } from "../../AssignmentStatCards";
import { AssignmentDetailsCard } from "../../sidebar/AssignmentDetailsCard";
import { AssignmentQuickActions } from "../../sidebar/AssignmentQuickActions";
import { SubmissionsListCard } from "./SubmissionsListCard";
import { SubmissionStatusBarsCard } from "./SubmissionStatusBarsCard";

/** Submissions: stats, filterable table with view/grade modals; details, actions and status bars sidebar. */
export function SubmissionsTab({ assignment, submissions, onSubmissionsChange, onTabChange }: AssignmentTabProps) {
  const router = useRouter();
  return (
    <AssignmentTabLayout
      main={
        <>
          <AssignmentStatCards submissions={submissions} />
          <SubmissionsListCard assignment={assignment} submissions={submissions} onSubmissionsChange={onSubmissionsChange} />
        </>
      }
      sidebar={
        <>
          <AssignmentDetailsCard assignment={assignment} onEdit={() => router.push(`/assignments/${assignment.id}/edit`)} />
          <AssignmentQuickActions
            assignment={assignment}
            submissions={submissions}
            actions={["viewInstructions", "downloadSubmissions", "remind", "edit", "duplicate", "delete"]}
            onTabChange={onTabChange}
          />
          <SubmissionStatusBarsCard submissions={submissions} />
        </>
      }
    />
  );
}

export default SubmissionsTab;
