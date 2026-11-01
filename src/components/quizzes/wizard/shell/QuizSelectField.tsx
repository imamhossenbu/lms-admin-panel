"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { selectErrorClass } from "../quizWizardOptions";
import { QuizField } from "./QuizField";

type StringField = "courseId" | "moduleId" | "difficulty" | "maxAttempts" | "access";

export interface QuizSelectFieldProps {
  name: StringField;
  label: string;
  options: AppSelectOption[];
  placeholder?: string;
  required?: boolean;
  helper?: string;
  disabled?: boolean;
  /** Runs after the value changed (e.g. reset the module when the course changes). */
  onAfterChange?: (value: string) => void;
}

/** Labelled AppSelect bound to a wizard field, with helper / error below. */
export function QuizSelectField({ name, label, options, placeholder, required, helper, disabled, onAfterChange }: QuizSelectFieldProps) {
  const { control } = useFormContext<QuizWizardValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <QuizField label={label} required={required} error={fieldState.error?.message} helper={helper}>
          <AppSelect
            value={String(field.value ?? "")}
            onValueChange={(v) => {
              if (v === field.value) return;
              field.onChange(v);
              field.onBlur();
              onAfterChange?.(v);
            }}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth
            triggerClassName={["h-11", selectErrorClass(fieldState.error?.message)].filter(Boolean).join(" ")}
          />
        </QuizField>
      )}
    />
  );
}

export default QuizSelectField;
