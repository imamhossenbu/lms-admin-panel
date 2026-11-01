"use client";

import React from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { CalendarCheck } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { stepOfField, type AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { buildReviewSections } from "./reviewSummary";
import { ReviewSectionRow } from "./ReviewSectionRow";
import { EditAnySectionMenu } from "./EditAnySectionMenu";
import { ReviewPreviewCard } from "./ReviewPreviewCard";
import { WhatHappensNextCard } from "./WhatHappensNextCard";

/** Step 7 — Review & Create (or Review & Save in edit mode). */
export function ReviewStep({ context, mode, footer, onGoToStep }: WizardStepProps) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const values = useWatch({ control }) as AssignmentWizardValues;
  const { errors } = useFormState({ control });
  const errorSteps = new Set(Object.keys(errors).map((k) => stepOfField(k)));
  const sections = buildReviewSections(values, context);
  const isEdit = mode === "edit";

  return (
    <WizardLayout
      main={
        <IconSectionCard
          icon={<CalendarCheck className="h-5 w-5" />}
          title={isEdit ? "Review & Save" : "Review & Create"}
          description={isEdit ? "Review all the details before saving your changes." : "Review all the details before creating the assignment."}
          action={<EditAnySectionMenu sections={sections} onGoToStep={onGoToStep} />}
        >
          <ol className="space-y-3">
            {sections.map((section, i) => (
              <ReviewSectionRow key={section.step} index={i} section={section} hasError={errorSteps.has(section.step)} onEdit={() => onGoToStep(section.step)} />
            ))}
          </ol>
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <ReviewPreviewCard context={context} />
          <WhatHappensNextCard mode={mode} />
        </>
      }
    />
  );
}

export default ReviewStep;
