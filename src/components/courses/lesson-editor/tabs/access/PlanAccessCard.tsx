"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Crown } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorOption } from "@/types/lessonEditor";
import { fieldErrorMessage } from "./fieldError";
import { FieldGroupLabel } from "./FieldGroupLabel";
import { MultiSelectChips } from "./MultiSelectChips";
import { SettingToggleRow } from "../../shared/SettingToggleRow";

/** "Subscription & Plan Access": toggle + allowed plans. */
export function PlanAccessCard({ plans }: { plans: LessonEditorOption[] }) {
  const { control, formState } = useFormContext<LessonEditorValues>();
  const enabled = useWatch({ control, name: "access.planRestriction.enabled" });
  const plansError = fieldErrorMessage(formState.errors.access?.planRestriction?.planIds);

  return (
    <EditorSectionCard icon={<Crown className="h-5 w-5" />} title="Subscription & Plan Access" description="Restrict this lesson to specific subscription plans.">
      <Controller
        control={control}
        name="access.planRestriction.enabled"
        render={({ field }) => (
          <SettingToggleRow
            id="access-plan-restriction"
            checked={field.value}
            onChange={field.onChange}
            title="Enable plan restriction"
            description="Only users with selected plans can access this lesson."
          />
        )}
      />
      <FieldGroupLabel htmlFor="access-allowed-plans" className="mt-5">
        Allowed Plans
      </FieldGroupLabel>
      <Controller
        control={control}
        name="access.planRestriction.planIds"
        render={({ field }) => (
          <MultiSelectChips
            id="access-allowed-plans"
            aria-label="Allowed plans"
            options={plans}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select plans..."
            disabled={!enabled}
            error={enabled ? plansError : undefined}
          />
        )}
      />
    </EditorSectionCard>
  );
}

export default PlanAccessCard;
