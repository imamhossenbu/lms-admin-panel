"use client";

import React from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { cn } from "@/lib/cn";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { CharCounter } from "@/components/ui/CharCounter";
import { QUIZ_DESCRIPTION_MAX, QUIZ_KIND_OPTIONS, QUIZ_TITLE_MAX } from "./quizDisplay";

/** Title, description, quiz type and passing score (body of "Quiz Settings"). */
export function QuizDetailsFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<LessonEditorValues>();
  const { field: kindField } = useController({ control, name: "quiz.kind" });
  const [title, description] = useWatch({ control, name: ["quiz.title", "quiz.description"] });
  const isPractice = kindField.value === "PRACTICE";

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="quiz-title" label="Quiz Title" required />
        <InputField
          id="quiz-title"
          maxLength={QUIZ_TITLE_MAX}
          placeholder="e.g. Check Your Understanding: HTML Basics"
          error={errors.quiz?.title?.message}
          {...register("quiz.title")}
        />
        <CharCounter className="mt-1" count={title?.length ?? 0} max={QUIZ_TITLE_MAX} />
      </div>

      <div>
        <FieldLabel htmlFor="quiz-description" label="Quiz Description" />
        <TextAreaField
          id="quiz-description"
          rows={3}
          maxLength={QUIZ_DESCRIPTION_MAX}
          placeholder="Tell students what this quiz covers..."
          error={errors.quiz?.description?.message}
          {...register("quiz.description")}
        />
        <CharCounter className="mt-1" count={description?.length ?? 0} max={QUIZ_DESCRIPTION_MAX} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <FieldLabel label="Quiz Type" />
          <ChoiceCardGroup
            name="quiz-kind"
            aria-label="Quiz type"
            columns={2}
            value={kindField.value}
            onChange={kindField.onChange}
            options={QUIZ_KIND_OPTIONS}
          />
        </div>
        <div>
          <FieldLabel htmlFor="quiz-passing-score" label="Passing Score" required={!isPractice} />
          <InputField
            id="quiz-passing-score"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            step={1}
            // readOnly (not disabled) so react-hook-form keeps the value while practice mode is on.
            readOnly={isPractice}
            aria-disabled={isPractice}
            className={cn(isPractice && "cursor-not-allowed bg-gray-bg opacity-60")}
            rightElement={<span className="body-sm-regular text-primary-300">%</span>}
            error={isPractice ? undefined : errors.quiz?.passingScore?.message}
            {...register("quiz.passingScore", { valueAsNumber: true })}
          />
          <p className="mt-1.5 body-xsm-regular text-primary-300">
            {isPractice ? "Practice quizzes are not scored." : "Minimum percentage to pass the quiz."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuizDetailsFields;
