"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { UserCog } from "lucide-react";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { ToggleBox } from "../submission/kit/ToggleBox";

/** "Allow Manual Override" toggle box. */
export function ManualOverrideBox() {
  const { control } = useFormContext<AssignmentWizardValues>();
  return (
    <Controller
      control={control}
      name="manualOverride"
      render={({ field }) => (
        <ToggleBox
          icon={<UserCog className="h-5 w-5" />}
          title="Allow Manual Override"
          description="Allow instructors to review and adjust AI suggested grades."
          checked={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}

export default ManualOverrideBox;
