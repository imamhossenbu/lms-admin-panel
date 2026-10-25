"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  COURSE_DESCRIPTION_MAX,
  COURSE_SHORT_DESCRIPTION_MAX,
  COURSE_TITLE_MAX,
  richTextLength,
  type CourseBasicInfoInput,
} from "@/validations/courseSchema";
import { FieldError, FieldLabel } from "./FieldLabel";

/** Title, short description and rich-text full description, each with a live counter. */
export function CourseTextFields() {
  const { control, register, formState } = useFormContext<CourseBasicInfoInput>();
  const { errors } = formState;
  const [title, shortDescription, description] = useWatch({
    control,
    name: ["title", "shortDescription", "description"],
  });

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="course-title" label="Course Title" required count={title.length} max={COURSE_TITLE_MAX} />
        <InputField
          id="course-title"
          placeholder="e.g. Complete Web Development Bootcamp"
          maxLength={COURSE_TITLE_MAX}
          error={errors.title?.message}
          {...register("title")}
        />
      </div>

      <div>
        <FieldLabel
          htmlFor="course-short-description"
          label="Short Description"
          required
          count={shortDescription.length}
          max={COURSE_SHORT_DESCRIPTION_MAX}
        />
        <TextAreaField
          id="course-short-description"
          rows={3}
          maxLength={COURSE_SHORT_DESCRIPTION_MAX}
          placeholder="A one or two sentence summary students see on the course card."
          error={errors.shortDescription?.message}
          {...register("shortDescription")}
        />
      </div>

      <div>
        <FieldLabel
          label="Full Description"
          required
          count={richTextLength(description)}
          max={COURSE_DESCRIPTION_MAX}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Describe what the course covers, who it is for and what students will build..."
              minHeight="180px"
            />
          )}
        />
        <FieldError message={errors.description?.message} />
      </div>
    </div>
  );
}

export default CourseTextFields;
