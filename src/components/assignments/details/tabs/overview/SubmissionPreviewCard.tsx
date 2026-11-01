"use client";

import React from "react";
import { Eye } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { CodePreviewIllustration } from "./CodePreviewIllustration";

/** Illustrates what a submission looks like; "View Instructions" switches tab. */
export function SubmissionPreviewCard({ onViewInstructions }: { onViewInstructions: () => void }) {
  return (
    <IconSectionCard
      icon={<Eye className="h-5 w-5" />}
      title="Submission Preview"
      action={<CardHeaderButton onClick={onViewInstructions}>View Instructions</CardHeaderButton>}
      className="h-full"
    >
      <CodePreviewIllustration />
    </IconSectionCard>
  );
}

export default SubmissionPreviewCard;
