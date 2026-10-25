"use client";

import React from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { TagsInput } from "@/components/ui/TagsInput";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import {
  instructorNoteSchema,
  InstructorNoteInput,
  NOTE_PRIORITIES,
  NOTE_TYPES,
} from "@/validations/instructorSchema";
import { NoteTagBadge } from "../NoteTagBadge";
import { NoteInformationCard } from "./NoteInformationCard";

interface InstructorNoteFormProps {
  mode: "create" | "edit";
  defaultValues: Partial<InstructorNoteInput>;
  cancelHref: string;
  /** Resolve to finish; throw to keep the form open. */
  onSubmit: (data: InstructorNoteInput) => Promise<void>;
}

const FieldLabel = ({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className="block body-sm-medium text-primary-500 mb-2">
    {children}
    {required && <span className="text-red ml-0.5">*</span>}
  </label>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="body-xsm-regular text-red mt-1">{message}</p> : null;

export function InstructorNoteForm({ mode, defaultValues, cancelHref, onSubmit }: InstructorNoteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<InstructorNoteInput>({
    resolver: zodResolver(instructorNoteSchema),
    mode: "onTouched",
    defaultValues: { title: "", content: "", hasReminder: false, tags: [], ...defaultValues },
  });

  const [hasReminder, tags] = useWatch({ control, name: ["hasReminder", "tags"] });

  const addSuggestedTag = (tag: string) => {
    const current = getValues("tags");
    if (current.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    setValue("tags", [...current, tag], { shouldValidate: true, shouldDirty: true });
  };

  const submit = async (data: InstructorNoteInput) => {
    try {
      await onSubmit(data);
    } catch {
      // Error toast raised by the page; keep the form open
    }
  };

  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
      <form onSubmit={handleSubmit(submit)} noValidate className="xl:col-span-8 space-y-5">
        <div>
          <h1 className="heading-h3 font-bold text-primary-500">{mode === "create" ? "Add Note" : "Edit Note"}</h1>
          <p className="body-sm-regular text-primary-300 mt-1">
            {mode === "create"
              ? "Add an internal note about this instructor. This note will only be visible to admins."
              : "Update this internal note. Changes are visible to all admins."}
          </p>
        </div>

        <InputField
          id="note-title"
          label={<span className="body-sm-medium text-primary-500">Note Title</span>}
          required
          placeholder="Enter a short title for this note..."
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <FieldLabel required>Note Content</FieldLabel>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={(html) => field.onChange(html)}
                placeholder="Write your note here..."
                minHeight="140px"
              />
            )}
          />
          <FieldError message={errors.content?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Note Type</FieldLabel>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <AppSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Select note type"
                  options={[...NOTE_TYPES]}
                  className="w-full"
                  triggerClassName={`w-full h-11 bg-white ${errors.type ? "border-red" : ""}`}
                />
              )}
            />
            <FieldError message={errors.type?.message} />
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <AppSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Select priority"
                  options={[...NOTE_PRIORITIES]}
                  className="w-full"
                  triggerClassName={`w-full h-11 bg-white ${errors.priority ? "border-red" : ""}`}
                />
              )}
            />
            <FieldError message={errors.priority?.message} />
          </div>
        </div>

        <div className="space-y-3">
          <Controller
            control={control}
            name="hasReminder"
            render={({ field }) => (
              <ToggleSwitch
                id="note-reminder"
                checked={field.value}
                onChange={(checked) => {
                  field.onChange(checked);
                  if (!checked) setValue("reminderDate", undefined, { shouldValidate: true });
                }}
                label="Add a reminder (optional)"
              />
            )}
          />
          {hasReminder && (
            <div className="md:w-1/2">
              <InputField
                id="note-reminder-date"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                error={errors.reminderDate?.message}
                {...register("reminderDate")}
              />
            </div>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="note-tags">Tags (optional)</FieldLabel>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput
                id="note-tags"
                value={field.value}
                onChange={field.onChange}
                error={errors.tags?.message}
                renderTag={(tag) => <NoteTagBadge tag={tag} size="sm" />}
              />
            )}
          />
          <p className="body-xsm-regular text-primary-300 mt-1.5">
            Use tags to categorize notes (e.g. performance, issue, meeting).
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <PrimaryButton
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Save Note" : "Save Changes"}
          </PrimaryButton>
          <Link href={cancelHref} tabIndex={-1}>
            <SecondaryButton type="button" size="lg" disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
          </Link>
        </div>
      </form>

      <div className="xl:col-span-4">
        <NoteInformationCard selectedTags={tags} onAddTag={addSuggestedTag} />
      </div>
    </div>
  );
}

export default InstructorNoteForm;
