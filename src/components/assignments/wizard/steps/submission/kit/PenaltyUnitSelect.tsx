"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppSelect } from "@/components/ui/AppSelect";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { PENALTY_UNIT_OPTIONS } from "./penalty";

/** "% / points" select bound to latePenaltyUnit (shared by steps 3 and 6). */
export function PenaltyUnitSelect({ className }: { className?: string }) {
  const { control } = useFormContext<AssignmentWizardValues>();
  return (
    <Controller
      control={control}
      name="latePenaltyUnit"
      render={({ field }) => (
        <AppSelect
          value={field.value}
          onValueChange={(v) => field.onChange(v as AssignmentWizardValues["latePenaltyUnit"])}
          options={PENALTY_UNIT_OPTIONS}
          className={className}
          fullWidth
        />
      )}
    />
  );
}

export default PenaltyUnitSelect;
