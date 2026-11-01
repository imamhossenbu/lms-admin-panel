"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, Clock, ShieldCheck } from "lucide-react";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { EditorFieldLabel } from "../../fields/FieldLabel";

type Status = LessonEditorValues["content"]["status"];
type Visibility = LessonEditorValues["content"]["visibility"];

const STATUS_OPTIONS: { value: Status; title: string }[] = [
  { value: "PUBLISHED", title: "Published" },
  { value: "DRAFT", title: "Draft" },
  { value: "SCHEDULED", title: "Scheduled" },
];

const VISIBILITY_OPTIONS: { value: Visibility; title: string; description: string }[] = [
  { value: "PUBLIC", title: "Public", description: "Visible to all enrolled students" },
  { value: "PRIVATE", title: "Private", description: "Only specific students" },
];

/** "Publish & Status": status + visibility radios and the publish date/time (required when Scheduled). */
export function PublishStatusCard() {
  const { control, register, trigger, formState: { errors } } = useFormContext<LessonEditorValues>();
  const status = useWatch({ control, name: "content.status" });
  const isScheduled = status === "SCHEDULED";

  return (
    <IconSectionCard
      icon={<ShieldCheck className="h-5 w-5" />}
      title="Publish & Status"
      description="Control the visibility and status of this lesson."
      tone="green"
      bodyClassName="space-y-5"
    >
      <div>
        <EditorFieldLabel>Status</EditorFieldLabel>
        <Controller
          control={control}
          name="content.status"
          render={({ field }) => (
            <ChoiceCardGroup
              name="lesson-status"
              aria-label="Lesson status"
              variant="inline"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                // Re-check the date rule when switching in/out of Scheduled.
                void trigger("content.publishDate");
              }}
              options={STATUS_OPTIONS}
              className="gap-x-8"
            />
          )}
        />
      </div>

      <div>
        <EditorFieldLabel>Visibility</EditorFieldLabel>
        <Controller
          control={control}
          name="content.visibility"
          render={({ field }) => (
            <ChoiceCardGroup name="lesson-visibility" aria-label="Lesson visibility" columns={2} value={field.value} onChange={field.onChange} options={VISIBILITY_OPTIONS} />
          )}
        />
      </div>

      <div>
        <EditorFieldLabel htmlFor="lesson-publish-date" required={isScheduled}>Publish Date</EditorFieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField
            id="lesson-publish-date"
            type="date"
            leftElement={<CalendarDays className="h-4 w-4" />}
            error={errors.content?.publishDate?.message}
            {...register("content.publishDate", { onChange: () => isScheduled && trigger("content.publishDate") })}
          />
          <InputField
            id="lesson-publish-time"
            type="time"
            aria-label="Publish time"
            leftElement={<Clock className="h-4 w-4" />}
            error={errors.content?.publishTime?.message}
            {...register("content.publishTime", { onChange: () => isScheduled && trigger("content.publishDate") })}
          />
        </div>
        {!isScheduled && <p className="mt-1.5 body-xsm-regular text-primary-300">Only required when the lesson is scheduled.</p>}
      </div>
    </IconSectionCard>
  );
}

export default PublishStatusCard;
