"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { questionPlainText } from "./questionKinds";

export interface RichTextFieldWithCounterProps {
  name: `questions.${number}.questionHtml` | `questions.${number}.explanationHtml`;
  label: React.ReactNode;
  max: number;
  placeholder: string;
  minHeight?: string;
  error?: string;
  /** Called after each change (re-validates once the question shows errors). */
  onEdited?: () => void;
}

/** RichTextEditor bound to a question field, with an "x/max" counter and the field error below. */
export function RichTextFieldWithCounter({ name, label, max, placeholder, minHeight = "96px", error, onEdited }: RichTextFieldWithCounterProps) {
  const { control } = useFormContext<QuizWizardValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <p className="mb-2 body-sm-medium text-primary-500">{label}</p>
          <RichTextEditor value={field.value ?? ""} onChange={(html) => {
              field.onChange(html);
              onEdited?.();
            }} placeholder={placeholder} minHeight={minHeight} />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            {error ? <p className="body-xsm-regular text-red">{error}</p> : <span />}
            <CharCounter count={questionPlainText(field.value ?? "").length} max={max} />
          </div>
        </div>
      )}
    />
  );
}

export default RichTextFieldWithCounter;
