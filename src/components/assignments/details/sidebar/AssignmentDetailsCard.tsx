"use client";

import React from "react";
import { CalendarCheck, CalendarDays, Eye, FileText, Gauge, Hash, Pencil, Repeat, Target, Timer } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { dueLabel } from "@/lib/assignmentStats";
import { lateSubmissionSummary } from "@/lib/assignmentWizardMapping";
import { ASSIGNMENT_TYPE_LABEL, GRADING_TYPE_LABEL, attemptsLabel, formatDueDate, formatDueTime, passingScoreLabel } from "../assignmentFormat";
import { DetailRow } from "./DetailRow";
import { CardHeaderButton } from "./CardHeaderButton";

export interface AssignmentDetailsCardProps {
  assignment: AssignmentItem;
  onEdit?: () => void;
}

/** "Oct 20, 2026 · 9:00 AM" (time omitted when empty). */
const dateTime = (date: string, time: string) => (time ? `${formatDueDate(date)} · ${formatDueTime(time)}` : formatDueDate(date));

/** Right-column summary: type, release / due (+ days-left pill), points, passing score, attempts, late policy, grading, visibility. */
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
        <DetailRow icon={CalendarCheck} label="Release Date">
          {assignment.releaseDate ? dateTime(assignment.releaseDate, assignment.releaseTime) : "Immediately"}
        </DetailRow>
        <DetailRow icon={CalendarDays} label="Due Date">
          <span>{dateTime(assignment.dueDate, assignment.dueTime)}</span>
          <ToneBadge tone={due.text.startsWith("Overdue") ? "red" : "green"} size="sm">
            {due.text}
          </ToneBadge>
        </DetailRow>
        <DetailRow icon={Hash} label="Total Points">
          {assignment.totalPoints}
        </DetailRow>
        <DetailRow icon={Target} label="Passing Score">
          {passingScoreLabel(assignment)}
        </DetailRow>
        <DetailRow icon={Repeat} label="Submission Attempts">
          {attemptsLabel(assignment.attempts)}
        </DetailRow>
        <DetailRow icon={Timer} label="Late Submission">
          {lateSubmissionSummary(assignment)}
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
