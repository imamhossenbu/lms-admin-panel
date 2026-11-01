"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import type { AiLessonType } from "../../aiOutline";
import { LessonTypeIcon } from "../../outline/LessonTypeIcon";
import { FieldError, FieldLabel } from "../../basic/FieldLabel";

const TYPE_COPY: { value: AiLessonType; title: string; description: string }[] = [
  { value: "VIDEO", title: "Video Lesson", description: "Upload or embed a video" },
  { value: "TEXT", title: "Text Lesson", description: "Write content with rich text editor" },
  { value: "CODING", title: "Coding Lesson", description: "Add code examples and playground" },
  { value: "QUIZ", title: "Quiz Lesson", description: "Create a quiz for this lesson" },
  { value: "ASSIGNMENT", title: "Assignment", description: "Give an assignment to students" },
];

const LIVE_OPTION = { value: "LIVE" as const, title: "Live Class", description: "Schedule a live session" };

const toOption = (o: { value: AiLessonType; title: string; description: string }, selected: boolean): ChoiceOption<AiLessonType> => ({
  ...o,
  icon: <LessonTypeIcon type={o.value} className={selected ? "bg-brand-orange text-white" : undefined} />,
});

/** Five selectable lesson-type cards (Live Class only shows for lessons that already use it). */
export function LessonTypePicker() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LessonFormValues>();

  return (
    <div>
      <FieldLabel label="Lesson Type" required />
      <Controller
        control={control}
        name="type"
        render={({ field }) => {
          const copy = field.value === "LIVE" ? [...TYPE_COPY, LIVE_OPTION] : TYPE_COPY;
          return (
            <ChoiceCardGroup<AiLessonType>
              name={field.name}
              aria-label="Lesson type"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                field.onBlur();
              }}
              options={copy.map((o) => toOption(o, o.value === field.value))}
              columns={5}
            />
          );
        }}
      />
      <FieldError message={errors.type?.message} />
    </div>
  );
}

export default LessonTypePicker;
