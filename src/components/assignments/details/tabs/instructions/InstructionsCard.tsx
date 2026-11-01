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

export interface InstructionsCardProps {
  assignment: AssignmentItem;
  onEdit: () => void;
}

/** "Assignment Instructions" read view: overview, objectives, task steps, requirements, file types, grading notes. */
export function InstructionsCard({ assignment, onEdit }: InstructionsCardProps) {
  const ins = assignment.instructions;
  const isEmpty = !ins.overview.trim() && ins.tasks.length === 0 && ins.objectives.length === 0;

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Assignment Instructions"
      description="Provide clear instructions and guidelines for students."
      action={
        <SecondaryButton size="sm" leftIcon={<Pencil />} onClick={onEdit} className="text-blue!">
          {isEmpty ? "Add Instructions" : "Edit Instructions"}
        </SecondaryButton>
      }
    >
      {isEmpty ? (
        <InstructionsEmptyState onAdd={onEdit} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-6 rounded-xl border border-dash p-4 sm:p-5">
            <InstructionBlock icon={<FileText className="h-5 w-5 text-blue" />} title="Overview">
              <p className="whitespace-pre-line body-sm-regular text-primary-400">{ins.overview || "No overview yet."}</p>
            </InstructionBlock>
            <InstructionBlock icon={<Target className="h-5 w-5 text-blue" />} title="Learning Objectives" tinted>
              <BulletList items={ins.objectives} empty="No learning objectives added yet." />
            </InstructionBlock>
            <InstructionBlock icon={<CheckSquare className="h-5 w-5 text-green" />} title="Your Task">
              <TaskSteps steps={ins.tasks} />
            </InstructionBlock>
            <InstructionBlock icon={<Upload className="h-5 w-5 text-blue" />} title="Submission Requirements" tinted>
              <BulletList items={ins.requirements} empty="No submission requirements added yet." />
            </InstructionBlock>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AllowedFileTypesCard types={ins.allowedFileTypes} maxSizeMb={ins.maxFileSizeMb} />
            <GradingNotesCard notes={ins.gradingNotes} totalPoints={assignment.totalPoints} />
          </div>
        </div>
      )}
    </IconSectionCard>
  );
}

export default InstructionsCard;
