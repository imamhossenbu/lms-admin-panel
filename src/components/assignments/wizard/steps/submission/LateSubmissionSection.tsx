"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Clock } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { SubSectionHeader } from "./kit/SubSectionHeader";
import { Collapse } from "./kit/Collapse";
import { LatePenaltyRow } from "./LatePenaltyRow";

type LatePolicy = AssignmentWizardValues["lateSubmission"];

const OPTIONS: ChoiceOption<LatePolicy>[] = [
  { value: "ALLOW", title: "Allowed", description: "Students can submit after due date (marked as late)" },
  { value: "DISALLOW", title: "Not Allowed", description: "Students cannot submit after due date" },
  { value: "ALLOW_WITH_PENALTY", title: "Allow with Deduction", description: "Students can submit but points will be deducted" },
];

/** "Late Submission" policy cards + penalty row when "Allow with Deduction". */
export function LateSubmissionSection() {
  const { control, getValues, setValue } = useFormContext<AssignmentWizardValues>();
  const policy = useWatch({ control, name: "lateSubmission" });

  const choose = (next: LatePolicy, onChange: (v: LatePolicy) => void) => {
    onChange(next);
    // Start the deduction at a sensible value instead of 0 (schema requires > 0).
    if (next === "ALLOW_WITH_PENALTY" && !(getValues("latePenalty") > 0)) setValue("latePenalty", 10, { shouldDirty: true });
  };

  return (
    <section>
      <SubSectionHeader icon={<Clock className="h-5 w-5" />} title="Late Submission" description="Control whether students can submit after the due date." />
      <Controller
        control={control}
        name="lateSubmission"
        render={({ field }) => (
          <ChoiceCardGroup
            name="late-submission"
            aria-label="Late Submission"
            value={field.value}
            onChange={(v) => choose(v, field.onChange)}
            options={OPTIONS}
            columns={3}
            tone="blue"
          />
        )}
      />
      <Collapse open={policy === "ALLOW_WITH_PENALTY"} className="pt-3">
        <LatePenaltyRow />
      </Collapse>
    </section>
  );
}

export default LateSubmissionSection;
