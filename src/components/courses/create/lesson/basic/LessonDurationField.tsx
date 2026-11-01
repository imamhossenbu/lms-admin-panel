"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Clock } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { LESSON_DURATION_UNITS, type LessonFormValues } from "@/validations/lessonFormSchema";
import { FieldLabel } from "../../basic/FieldLabel";

/** Number input with an inline minutes / hours unit picker. */
export function LessonDurationField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LessonFormValues>();

  return (
    <div>
      <FieldLabel htmlFor="lesson-duration" label="Estimated Duration" required />
      <InputField
        id="lesson-duration"
        type="number"
        inputMode="numeric"
        min={1}
        max={600}
        step={1}
        className="pr-28"
        aria-invalid={!!errors.duration}
        leftElement={<Clock className="h-4 w-4" />}
        rightElement={
          <select
            aria-label="Duration unit"
            className="cursor-pointer bg-transparent body-sm-regular text-primary-500 outline-none"
            {...register("durationUnit")}
          >
            {LESSON_DURATION_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        }
        error={errors.duration?.message ?? errors.durationUnit?.message}
        {...register("duration", { valueAsNumber: true })}
      />
    </div>
  );
}

export default LessonDurationField;
