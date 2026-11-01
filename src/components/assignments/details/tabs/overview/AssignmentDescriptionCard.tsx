"use client";

import React from "react";
import { FileText, Pencil } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { LearningObjectivesBox } from "./LearningObjectivesBox";

export interface AssignmentDescriptionCardProps {
  descriptionHtml: string;
  objectives: string[];
  onEdit: () => void;
}

/** Description HTML + Learning Objectives; "Edit" jumps to the Instructions tab. */
export function AssignmentDescriptionCard({ descriptionHtml, objectives, onEdit }: AssignmentDescriptionCardProps) {
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
      <RichTextContent html={descriptionHtml} />
      {objectives.length > 0 && <LearningObjectivesBox objectives={objectives} />}
    </IconSectionCard>
  );
}

export default AssignmentDescriptionCard;
