"use client";

import React, { useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { LIVE_DESCRIPTION_MAX, LIVE_TITLE_MAX, type LiveClassFormValues } from "@/validations/liveClassSchema";
import { FormSelectField } from "./FormSelectField";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { useLiveInstructors } from "@/lib/liveClassStorage";
import { courseOf, instructorOf } from "@/lib/liveClassStats";
import { TYPE_OPTIONS } from "./liveFormUtils";

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

const withCurrent = (options: AppSelectOption[], value: string, label: string | undefined): AppSelectOption[] =>
  value && label && !options.some((o) => o.value === value) ? [{ value, label }, ...options] : options;

/** Class Title, Course, Instructor, Class Type, Description (rich text, x/1000) and Seats. */
export function BasicInfoCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LiveClassFormValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "descriptionHtml" }) ?? "";
  const courseId = useWatch({ control, name: "courseId" }) ?? "";
  const instructorId = useWatch({ control, name: "instructorId" }) ?? "";
  const catalog = useCourseCatalog();
  const instructors = useLiveInstructors();

  // The saved course / instructor stays selectable even when it's no longer in the lists (e.g. an archived course).
  const courseOptions = useMemo(() => withCurrent(catalog ?? [], courseId, courseOf(courseId)?.title), [catalog, courseId]);
  const instructorOptions = useMemo(
    () => withCurrent((instructors ?? []).map((i) => ({ value: i.id, label: i.name })), instructorId, instructorOf(instructorId)?.name),
    [instructors, instructorId]
  );

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
              options={courseOptions}
              placeholder={catalog ? "Select a course" : "Loading courses..."}
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
                options={instructorOptions}
                placeholder={instructors ? "Select instructor" : "Loading instructors..."}
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
