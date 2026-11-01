"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TagsInput } from "@/components/ui/TagsInput";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { ACCEPTED_ANSWERS_MAX } from "./questionKinds";

export interface AcceptedAnswersFieldProps {
  questionIndex: number;
  revalidate: () => void;
}

/** Short Answer: chips of accepted answers (case-insensitive match). */
export function AcceptedAnswersField({ questionIndex: qi, revalidate }: AcceptedAnswersFieldProps) {
  const { control, formState } = useFormContext<QuizWizardValues>();
  const err = formState.errors.questions?.[qi]?.acceptedAnswers;
  const message = err?.message ?? err?.root?.message ?? (Array.isArray(err) ? err.find(Boolean)?.message : undefined);
  const id = `question-${qi}-accepted`;

  return (
    <div>
      <label htmlFor={id} className="body-sm-medium text-primary-500">
        Accepted Answers <span className="text-red">*</span>
      </label>
      <p className="mt-0.5 mb-3 body-xsm-regular text-primary-300">
        Press Enter to add each answer students may type. Matching ignores letter case.
      </p>
      <Controller
        control={control}
        name={`questions.${qi}.acceptedAnswers`}
        render={({ field }) => (
          <TagsInput
            id={id}
            value={field.value ?? []}
            onChange={(tags) => {
              field.onChange(tags);
              revalidate();
            }}
            maxTags={ACCEPTED_ANSWERS_MAX}
            maxLength={200}
            placeholder="e.g. Hyper Text Markup Language"
            error={message}
          />
        )}
      />
    </div>
  );
}

export default AcceptedAnswersField;
