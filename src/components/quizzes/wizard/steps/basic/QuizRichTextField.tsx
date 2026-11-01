"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { cn } from "@/lib/cn";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { quizPlainText } from "../../quizWizardFormat";
import { QuizField } from "../../shell/QuizField";

export interface QuizRichTextFieldProps {
  name: "descriptionHtml" | "instructionsHtml";
  label: string;
  max: number;
  helper: string;
  placeholder: string;
  required?: boolean;
  optional?: boolean;
}

/** Rich-text editor bound to a wizard field with helper text and a live x/max (plain text) counter. */
export function QuizRichTextField({ name, label, max, helper, placeholder, required, optional }: QuizRichTextFieldProps) {
  const { control } = useFormContext<QuizWizardValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <QuizField
          label={label}
          required={required}
          optional={optional}
          error={fieldState.error?.message}
          helper={helper}
          aside={<CharCounter count={quizPlainText(field.value).length} max={max} className="shrink-0" />}
        >
          <div onBlur={field.onBlur} className={cn("rounded-lg", fieldState.error && "ring-1 ring-red")}>
            <RichTextEditor value={field.value} onChange={field.onChange} placeholder={placeholder} minHeight="120px" />
          </div>
        </QuizField>
      )}
    />
  );
}

export default QuizRichTextField;
