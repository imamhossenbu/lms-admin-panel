"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

/** "Grade Display to Students" cards (exact score vs. grade only). */
export function GradeDisplayField() {
  const { control } = useFormContext<AssignmentWizardValues>();
  const total = useWatch({ control, name: "totalPoints" });
  const t = Number.isFinite(total) && total > 0 ? total : 32;
  const sample = Math.round(t * 0.875);

  return (
    <WizardField label="Grade Display to Students">
      <Controller
        control={control}
        name="gradeDisplay"
        render={({ field }) => (
          <ChoiceCardGroup
            name="grade-display"
            aria-label="Grade Display to Students"
            value={field.value}
            onChange={field.onChange}
            columns={2}
            tone="blue"
            options={[
              { value: "EXACT", title: "Show Exact Score", description: `Students will see their exact score (e.g. ${sample}/${t})` },
              { value: "GRADE_ONLY", title: "Show Grade Only", description: "Students will see grade only (e.g. Pass/Fail or A, B, C)" },
            ]}
          />
        )}
      />
    </WizardField>
  );
}

export default GradeDisplayField;
