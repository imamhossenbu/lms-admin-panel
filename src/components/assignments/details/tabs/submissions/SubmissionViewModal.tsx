"use client";

import React from "react";
import { CalendarDays, FileText, Pencil, Timer } from "lucide-react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatDateTime, formatDuration } from "../../assignmentFormat";
import { PreviewSection } from "../../sidebar/preview/PreviewSection";
import { StudentInitialsAvatar } from "./StudentInitialsAvatar";
import { SubmissionStatusBadges } from "./SubmissionStatusBadges";
import { CriterionScoreList } from "./CriterionScoreList";

export interface SubmissionViewModalProps {
  submission: AssignmentSubmission | null;
  assignment: AssignmentItem;
  onClose: () => void;
  onGrade: (s: AssignmentSubmission) => void;
}

/** Read-only submission: student, file / text answer, rubric scores and feedback. */
export function SubmissionViewModal({ submission: s, assignment, onClose, onGrade }: SubmissionViewModalProps) {
  if (!s) return null;
  const hasRubricScores = assignment.rubric.enabled && Object.keys(s.criterionScores).length > 0;

  return (
    <ModalShell
      isOpen={Boolean(s)}
      onClose={onClose}
      title="Submission Details"
      subtitle={assignment.title}
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          <PrimaryButton leftIcon={<Pencil />} onClick={() => onGrade(s)}>
            {s.status === "GRADED" ? "Update Grade" : "Grade Submission"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <StudentInitialsAvatar name={s.student.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="body-medium font-semibold! text-primary-500">{s.student.name}</p>
            <p className="body-sm-regular text-primary-300">
              {s.student.email} · {s.student.group}
            </p>
          </div>
          <SubmissionStatusBadges submission={s} />
        </div>

        <dl className="grid grid-cols-1 gap-3 rounded-xl border border-dash bg-gray-bg p-4 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 body-xsm-regular text-primary-300">
              <CalendarDays className="h-3.5 w-3.5" /> Submitted
            </dt>
            <dd className="body-sm-medium text-primary-500">{formatDateTime(s.submittedAt)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 body-xsm-regular text-primary-300">
              <Timer className="h-3.5 w-3.5" /> Time Taken
            </dt>
            <dd className="body-sm-medium text-primary-500">{formatDuration(s.timeTakenMinutes)}</dd>
          </div>
          <div>
            <dt className="body-xsm-regular text-primary-300">Score</dt>
            <dd className="body-sm-medium text-primary-500">{s.score === null ? "Not graded yet" : `${s.score} / ${assignment.totalPoints}`}</dd>
          </div>
        </dl>

        <PreviewSection title="Submission">
          {s.fileName ? (
            <div className="flex items-center gap-3 rounded-xl border border-dash p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-14 text-blue">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 truncate body-sm-medium text-primary-500">{s.fileName}</span>
              <ToneBadge tone="gray" size="sm">
                {s.fileName.split(".").pop()?.toUpperCase() ?? "FILE"}
              </ToneBadge>
            </div>
          ) : null}
          {s.textAnswer ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-primary-500 p-4 body-xsm-regular text-white">{s.textAnswer}</pre>
          ) : null}
          {!s.fileName && !s.textAnswer && <p className="body-sm-regular text-primary-300">No content was submitted.</p>}
        </PreviewSection>

        {hasRubricScores && (
          <PreviewSection title="Rubric Scores">
            <CriterionScoreList criteria={assignment.rubric.criteria} scores={s.criterionScores} />
          </PreviewSection>
        )}

        <PreviewSection title="Feedback">
          <p className="body-sm-regular text-primary-400">{s.feedback || "No feedback yet."}</p>
        </PreviewSection>
      </div>
    </ModalShell>
  );
}

export default SubmissionViewModal;
