"use client";

import React from "react";
import { CalendarDays, Clock, Eye, FileText, Gauge, Hash, Pencil, Repeat, Timer } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { dueLabel } from "@/lib/assignmentStats";
import { ASSIGNMENT_TYPE_LABEL, GRADING_TYPE_LABEL, LATE_POLICY_LABEL, attemptsLabel, formatDueDate, formatDueTime } from "../assignmentFormat";
import { DetailRow } from "./DetailRow";
import { CardHeaderButton } from "./CardHeaderButton";

export interface AssignmentDetailsCardProps {
  assignment: AssignmentItem;
  onEdit?: () => void;
}

/** Right-column summary: type, due date/time (+ days-left pill), points, attempts, late policy, grading, visibility. */
export function AssignmentDetailsCard({ assignment, onEdit }: AssignmentDetailsCardProps) {
  const due = dueLabel(assignment);
  const isPublished = assignment.status === "PUBLISHED";

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Assignment Details"
      action={
        onEdit && (
          <CardHeaderButton onClick={onEdit} icon={<Pencil className="h-3.5 w-3.5" />}>
            Edit
          </CardHeaderButton>
        )
      }
      bodyClassName="mt-3"
    >
      <dl className="divide-y divide-dash">
        <DetailRow icon={FileText} label="Type">
          <ToneBadge tone="blue">{ASSIGNMENT_TYPE_LABEL[assignment.type]}</ToneBadge>
        </DetailRow>
        <DetailRow icon={CalendarDays} label="Due Date">
          <CalendarDays className="h-4 w-4 text-primary-400" />
          {formatDueDate(assignment.dueDate)}
        </DetailRow>
        <DetailRow icon={Clock} label="Due Time">
          <Clock className="h-4 w-4 text-primary-400" />
          {formatDueTime(assignment.dueTime)}
          <ToneBadge tone={due.text.startsWith("Overdue") ? "red" : "green"} size="sm" className="ml-auto">
            {due.text}
          </ToneBadge>
        </DetailRow>
        <DetailRow icon={Hash} label="Total Points">
          {assignment.totalPoints}
        </DetailRow>
        <DetailRow icon={Repeat} label="Submission Attempts">
          {attemptsLabel(assignment.attempts)}
        </DetailRow>
        <DetailRow icon={Timer} label="Late Submission">
          {LATE_POLICY_LABEL[assignment.lateSubmission]}
        </DetailRow>
        <DetailRow icon={Gauge} label="Grading Type">
          {GRADING_TYPE_LABEL[assignment.gradingType]}
        </DetailRow>
        <DetailRow icon={Eye} label="Visibility">
          <ToneBadge tone={isPublished ? "green" : "gray"} dot>
            {isPublished ? "Published" : "Draft"}
          </ToneBadge>
        </DetailRow>
      </dl>
    </IconSectionCard>
  );
}

export default AssignmentDetailsCard;
