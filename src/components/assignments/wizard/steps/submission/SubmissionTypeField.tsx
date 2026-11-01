"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FileText, FileUp, Link2 } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

type SubmissionType = AssignmentWizardValues["type"];

const icon = (Icon: typeof FileUp) => (
  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-14 text-blue">
    <Icon className="h-4.5 w-4.5" />
  </span>
);

const OPTIONS: ChoiceOption<SubmissionType>[] = [
  { value: "FILE_UPLOAD", title: "File Upload", description: "Students upload files (doc, pdf, zip, images, etc.)", icon: icon(FileUp) },
  { value: "TEXT", title: "Text Submission", description: "Students write and submit text directly", icon: icon(FileText) },
  { value: "LINK", title: "External Link", description: "Students submit a URL (GitHub, Google Drive, etc.)", icon: icon(Link2) },
];

/** "Submission Type *" cards — writes the shared `type` field (also chosen in step 1). */
export function SubmissionTypeField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  return (
    <WizardField label="Submission Type" required error={errors.type?.message}>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <ChoiceCardGroup
            name="submission-type"
            aria-label="Submission Type"
            value={field.value}
            onChange={field.onChange}
            options={OPTIONS}
            columns={3}
            tone="blue"
          />
        )}
      />
    </WizardField>
  );
}

export default SubmissionTypeField;
