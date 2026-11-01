"use client";

import React from "react";
import { CheckSquare, FileText, Pencil, Target, Upload } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { AssignmentItem } from "@/types/assignment";
import { InstructionBlock } from "./InstructionBlock";
import { BulletList } from "./BulletList";
import { TaskSteps } from "./TaskSteps";
import { AllowedFileTypesCard } from "./AllowedFileTypesCard";
import { GradingNotesCard } from "./GradingNotesCard";
import { InstructionsEmptyState } from "./InstructionsEmptyState";
import { InstructionsHtml, hasInstructionsHtml } from "./InstructionsHtml";

export interface InstructionsCardProps {
  assignment: AssignmentItem;
  onEdit: () => void;
}

/**
 * "Assignment Instructions" read view. The wizard's rich-text instructions are the main content when present;
 * otherwise falls back to the structured overview / task steps / requirements. Learning objectives, file
 * rules and grading notes always come from structured data.
 */
export function InstructionsCard({ assignment, onEdit }: InstructionsCardProps) {
  const ins = assignment.instructions;
  const hasHtml = hasInstructionsHtml(assignment.instructionsHtml);
  const isEmpty = !hasHtml && !ins.overview.trim() && ins.tasks.length === 0 && ins.objectives.length === 0;

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Assignment Instructions"
      description="Provide clear instructions and guidelines for students."
      action={
        <SecondaryButton size="sm" leftIcon={<Pencil />} onClick={onEdit}>
          {isEmpty ? "Add Instructions" : "Edit Instructions"}
        </SecondaryButton>
      }
    >
      {isEmpty ? (
        <InstructionsEmptyState onAdd={onEdit} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-6 rounded-xl border border-dash p-4 sm:p-5">
            {hasHtml ? (
              <InstructionsHtml html={assignment.instructionsHtml} />
            ) : (
              <InstructionBlock icon={<FileText className="h-5 w-5 text-blue" />} title="Overview">
                <p className="whitespace-pre-line body-sm-regular text-primary-400">{ins.overview || "No overview yet."}</p>
              </InstructionBlock>
            )}
            {(!hasHtml || ins.objectives.length > 0) && (
              <InstructionBlock icon={<Target className="h-5 w-5 text-blue" />} title="Learning Objectives" tinted>
                <BulletList items={ins.objectives} empty="No learning objectives added yet." />
              </InstructionBlock>
            )}
            {!hasHtml && (
              <>
                <InstructionBlock icon={<CheckSquare className="h-5 w-5 text-green" />} title="Your Task">
                  <TaskSteps steps={ins.tasks} />
                </InstructionBlock>
                <InstructionBlock icon={<Upload className="h-5 w-5 text-blue" />} title="Submission Requirements" tinted>
                  <BulletList items={ins.requirements} empty="No submission requirements added yet." />
                </InstructionBlock>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AllowedFileTypesCard
              types={ins.allowedFileTypes}
              maxSizeMb={ins.maxFileSizeMb}
              maxFiles={assignment.maxFiles}
              applicable={assignment.type === "FILE_UPLOAD"}
            />
            <GradingNotesCard notes={ins.gradingNotes} totalPoints={assignment.totalPoints} />
          </div>
        </div>
      )}
    </IconSectionCard>
  );
}

export default InstructionsCard;
