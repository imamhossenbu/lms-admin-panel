"use client";

import React from "react";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { TipsCard } from "../../shell/TipsCard";
import { AssignmentPreviewCard } from "../../preview/AssignmentPreviewCard";
import { BasicTitleField } from "./BasicTitleField";
import { ShortDescriptionField } from "./ShortDescriptionField";
import { CourseModuleFields } from "./CourseModuleFields";
import { TypeCategoryFields } from "./TypeCategoryFields";
import { DifficultyTimeFields } from "./DifficultyTimeFields";
import { NeedHelpCard } from "./NeedHelpCard";

const TIPS = [
  "Use a clear and specific title",
  "Write a short and concise description",
  "Choose the right module and assignment type",
  "Set an appropriate difficulty level",
  "Give clear instructions in the next step",
];

/** Step 1 — Basic Information. */
export function BasicInfoStep({ context, footer }: WizardStepProps) {
  return (
    <WizardLayout
      main={
        <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Basic Information" description="Set the essential details for your assignment.">
          <div className="space-y-5">
            <BasicTitleField />
            <ShortDescriptionField />
            <CourseModuleFields context={context} />
            <TypeCategoryFields />
            <DifficultyTimeFields />
          </div>
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <AssignmentPreviewCard context={context} badge="live" />
          <TipsCard title="Tips for a Good Assignment" tips={TIPS} />
          <NeedHelpCard />
        </>
      }
    />
  );
}

export default BasicInfoStep;
