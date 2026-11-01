"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { EDITOR_CONTENT_MAX, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorFieldLabel } from "../../fields/FieldLabel";
import { CharCounter } from "@/components/ui/CharCounter";
import { FieldError } from "../../fields/FieldError";

/** Plain-text length of rich-text HTML (same rule as the schema). */
export const plainTextLength = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

/** "Lesson Content (Text)" rich-text editor with a 0/5000 counter. */
export function LessonBodyField() {
  const { control, formState: { errors } } = useFormContext<LessonEditorValues>();

  return (
    <div>
      <EditorFieldLabel>Lesson Content (Text)</EditorFieldLabel>
      <Controller
        control={control}
        name="content.body"
        render={({ field }) => (
          <>
            <RichTextEditor
              value={field.value}
              onChange={(html) => field.onChange(html === "<p></p>" ? "" : html)}
              placeholder="Write the lesson text, notes or instructions..."
              minHeight="160px"
            />
            <CharCounter count={plainTextLength(field.value ?? "")} max={EDITOR_CONTENT_MAX} className="mt-1" />
          </>
        )}
      />
      <FieldError message={errors.content?.body?.message} />
    </div>
  );
}

export default LessonBodyField;
