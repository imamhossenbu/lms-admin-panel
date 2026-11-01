"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { AssignmentTabProps } from "../../tabTypes";
import { AssignmentTabLayout } from "../../AssignmentTabLayout";
import { AssignmentStatCards } from "../../AssignmentStatCards";
import { AssignmentDetailsCard } from "../../sidebar/AssignmentDetailsCard";
import { AssignmentQuickActions } from "../../sidebar/AssignmentQuickActions";
import { AssignmentDescriptionCard } from "./AssignmentDescriptionCard";
import { SubmissionPreviewCard } from "./SubmissionPreviewCard";
import { SubmissionStatisticsCard } from "./SubmissionStatisticsCard";
import { GradeDistributionCard } from "./GradeDistributionCard";
import { RecentActivityCard } from "./RecentActivityCard";

export interface OverviewTabProps extends AssignmentTabProps {
  onPreview?: () => void;
}

/** Overview: stats, description + preview, submission stats + grade distribution; details/actions/activity sidebar. */
export function OverviewTab({ assignment, submissions, onTabChange, onPreview }: OverviewTabProps) {
  const router = useRouter();
  return (
    <AssignmentTabLayout
      main={
        <>
          <AssignmentStatCards submissions={submissions} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <AssignmentDescriptionCard
              assignment={assignment}
              objectives={assignment.instructions.objectives}
              onEdit={() => router.push(`/assignments/${assignment.id}/edit?step=basic`)}
            />
            <SubmissionPreviewCard onViewInstructions={() => onTabChange("instructions")} />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SubmissionStatisticsCard submissions={submissions} />
            <GradeDistributionCard submissions={submissions} totalPoints={assignment.totalPoints} />
          </div>
        </>
      }
      sidebar={
        <>
          <AssignmentDetailsCard assignment={assignment} onEdit={() => router.push(`/assignments/${assignment.id}/edit`)} />
          <AssignmentQuickActions
            assignment={assignment}
            submissions={submissions}
            actions={["preview", "downloadSubmissions", "remind", "duplicate", "delete"]}
            onTabChange={onTabChange}
            onPreview={onPreview}
          />
          <RecentActivityCard submissions={submissions} onViewAll={() => onTabChange("submissions")} />
        </>
      }
    />
  );
}

export default OverviewTab;
