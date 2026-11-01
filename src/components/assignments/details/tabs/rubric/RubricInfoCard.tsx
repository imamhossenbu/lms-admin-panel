"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { RUBRIC_DESCRIPTION_MAX, type RubricFormValues } from "@/validations/assignmentSchema";

/** "Rubric Information": Enable Rubric toggle, title, total points, description. */
export function RubricInfoCard() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RubricFormValues>();
  const description = useWatch({ control, name: "description" }) ?? "";
  const enabled = useWatch({ control, name: "enabled" });

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Rubric Information"
      description="Create and manage the grading rubric for this assignment."
      action={
        <Controller
          control={control}
          name="enabled"
          render={({ field }) => (
            <SettingToggleRow
              title="Enable Rubric"
              description="Use this rubric for grading submissions."
              checked={field.value}
              onChange={field.onChange}
              className="max-w-60"
            />
          )}
        />
      }
    >
      <fieldset disabled={!enabled} className="space-y-4 disabled:opacity-60">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <InputField
            id="rubric-title"
            label="Rubric Title"
            required
            placeholder="e.g. HTML Page Grading Rubric"
            containerClassName="md:col-span-3"
            error={errors.title?.message}
            {...register("title")}
          />
          <InputField
            id="rubric-total"
            label="Total Points"
            required
            type="number"
            min={1}
            className="no-spinner"
            containerClassName="md:col-span-2"
            error={errors.totalPoints?.message}
            {...register("totalPoints", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label htmlFor="rubric-description" className="mb-2 block body-sm-regular text-primary-400">
            Description (Optional)
          </label>
          <TextAreaField
            id="rubric-description"
            rows={3}
            placeholder="Explain how this rubric will be used to evaluate submissions."
            error={errors.description?.message}
            {...register("description")}
          />
          <CharCounter count={description.length} max={RUBRIC_DESCRIPTION_MAX} className="mt-1" />
        </div>
      </fieldset>
    </IconSectionCard>
  );
}

export default RubricInfoCard;
