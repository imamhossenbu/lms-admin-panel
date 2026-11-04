"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { AppSelect, AppSelectOption } from "@/components/ui/AppSelect";
import {
  StudentNoteCategory,
  StudentNoteItem,
} from "@/types/studentDetails";
import { studentNoteSchema, type StudentNoteInput } from "@/validations/studentSchema";

interface AddEditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Resolves when saved; a rejection keeps the modal open (the caller shows the error toast). */
  onSave: (noteData: { category: StudentNoteCategory; content: string }) => Promise<void>;
  initialNote?: StudentNoteItem | null;
}

const CATEGORY_OPTIONS: AppSelectOption[] = [
  {
    value: "good_progress",
    label: "Good Progress",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-blue shrink-0 inline-block" />
    ),
  },
  {
    value: "needs_improvement",
    label: "Needs Improvement",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-yellow shrink-0 inline-block" />
    ),
  },
  {
    value: "student_support",
    label: "Student Support",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-green shrink-0 inline-block" />
    ),
  },
  {
    value: "counseling_call",
    label: "Counseling Call",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-purple shrink-0 inline-block" />
    ),
  },
  {
    value: "payment_issue",
    label: "Payment Issue",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-red shrink-0 inline-block" />
    ),
  },
  {
    value: "general",
    label: "General Note",
    icon: (
      <span className="w-2.5 h-2.5 rounded-full bg-primary-300 shrink-0 inline-block" />
    ),
  },
];

export function AddEditNoteModal({ isOpen, onClose, onSave, initialNote }: AddEditNoteModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentNoteInput>({
    resolver: zodResolver(studentNoteSchema),
    defaultValues: { category: "good_progress", content: "" },
  });

  useEffect(() => {
    if (isOpen) reset(initialNote ? { category: initialNote.category, content: initialNote.content } : { category: "good_progress", content: "" });
  }, [initialNote, isOpen, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSave(values);
      onClose();
    } catch {
      /* the caller already showed the error toast; keep the modal open */
    }
  });

  const length = watch("content")?.length ?? 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={initialNote ? "Edit Internal Note" : "Add Internal Note"}
      subtitle="Visible only to your workspace's admins and instructors."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialNote ? "Update Note" : "Save Note"}
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5 text-left">
        <div className="space-y-2">
          <label className="block body-sm-medium text-primary-500">Note Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <AppSelect fullWidth value={field.value} onValueChange={(val) => field.onChange(val as StudentNoteCategory)} options={CATEGORY_OPTIONS} triggerClassName="w-full justify-between" />
            )}
          />
          {errors.category && <p className="body-2xsm-regular text-red">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="student-note-content" className="block body-sm-medium text-primary-500">
              Note Description
            </label>
            <span className="body-2xsm-regular text-primary-300">{length}/2000</span>
          </div>
          <textarea
            id="student-note-content"
            {...register("content")}
            maxLength={2000}
            rows={4}
            placeholder="Write specific feedback, support notes, or observation about this student..."
            className={`w-full p-3.5 rounded-xl border bg-slate-50 body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:bg-white transition-colors resize-none ${
              errors.content ? "border-red focus:border-red" : "border-dash focus:border-brand-orange"
            }`}
          />
          {errors.content && <p className="body-2xsm-regular text-red">{errors.content.message}</p>}
        </div>
      </form>
    </ModalShell>
  );
}
