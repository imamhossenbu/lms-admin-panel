"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Clock } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { LESSON_TYPES, LESSON_TYPE_LABEL } from "@/components/courses/create/aiOutline";
import { LessonTypeIcon } from "@/components/courses/create/outline/LessonTypeIcon";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { EditorFieldLabel } from "../../fields/FieldLabel";
import { FieldError } from "../../fields/FieldError";

const TYPE_OPTIONS = LESSON_TYPES.map((type) => ({
  value: type,
  label: ["VIDEO", "TEXT", "CODING"].includes(type) ? `${LESSON_TYPE_LABEL[type]} Lesson` : LESSON_TYPE_LABEL[type],
  icon: <LessonTypeIcon type={type} size="sm" />,
}));

/** Module *, Lesson Type and Lesson Duration row of the Lesson Content card. */
export function LessonMetaFields({ context }: { context: LessonEditorContext }) {
  const { control, register, formState: { errors } } = useFormContext<LessonEditorValues>();
  const moduleOptions = context.modules.map((m) => ({ value: m.id, label: `Module ${m.order}: ${m.title}` }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-5">
        <EditorFieldLabel required>Module</EditorFieldLabel>
        <Controller
          control={control}
          name="content.moduleId"
          render={({ field }) => (
            <AppSelect value={field.value} onValueChange={field.onChange} options={moduleOptions} placeholder="Select a module" fullWidth />
          )}
        />
        <FieldError message={errors.content?.moduleId?.message} />
      </div>
      <div className="md:col-span-4">
        <EditorFieldLabel>Lesson Type</EditorFieldLabel>
        <Controller
          control={control}
          name="content.type"
          render={({ field }) => (
            <AppSelect value={field.value} onValueChange={field.onChange} options={TYPE_OPTIONS} placeholder="Select a type" fullWidth />
          )}
        />
        <FieldError message={errors.content?.type?.message} />
      </div>
      <div className="md:col-span-3">
        <EditorFieldLabel htmlFor="lesson-duration">Lesson Duration</EditorFieldLabel>
        <InputField
          id="lesson-duration"
          type="number"
          min={1}
          max={600}
          inputMode="numeric"
          leftElement={<Clock className="h-4 w-4" />}
          rightElement={<span className="body-xsm-regular text-primary-300">min</span>}
          error={errors.content?.durationMinutes?.message}
          {...register("content.durationMinutes", { valueAsNumber: true })}
        />
      </div>
    </div>
  );
}

export default LessonMetaFields;
