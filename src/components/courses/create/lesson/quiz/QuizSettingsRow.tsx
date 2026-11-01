"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Clock, Target } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { FieldLabel } from "../../basic/FieldLabel";

/** Time limit (minutes) + passing score (%) inputs bound to `quiz.timeLimitMinutes` / `quiz.passingScore`. */
export function QuizSettingsRow() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LessonFormValues>();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel htmlFor="quiz-time-limit" label="Time Limit" required />
        <InputField
          id="quiz-time-limit"
          type="number"
          inputMode="numeric"
          min={1}
          max={300}
          step={1}
          leftElement={<Clock className="h-4 w-4" />}
          rightElement={<span className="body-sm-regular text-primary-300">min</span>}
          aria-invalid={!!errors.quiz?.timeLimitMinutes}
          error={errors.quiz?.timeLimitMinutes?.message}
          {...register("quiz.timeLimitMinutes", { valueAsNumber: true })}
        />
      </div>
      <div>
        <FieldLabel htmlFor="quiz-passing-score" label="Passing Score" required />
        <InputField
          id="quiz-passing-score"
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          step={1}
          leftElement={<Target className="h-4 w-4" />}
          rightElement={<span className="body-sm-regular text-primary-300">%</span>}
          aria-invalid={!!errors.quiz?.passingScore}
          error={errors.quiz?.passingScore?.message}
          {...register("quiz.passingScore", { valueAsNumber: true })}
        />
      </div>
    </div>
  );
}

export default QuizSettingsRow;
