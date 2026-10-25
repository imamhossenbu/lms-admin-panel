"use client";

import React, { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { cn } from "@/lib/cn";
import {
  AI_DURATION_WEEK_OPTIONS,
  AI_LANGUAGE_OPTIONS,
  AI_LEVEL_OPTIONS,
  AI_MODULE_COUNT_OPTIONS,
  type CourseAiFormInput,
} from "@/validations/courseAiSchema";
import { LESSONS_PER_MODULE_OPTIONS } from "../aiOutline";
import { AiFormField } from "./AiFormField";
import { AiInfoNote } from "./AiInfoNote";

export interface AiGenerateFormProps {
  formId: string;
  form: UseFormReturn<CourseAiFormInput>;
  onSubmit: (values: CourseAiFormInput) => void;
}

const controlClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-white px-3.5 body-sm-regular text-primary-500 shadow-2xs outline-none transition-colors placeholder:text-primary-300 focus:border-brand-orange",
    hasError ? "border-red bg-red-14" : "border-dash"
  );

/** Keeps a prefilled value selectable even when it is not one of the preset options. */
const withValue = <T extends string | number>(options: readonly T[], value: T | undefined) =>
  value === undefined || value === "" || options.includes(value) ? [...options] : [...options, value];

/** Left column of the "Generate Course with AI" modal. */
export function AiGenerateForm({ formId, form, onSubmit }: AiGenerateFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const language = watch("language");
  const durationWeeks = watch("durationWeeks");

  const languageOptions = useMemo(() => withValue(AI_LANGUAGE_OPTIONS, language), [language]);
  const durationOptions = useMemo(
    () =>
      withValue(AI_DURATION_WEEK_OPTIONS, durationWeeks).map((weeks) => ({
        value: String(weeks),
        label: `${weeks} ${weeks === 1 ? "week" : "weeks"}`,
      })),
    [durationWeeks]
  );
  const moduleOptions = AI_MODULE_COUNT_OPTIONS.map((count) => ({ value: String(count), label: String(count) }));

  return (
    <form id={formId} noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AiFormField
        label="Course Topic"
        htmlFor="ai-topic"
        required
        helper="e.g. Complete Web Development, Digital Marketing, UI/UX Design"
        error={errors.topic?.message}
      >
        <input
          id="ai-topic"
          placeholder="What is your course about?"
          aria-invalid={!!errors.topic}
          className={cn(controlClass(!!errors.topic), "h-10")}
          {...register("topic")}
        />
      </AiFormField>

      <AiFormField
        label="Target Audience"
        htmlFor="ai-audience"
        required
        helper="Describe your ideal students"
        error={errors.audience?.message}
      >
        <input
          id="ai-audience"
          placeholder="e.g. Beginners who want to become professional web developers"
          aria-invalid={!!errors.audience}
          className={cn(controlClass(!!errors.audience), "h-10")}
          {...register("audience")}
        />
      </AiFormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AiFormField label="Course Level" required error={errors.level?.message}>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <AppSelect
                fullWidth
                value={field.value}
                onValueChange={field.onChange}
                options={AI_LEVEL_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                placeholder="Select level"
              />
            )}
          />
        </AiFormField>
        <AiFormField label="Language" required error={errors.language?.message}>
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <AppSelect
                fullWidth
                value={field.value}
                onValueChange={field.onChange}
                options={languageOptions}
                placeholder="Select language"
              />
            )}
          />
        </AiFormField>
      </div>

      <AiFormField
        label="Learning Goals"
        htmlFor="ai-goals"
        helper="What should students be able to do after completing this course?"
        error={errors.goals?.message}
      >
        <textarea
          id="ai-goals"
          rows={3}
          placeholder="e.g. Students will be able to build and deploy full-stack web applications"
          aria-invalid={!!errors.goals}
          className={cn(controlClass(!!errors.goals), "resize-none py-2.5")}
          {...register("goals")}
        />
      </AiFormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AiFormField label="Course Duration" error={errors.durationWeeks?.message}>
          <Controller
            control={control}
            name="durationWeeks"
            render={({ field }) => (
              <AppSelect
                fullWidth
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(Number(v))}
                options={durationOptions}
                placeholder="Duration"
              />
            )}
          />
        </AiFormField>
        <AiFormField label="Number of Modules" error={errors.moduleCount?.message}>
          <Controller
            control={control}
            name="moduleCount"
            render={({ field }) => (
              <AppSelect
                fullWidth
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(Number(v))}
                options={moduleOptions}
                placeholder="Modules"
              />
            )}
          />
        </AiFormField>
        <AiFormField label="Lessons per Module" error={errors.lessonsPerModule?.message}>
          <Controller
            control={control}
            name="lessonsPerModule"
            render={({ field }) => (
              <AppSelect
                fullWidth
                value={field.value}
                onValueChange={field.onChange}
                options={[...LESSONS_PER_MODULE_OPTIONS]}
                placeholder="Lessons"
              />
            )}
          />
        </AiFormField>
      </div>

      <AiInfoNote icon={<Sparkles className="h-5 w-5" />}>
        AI will generate a structured syllabus with modules, lesson titles and suggested lesson types (videos, quizzes,
        assignments, etc.). You can review and edit everything before adding it to your course.
      </AiInfoNote>
    </form>
  );
}

export default AiGenerateForm;
