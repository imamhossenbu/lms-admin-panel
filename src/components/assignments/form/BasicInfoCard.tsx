"use client";

import React, { useMemo } from "react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { EditorFieldLabel } from "@/components/courses/lesson-editor/fields/FieldLabel";
import { FieldError } from "@/components/courses/lesson-editor/fields/FieldError";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { ASSIGNMENT_DESCRIPTION_MAX, ASSIGNMENT_TITLE_MAX, type AssignmentFormValues } from "@/validations/assignmentSchema";
import { NO_LESSON, TYPE_OPTIONS, plainTextLength } from "./assignmentFormConfig";
import { AssignmentSelectField } from "./AssignmentSelectField";

export interface BasicInfoCardProps {
  form: UseFormReturn<AssignmentFormValues>;
  context: LessonEditorContext;
}

/** Title, Description, Module, Lesson (filtered by module) and Assignment Type. */
export function BasicInfoCard({ form, context }: BasicInfoCardProps) {
  const { register, control, setValue, formState } = form;
  const { errors } = formState;
  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "descriptionHtml" }) ?? "";
  const moduleId = useWatch({ control, name: "moduleId" });

  const moduleOptions = useMemo(() => context.modules.map((m) => ({ value: m.id, label: `Module ${m.order}: ${m.title}` })), [context.modules]);
  const lessonOptions = useMemo(
    () => [
      { value: NO_LESSON, label: "No specific lesson" },
      ...context.lessons.filter((l) => l.moduleId === moduleId).map((l) => ({ value: l.id, label: `Lesson ${l.order}: ${l.title}` })),
    ],
    [context.lessons, moduleId]
  );

  return (
    <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Basic Information" description="Set the main details for this assignment.">
      <div className="space-y-5">
        <div>
          <InputField
            id="assignment-title"
            label="Title"
            required
            placeholder="e.g. Build a Simple HTML Page"
            maxLength={ASSIGNMENT_TITLE_MAX + 20}
            error={errors.title?.message}
            {...register("title")}
          />
          <CharCounter count={title.length} max={ASSIGNMENT_TITLE_MAX} className="mt-1" />
        </div>

        <div>
          <EditorFieldLabel required>Description</EditorFieldLabel>
          <Controller
            control={control}
            name="descriptionHtml"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={(html) => field.onChange(html)}
                placeholder="Describe what students need to build or answer..."
                minHeight="140px"
              />
            )}
          />
          <div className="flex items-start justify-between gap-3">
            <FieldError message={errors.descriptionHtml?.message} />
            <CharCounter count={plainTextLength(description)} max={ASSIGNMENT_DESCRIPTION_MAX} className="mt-1 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="moduleId"
            render={({ field }) => (
              <AssignmentSelectField
                label="Module"
                required
                value={field.value}
                placeholder="Select a module"
                options={moduleOptions}
                error={errors.moduleId?.message}
                onChange={(next) => {
                  field.onChange(next);
                  // A lesson from another module no longer applies.
                  setValue("lessonId", "", { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="lessonId"
            render={({ field }) => (
              <AssignmentSelectField
                label="Lesson (Optional)"
                value={field.value || NO_LESSON}
                options={lessonOptions}
                disabled={!moduleId}
                error={errors.lessonId?.message}
                onChange={(next) => field.onChange(next === NO_LESSON ? "" : next)}
              />
            )}
          />
        </div>

        <div>
          <EditorFieldLabel required>Assignment Type</EditorFieldLabel>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ChoiceCardGroup name="assignment-type" aria-label="Assignment type" columns={2} value={field.value} onChange={field.onChange} options={TYPE_OPTIONS} />
            )}
          />
          <FieldError message={errors.type?.message} />
        </div>
      </div>
    </IconSectionCard>
  );
}

export default BasicInfoCard;
