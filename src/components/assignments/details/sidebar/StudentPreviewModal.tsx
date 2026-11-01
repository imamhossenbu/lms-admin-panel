"use client";

import React from "react";
import { CalendarDays, Clock, Hash } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import { ModalShell } from "@/components/ui/ModalShell";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { dueLabel } from "@/lib/assignmentStats";
import { ASSIGNMENT_TYPE_LABEL, formatDueDate, formatDueTime } from "../assignmentFormat";
import { PreviewSection } from "./preview/PreviewSection";
import { PreviewList } from "./preview/PreviewList";
import { PreviewAttachments } from "./preview/PreviewAttachments";
import { PreviewRubric } from "./preview/PreviewRubric";

export interface StudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentItem;
}

/** "View as Student": the assignment exactly as a learner sees it (read-only). */
export function StudentPreviewModal({ isOpen, onClose, assignment }: StudentPreviewModalProps) {
  const due = dueLabel(assignment);
  const { instructions, rubric } = assignment;
  const showRubric = assignment.showRubric && rubric.enabled && rubric.visibleToStudents && rubric.criteria.length > 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Student View"
      subtitle="This is how students see this assignment."
      maxWidth="xl"
      footer={<SecondaryButton onClick={onClose}>Close Preview</SecondaryButton>}
    >
      <div className="space-y-6">
        <header className="space-y-3 rounded-2xl border border-dash bg-gray-bg p-5">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone="blue">{ASSIGNMENT_TYPE_LABEL[assignment.type]}</ToneBadge>
            <ToneBadge tone={due.tone === "red" ? "red" : "green"}>{due.text}</ToneBadge>
          </div>
          <h2 className="heading-h4 font-bold! text-primary-500">{assignment.title}</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 body-sm-regular text-primary-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Due {formatDueDate(assignment.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatDueTime(assignment.dueTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hash className="h-4 w-4" /> {assignment.totalPoints} points
            </span>
          </div>
        </header>

        <PreviewSection title="Description">
          <RichTextContent html={assignment.descriptionHtml} />
        </PreviewSection>

        {instructions.overview && (
          <PreviewSection title="Instructions">
            <p className="body-sm-regular text-primary-400">{instructions.overview}</p>
          </PreviewSection>
        )}
        {instructions.objectives.length > 0 && (
          <PreviewSection title="Learning Objectives">
            <PreviewList items={instructions.objectives} />
          </PreviewSection>
        )}
        {instructions.tasks.length > 0 && (
          <PreviewSection title="Tasks">
            <PreviewList items={instructions.tasks} ordered />
          </PreviewSection>
        )}
        {instructions.requirements.length > 0 && (
          <PreviewSection title="Requirements">
            <PreviewList items={instructions.requirements} />
          </PreviewSection>
        )}
        {assignment.type === "FILE_UPLOAD" && (
          <PreviewSection title="Submission Format">
            <div className="flex flex-wrap items-center gap-2">
              {instructions.allowedFileTypes.map((t) => (
                <ToneBadge key={t} tone="gray" size="sm">
                  {t}
                </ToneBadge>
              ))}
              <span className="body-xsm-regular text-primary-300">Max {instructions.maxFileSizeMb} MB</span>
            </div>
          </PreviewSection>
        )}
        {assignment.attachments.length > 0 && (
          <PreviewSection title="Resources">
            <PreviewAttachments attachments={assignment.attachments} />
          </PreviewSection>
        )}
        {showRubric && (
          <PreviewSection title={`${rubric.title} (${rubric.totalPoints} pts)`}>
            <PreviewRubric rubric={rubric} />
          </PreviewSection>
        )}
      </div>
    </ModalShell>
  );
}

export default StudentPreviewModal;
