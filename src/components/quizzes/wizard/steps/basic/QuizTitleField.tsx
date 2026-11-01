"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { QUIZ_TITLE_MAX, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizField } from "../../shell/QuizField";

/** "Quiz Title *" input with helper and x/120 counter. */
export function QuizTitleField() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizWizardValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const error = errors.title?.message;
  return (
    <QuizField
      label="Quiz Title"
      htmlFor="quiz-title"
      required
      error={error}
      helper="Give a clear and descriptive title for your quiz."
      aside={<CharCounter count={title.length} max={QUIZ_TITLE_MAX} className="shrink-0" />}
    >
      <InputField id="quiz-title" placeholder="e.g. HTML Basics Quiz" aria-invalid={!!error} className={error ? "h-11 border-red! bg-red-14!" : "h-11"} {...register("title")} />
    </QuizField>
  );
}

export default QuizTitleField;
