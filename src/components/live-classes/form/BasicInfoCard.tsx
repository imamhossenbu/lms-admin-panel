"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { LIVE_DESCRIPTION_MAX, LIVE_TITLE_MAX, type LiveClassFormValues } from "@/validations/liveClassSchema";
import { FormSelectField } from "./FormSelectField";
import { COURSE_OPTIONS, INSTRUCTOR_OPTIONS, TYPE_OPTIONS } from "./liveFormUtils";

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

/** Class Title, Course, Instructor, Class Type, Description (rich text, x/1000) and Seats. */
export function BasicInfoCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LiveClassFormValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "descriptionHtml" }) ?? "";

  return (
    <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Basic Information" description="What the class is about and who teaches it." tone="blue">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="live-title" label="Class Title" required count={title.length} max={LIVE_TITLE_MAX} />
          <InputField
            id="live-title"
            placeholder="Enter live class title (e.g. JavaScript Q&A Session)"
            maxLength={LIVE_TITLE_MAX + 20}
            aria-invalid={!!errors.title}
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <Controller
          control={control}
          name="courseId"
          render={({ field, fieldState }) => (
            <FormSelectField
              id="live-course"
              label="Course"
              required
              value={field.value}
              onChange={field.onChange}
              options={COURSE_OPTIONS}
              placeholder="Select a course"
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="instructorId"
            render={({ field, fieldState }) => (
              <FormSelectField
                id="live-instructor"
                label="Instructor"
                required
                value={field.value}
                onChange={field.onChange}
                options={INSTRUCTOR_OPTIONS}
                placeholder="Select instructor"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState }) => (
              <FormSelectField
                id="live-type"
                label="Class Type"
                value={field.value}
                onChange={field.onChange}
                options={TYPE_OPTIONS}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div>
          <FieldLabel label="Description" optional />
          <Controller
            control={control}
            name="descriptionHtml"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write a short description about this live class..." minHeight="120px" />
            )}
          />
          <div className="mt-1 flex items-start justify-between gap-3">
            <FieldError message={errors.descriptionHtml?.message} />
            <CharCounter count={plainLength(description)} max={LIVE_DESCRIPTION_MAX} className="ml-auto" />
          </div>
        </div>

        <div className="max-w-xs">
          <FieldLabel htmlFor="live-capacity" label="Seats / Capacity" required />
          <InputField
            id="live-capacity"
            type="number"
            min={1}
            max={10000}
            inputMode="numeric"
            placeholder="e.g. 100"
            aria-invalid={!!errors.capacity}
            error={errors.capacity?.message}
            {...register("capacity", { valueAsNumber: true })}
          />
          {!errors.capacity && <p className="mt-1.5 body-xsm-regular text-primary-300">Maximum number of students who can join.</p>}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default BasicInfoCard;
