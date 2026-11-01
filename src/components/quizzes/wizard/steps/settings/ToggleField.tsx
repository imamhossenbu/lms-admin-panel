"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";

type BoolField = "showCorrectAnswers" | "showExplanation" | "randomizeQuestions" | "randomizeOptions" | "requirePreviousLessons" | "showImmediately";

/** Orange SettingToggleRow bound to a boolean wizard field. */
export function ToggleField({ name, title, description }: { name: BoolField; title: string; description: string }) {
  const { control } = useFormContext<QuizWizardValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SettingToggleRow
          title={title}
          description={description}
          checked={!!field.value}
          onChange={(checked) => {
            field.onChange(checked);
            field.onBlur();
          }}
        />
      )}
    />
  );
}

export default ToggleField;
