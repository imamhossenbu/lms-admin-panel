"use client";

import React from "react";
import { Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { ControlledSelectField } from "./ControlledSelectField";
import { ATTEMPT_SELECT_OPTIONS, toNullableNumber } from "./quizDisplay";

/** Right "Time & Attempts": optional time limit (empty = none) and allowed attempts. */
export function TimeAttemptsCard({ disabled }: { disabled?: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<LessonEditorValues>();
  const timeError = errors.quiz?.timeLimitMinutes?.message;

  return (
    <IconSectionCard icon={<Clock className="h-5 w-5" />} title="Time & Attempts" description="Limit how long and how often students can take the quiz." bodyClassName="space-y-5">
      <div>
        <FieldLabel htmlFor="quiz-time-limit" label="Time Limit" optional />
        <InputField
          id="quiz-time-limit"
          type="number"
          inputMode="numeric"
          min={1}
          max={300}
          step={1}
          placeholder="No limit"
          readOnly={disabled}
          className="pr-20!"
          rightElement={<span className="body-sm-regular text-primary-300">Minutes</span>}
          error={timeError}
          {...register("quiz.timeLimitMinutes", { setValueAs: toNullableNumber })}
        />
        {!timeError && <p className="mt-1.5 body-xsm-regular text-primary-300">Leave empty for no time limit.</p>}
      </div>
      <ControlledSelectField
        name="quiz.attempts"
        label="Allowed Attempts"
        options={ATTEMPT_SELECT_OPTIONS}
        disabled={disabled}
        helper="Number of times a student can attempt this quiz."
      />
    </IconSectionCard>
  );
}

export default TimeAttemptsCard;
