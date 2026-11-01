"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { ContentSectionHeader } from "./ContentSectionHeader";

/** "Lesson Content" section — the shared rich-text editor (its footer shows the live word count). */
export function LessonRichContent({ required }: { required?: boolean }) {
  const { control, formState } = useFormContext<LessonFormValues>();
  const error = formState.errors.content?.message;

  return (
    <section>
      <ContentSectionHeader
        title="Lesson Content"
        description="Add written content, code examples, images, and more to support your video lesson."
      />
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <RichTextEditor
            value={field.value}
            onChange={field.onChange}
            required={required}
            minHeight="260px"
            placeholder="Write the lesson content: explanations, code examples, key takeaways..."
          />
        )}
      />
      <FieldError message={error} />
    </section>
  );
}

export default LessonRichContent;
