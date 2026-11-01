"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Tags } from "lucide-react";
import { TagsInput } from "@/components/ui/TagsInput";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorSectionCard } from "../../shared/EditorSectionCard";

const MAX_TAGS = 10;

/** "Lesson Tags": free-text tags (max 10) used for search and filtering. */
export function LessonTagsCard() {
  const { control, formState: { errors } } = useFormContext<LessonEditorValues>();

  return (
    <EditorSectionCard icon={<Tags className="h-5 w-5" />} title="Lesson Tags" description="Add keywords to help students find this lesson." tone="purple">
      <Controller
        control={control}
        name="settings.tags"
        render={({ field }) => (
          <>
            <TagsInput
              id="lesson-tags"
              value={field.value}
              onChange={field.onChange}
              maxTags={MAX_TAGS}
              placeholder={field.value.length >= MAX_TAGS ? "Tag limit reached" : "Type a tag and press Enter"}
              error={errors.settings?.tags?.message}
              renderTag={(tag) => <ToneBadge tone="purple" size="sm">{tag}</ToneBadge>}
            />
            <p className="mt-1.5 text-right body-xsm-regular text-primary-300">
              {field.value.length}/{MAX_TAGS} tags
            </p>
          </>
        )}
      />
    </EditorSectionCard>
  );
}

export default LessonTagsCard;
