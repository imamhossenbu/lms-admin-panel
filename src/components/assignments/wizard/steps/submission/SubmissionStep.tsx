"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { AssignmentPreviewCard } from "../../preview/AssignmentPreviewCard";
import { TipsCard } from "../../shell/TipsCard";
import { Collapse } from "./kit/Collapse";
import { SubmissionTypeField } from "./SubmissionTypeField";
import { FileUploadOptions } from "./FileUploadOptions";
import { LateSubmissionSection } from "./LateSubmissionSection";
import { AttemptsSection } from "./AttemptsSection";
import { SubmissionRequirementsCard } from "./SubmissionRequirementsCard";

const TIPS = [
  "Choose the most suitable submission type for your assignment.",
  "Set clear file type and size limits.",
  "Allow multiple attempts if you want students to improve their work.",
  "Consider late submission policy based on your course requirements.",
  "Communicate the submission rules clearly in the instructions.",
];

/** Wizard step 3 — Submission Settings. */
export function SubmissionStep({ context, footer }: WizardStepProps) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const type = useWatch({ control, name: "type" });

  return (
    <WizardLayout
      main={
        <IconSectionCard
          icon={<FileText className="h-5 w-5" />}
          title="Submission Settings"
          description="Configure how students will submit their work and set submission rules."
          bodyClassName="mt-5 space-y-6"
        >
          <SubmissionTypeField />
          <Collapse open={type === "FILE_UPLOAD"}>
            <FileUploadOptions />
          </Collapse>
          <div className="border-t border-dash pt-5">
            <LateSubmissionSection />
          </div>
          <div className="border-t border-dash pt-5">
            <AttemptsSection />
          </div>
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <AssignmentPreviewCard context={context} badge="live" />
          <SubmissionRequirementsCard />
          <TipsCard title="Tips for Submission Settings" tips={TIPS} />
        </>
      }
    />
  );
}

export default SubmissionStep;
