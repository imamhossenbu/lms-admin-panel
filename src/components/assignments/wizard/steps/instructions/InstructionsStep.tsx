"use client";

import React from "react";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { TipsCard } from "../../shell/TipsCard";
import { DetailedInstructionsField } from "./DetailedInstructionsField";
import { InstructionsLivePreview } from "./InstructionsLivePreview";
import { AttachmentsResourcesCard } from "./AttachmentsResourcesCard";

const TIPS = [
  "Be clear and specific about what students need to do",
  "Use bullet points or numbered lists",
  "Include examples or reference materials",
  "Mention file formats and naming conventions",
  "Explain how the assignment will be graded",
];

/** Step 2 — Instructions & Description. */
export function InstructionsStep({ context, mode, footer, onUploadingChange }: WizardStepProps) {
  return (
    <WizardLayout
      main={
        <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Instructions & Description" description="Provide clear instructions and guidelines for students.">
          <DetailedInstructionsField prefill={mode === "create"} />
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <InstructionsLivePreview context={context} />
          <AttachmentsResourcesCard onUploadingChange={onUploadingChange} />
          <TipsCard title="Tips for Writing Good Instructions" tips={TIPS} />
        </>
      }
    />
  );
}

export default InstructionsStep;
