"use client";

import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Clock, Plus } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { outlineLessonSchema, type OutlineLessonInput } from "@/validations/courseOutlineSchema";
import { LESSON_TYPES, LESSON_TYPE_LABEL } from "../aiOutline";
import { LessonTypeIcon } from "./LessonTypeIcon";
import { OutlineTextArea } from "./OutlineTextArea";

export interface LessonFormModalProps {
  isOpen: boolean;
  /** Module the lesson belongs to (shown in the subtitle). */
  moduleTitle?: string;
  /** Values of the lesson being edited; omit when adding. */
  initialValues?: OutlineLessonInput;
  onClose: () => void;
  onSubmit: (values: OutlineLessonInput) => void;
}

const EMPTY: OutlineLessonInput = { title: "", type: "VIDEO", durationMinutes: 10, summary: "" };

const TYPE_OPTIONS = LESSON_TYPES.map((type) => ({
  value: type,
  label: LESSON_TYPE_LABEL[type],
  icon: <LessonTypeIcon type={type} size="sm" className="h-5 w-5" />,
}));

export function LessonFormModal({ isOpen, moduleTitle, initialValues, onClose, onSubmit }: LessonFormModalProps) {
  const isEdit = Boolean(initialValues);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OutlineLessonInput>({
    resolver: zodResolver(outlineLessonSchema),
    mode: "onTouched",
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (isOpen) reset(initialValues ?? EMPTY);
  }, [isOpen, initialValues, reset]);

  const summary = useWatch({ control, name: "summary" }) ?? "";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Lesson" : "Add Lesson"}
      subtitle={moduleTitle ? `Module: ${moduleTitle}` : undefined}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form="outline-lesson-form"
            isLoading={isSubmitting}
            leftIcon={isEdit ? <Check /> : <Plus />}
          >
            {isEdit ? "Save Lesson" : "Add Lesson"}
          </PrimaryButton>
        </>
      }
    >
      <form id="outline-lesson-form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="outline-lesson-title"
          label="Lesson Title"
          required
          placeholder="e.g. How the Web Works"
          autoFocus
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block body-sm-regular text-primary-400">
              Lesson Type<span className="ml-0.5 text-red">*</span>
            </span>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  options={TYPE_OPTIONS}
                  fullWidth
                />
              )}
            />
            {errors.type && <p className="mt-1.5 body-xsm-regular text-red">{errors.type.message}</p>}
          </div>

          <InputField
            id="outline-lesson-duration"
            label="Duration (minutes)"
            required
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            step={1}
            leftElement={<Clock className="h-4 w-4" />}
            error={errors.durationMinutes?.message}
            {...register("durationMinutes", { valueAsNumber: true })}
          />
        </div>

        <OutlineTextArea
          id="outline-lesson-summary"
          label="Summary"
          placeholder="Briefly describe what this lesson covers"
          maxLength={500}
          count={summary.length}
          error={errors.summary?.message}
          {...register("summary")}
        />
      </form>
    </ModalShell>
  );
}

export default LessonFormModal;
