"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChartNoAxesColumnIncreasing, Link2 } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { LESSON_DIFFICULTIES, type LessonFormValues } from "@/validations/lessonFormSchema";
import { FieldError, FieldLabel } from "../../basic/FieldLabel";
import { LESSON_DIFFICULTY_LABEL } from "../lessonDisplay";

/** Radix Select items cannot use "" as a value, so "no prerequisite" uses a sentinel. */
const NONE = "__none__";

const DIFFICULTY_OPTIONS = LESSON_DIFFICULTIES.map((value) => ({ value, label: LESSON_DIFFICULTY_LABEL[value] }));

export function LessonDifficultyField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LessonFormValues>();
  return (
    <div>
      <FieldLabel label="Lesson Difficulty" />
      <Controller
        control={control}
        name="difficulty"
        render={({ field }) => (
          <AppSelect
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            options={DIFFICULTY_OPTIONS}
            icon={<ChartNoAxesColumnIncreasing className="h-4 w-4" />}
            fullWidth
          />
        )}
      />
      <FieldError message={errors.difficulty?.message} />
    </div>
  );
}

export interface LessonPrerequisiteFieldProps {
  options: { value: string; label: string }[];
}

export function LessonPrerequisiteField({ options }: LessonPrerequisiteFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LessonFormValues>();
  const allOptions = [{ value: NONE, label: "None" }, ...options];
  return (
    <div>
      <FieldLabel label="Prerequisite Lesson" optional />
      <Controller
        control={control}
        name="prerequisiteLessonId"
        render={({ field }) => (
          <AppSelect
            value={field.value && options.some((o) => o.value === field.value) ? field.value : NONE}
            onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
            options={allOptions}
            icon={<Link2 className="h-4 w-4" />}
            fullWidth
            triggerClassName="[&>div]:min-w-0"
          />
        )}
      />
      <FieldError message={errors.prerequisiteLessonId?.message} />
    </div>
  );
}
