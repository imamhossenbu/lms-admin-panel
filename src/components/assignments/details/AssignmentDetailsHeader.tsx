"use client";

import React from "react";
import { ArrowLeft, Eye, Pencil } from "lucide-react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { assignmentLocation } from "./assignmentFormat";
import { AssignmentMoreMenu } from "./AssignmentMoreMenu";
import { DeleteAssignmentModal } from "./sidebar/DeleteAssignmentModal";
import { useAssignmentActions } from "./hooks/useAssignmentActions";

export interface AssignmentDetailsHeaderProps {
  assignment: AssignmentItem;
  submissions: AssignmentSubmission[];
  context: LessonEditorContext;
  onBack: () => void;
  onPreview: () => void;
  onEdit: () => void;
  onAssignmentChange: (next: AssignmentItem) => void;
}

/** Breadcrumb, title + status badge, module/lesson subtitle and the page actions. */
export function AssignmentDetailsHeader({ assignment, submissions, context, onBack, onPreview, onEdit, onAssignmentChange }: AssignmentDetailsHeaderProps) {
  const act = useAssignmentActions(assignment, submissions);
  const { moduleLabel, lessonLabel } = assignmentLocation(assignment, context);
  const isPublished = assignment.status === "PUBLISHED";

  const togglePublish = async () => {
    const updated = await act.togglePublish();
    if (updated) onAssignmentChange(updated);
  };

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: context.course.title, href: `/courses/${assignment.courseId}` },
          { label: "Assignments", href: "/assignments" },
          { label: "Assignment Details" },
        ]}
      />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold text-primary-500">{assignment.title}</h1>
            <ToneBadge tone={isPublished ? "green" : "gray"} size="lg" dot>
              {isPublished ? "Published" : "Draft"}
            </ToneBadge>
          </div>
          {(moduleLabel || lessonLabel) && (
            <p className="mt-1.5 flex flex-wrap items-center gap-2 body-regular text-primary-300">
              {moduleLabel && <span>{moduleLabel}</span>}
              {moduleLabel && lessonLabel && <span aria-hidden>•</span>}
              {lessonLabel && <span>{lessonLabel}</span>}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SecondaryButton leftIcon={<ArrowLeft />} onClick={onBack}>
            Back to Assignments
          </SecondaryButton>
          <SecondaryButton leftIcon={<Eye />} onClick={onPreview}>
            View as Student
          </SecondaryButton>
          <AssignmentMoreMenu
            status={assignment.status}
            disabled={act.busy !== null}
            onEdit={onEdit}
            onDuplicate={() => void act.duplicate()}
            onTogglePublish={() => void togglePublish()}
            onDelete={act.openDelete}
          />
          <PrimaryButton leftIcon={<Pencil />} onClick={onEdit}>
            Edit Assignment
          </PrimaryButton>
        </div>
      </div>

      <DeleteAssignmentModal
        isOpen={act.isDeleteOpen}
        title={assignment.title}
        submissionCount={submissions.length}
        onClose={act.closeDelete}
        onConfirm={act.confirmDelete}
      />
    </div>
  );
}

export default AssignmentDetailsHeader;
