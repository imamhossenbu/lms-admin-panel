"use client";

import React from "react";
import { Clock, FileText, Gauge, Pencil, Tag } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { DIFFICULTY_LABEL, estimatedTimeLabel } from "../../assignmentFormat";
import { LearningObjectivesBox } from "./LearningObjectivesBox";

export interface AssignmentDescriptionCardProps {
  assignment: Pick<AssignmentItem, "descriptionHtml" | "category" | "difficulty" | "estimatedTime" | "estimatedUnit">;
  objectives: string[];
  /** Opens the wizard on the "Basic Info" step. */
  onEdit: () => void;
}

/** Description HTML + category / difficulty / estimated-time chips + Learning Objectives. */
export function AssignmentDescriptionCard({ assignment, objectives, onEdit }: AssignmentDescriptionCardProps) {
  const estimate = estimatedTimeLabel(assignment);
  const hasChips = !!assignment.category || !!assignment.difficulty || !!estimate;

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Assignment Description"
      action={
        <CardHeaderButton onClick={onEdit} icon={<Pencil className="h-3.5 w-3.5" />}>
          Edit
        </CardHeaderButton>
      }
      className="h-full"
      bodyClassName="space-y-4"
    >
      {hasChips && (
        <div className="flex flex-wrap items-center gap-2">
          {assignment.category && (
            <ToneBadge tone="purple" size="sm" icon={<Tag className="h-3 w-3" />}>
              {assignment.category}
            </ToneBadge>
          )}
          {assignment.difficulty && (
            <ToneBadge tone="blue" size="sm" icon={<Gauge className="h-3 w-3" />}>
              {DIFFICULTY_LABEL[assignment.difficulty]}
            </ToneBadge>
          )}
          {estimate && (
            <ToneBadge tone="gray" size="sm" icon={<Clock className="h-3 w-3" />}>
              {estimate}
            </ToneBadge>
          )}
        </div>
      )}
      <RichTextContent html={assignment.descriptionHtml} />
      {objectives.length > 0 && <LearningObjectivesBox objectives={objectives} />}
    </IconSectionCard>
  );
}

export default AssignmentDescriptionCard;
