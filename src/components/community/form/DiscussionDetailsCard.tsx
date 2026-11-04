"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileText } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { TagsInput } from "@/components/ui/TagsInput";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { FormSelectField } from "@/components/live-classes/form/FormSelectField";
import { useCourseCatalog, useCourseContext } from "@/lib/courseCatalog";
import { THREAD_BODY_MAX, THREAD_TAGS_MAX, THREAD_TITLE_MAX, type ThreadFormValues } from "@/validations/communitySchema";
import { SimilarDiscussionsHint } from "./SimilarDiscussionsHint";
import { COURSE_WIDE_VALUE, moduleOptions, plainLength } from "./threadFormUtils";

export interface DiscussionDetailsCardProps {
  /** Thread being edited (excluded from "Similar discussions"). */
  excludeThreadId?: string;
}

/** Title (x/150), Course, Module, Body (rich text, x/5000) and Tags, plus the similar-discussions hint. */
export function DiscussionDetailsCard({ excludeThreadId }: DiscussionDetailsCardProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ThreadFormValues>();
  const title = useWatch({ control, name: "title" }) ?? "";
  const courseId = useWatch({ control, name: "courseId" }) ?? "";
  const body = useWatch({ control, name: "bodyHtml" }) ?? "";
  const tags = useWatch({ control, name: "tags" }) ?? [];
  const courses = useCourseCatalog();
  // Loads the picked course's modules (cached); moduleOptions reads them once loaded.
  useCourseContext(courseId || null);
  const modules = moduleOptions(courseId);
  const tagsError = Array.isArray(errors.tags) ? errors.tags.find((e) => e?.message)?.message : errors.tags?.message;

  return (
    <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Details" description="What the discussion is about and where it belongs." tone="blue">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="thread-title" label="Title" required count={title.length} max={THREAD_TITLE_MAX} />
          <InputField
            id="thread-title"
            placeholder="e.g. Why does my flexbox layout overflow on mobile?"
            maxLength={THREAD_TITLE_MAX + 20}
            aria-invalid={!!errors.title}
            error={errors.title?.message}
            {...register("title")}
          />
          <SimilarDiscussionsHint title={title} courseId={courseId} excludeId={excludeThreadId} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="courseId"
            render={({ field, fieldState }) => (
              <FormSelectField
                id="thread-course"
                label="Course"
                required
                value={field.value}
                onChange={(next) => {
                  if (next !== field.value) setValue("moduleId", "", { shouldDirty: true });
                  field.onChange(next);
                }}
                options={courses ?? []}
                placeholder={courses ? "Select a course" : "Loading courses..."}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="moduleId"
            render={({ field, fieldState }) => (
              <FormSelectField
                id="thread-module"
                label="Module (Optional)"
                value={courseId ? field.value || COURSE_WIDE_VALUE : ""}
                onChange={(next) => field.onChange(next === COURSE_WIDE_VALUE ? "" : next)}
                options={modules}
                placeholder={courseId ? "Course-wide" : "Select a course first"}
                disabled={!courseId}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div id="thread-body">
          <FieldLabel label="Body" required />
          <Controller
            control={control}
            name="bodyHtml"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your question or topic in detail..." minHeight="200px" />
            )}
          />
          <div className="mt-1 flex items-start justify-between gap-3">
            <FieldError message={errors.bodyHtml?.message} />
            <CharCounter count={plainLength(body)} max={THREAD_BODY_MAX} className="ml-auto" />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="thread-tags" label="Tags" optional />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput
                id="thread-tags"
                value={field.value}
                onChange={(next) => field.onChange(Array.from(new Set(next.map((t) => t.trim().toLowerCase()).filter(Boolean))))}
                maxTags={THREAD_TAGS_MAX}
                maxLength={24}
                placeholder="e.g. css, flexbox, responsive"
                error={tagsError}
              />
            )}
          />
          {!tagsError && (
            <p className="mt-1.5 body-xsm-regular text-primary-300">
              Press Enter to add — letters, numbers and dashes ({tags.length}/{THREAD_TAGS_MAX}).
            </p>
          )}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default DiscussionDetailsCard;
