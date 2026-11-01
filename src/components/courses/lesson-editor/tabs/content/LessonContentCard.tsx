"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CalendarCheck } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { EditorFieldLabel } from "../../fields/FieldLabel";
import { CharCounter } from "@/components/ui/CharCounter";
import { EDITOR_SHORT_DESCRIPTION_MAX, EDITOR_TITLE_MAX, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { LessonMetaFields } from "./LessonMetaFields";
import { LessonBodyField } from "./LessonBodyField";

export interface LessonContentCardProps {
  context: LessonEditorContext;
}

/** "Lesson Content" card: title, short description, module/type/duration and the rich-text body. */
export function LessonContentCard({ context }: LessonContentCardProps) {
  const { register, control, formState: { errors } } = useFormContext<LessonEditorValues>();
  const [title, shortDescription] = useWatch({ control, name: ["content.title", "content.shortDescription"] });

  return (
    <IconSectionCard
      icon={<CalendarCheck className="h-5 w-5" />}
      title="Lesson Content"
      description="Add the basic information for this lesson."
      tone="blue"
      bodyClassName="space-y-5"
    >
      <div>
        <EditorFieldLabel htmlFor="lesson-title" required>Lesson Title</EditorFieldLabel>
        <InputField
          id="lesson-title"
          placeholder="e.g. Introduction to HTML"
          maxLength={EDITOR_TITLE_MAX + 20}
          error={errors.content?.title?.message}
          {...register("content.title")}
        />
        <CharCounter count={title?.length ?? 0} max={EDITOR_TITLE_MAX} className="mt-1" />
      </div>

      <div>
        <EditorFieldLabel htmlFor="lesson-short-description">Short Description</EditorFieldLabel>
        <TextAreaField
          id="lesson-short-description"
          rows={3}
          placeholder="Summarise what students will learn in this lesson."
          error={errors.content?.shortDescription?.message}
          {...register("content.shortDescription")}
        />
        <CharCounter count={shortDescription?.length ?? 0} max={EDITOR_SHORT_DESCRIPTION_MAX} className="mt-1" />
      </div>

      <LessonMetaFields context={context} />
      <LessonBodyField />
    </IconSectionCard>
  );
}

export default LessonContentCard;
