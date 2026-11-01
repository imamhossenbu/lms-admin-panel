"use client";

import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Upload } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonSubtitle } from "@/validations/lessonEditorSchema";
import type { LessonEditorOption } from "@/types/lessonEditor";
import { EditorFieldLabel } from "../../fields/FieldLabel";
import { FieldError } from "../../fields/FieldError";
import { fileExtension, formatBytes, useMockUpload } from "../../hooks/useMockUpload";

const SUBTITLE_RULES = { extensions: ["vtt", "srt"], maxBytes: 1024 * 1024, label: "subtitle" };

const buildSchema = (usedLanguages: string[]) =>
  z.object({
    language: z
      .string()
      .min(1, "Select a language")
      .refine((v) => !usedLanguages.includes(v), "A subtitle for this language already exists"),
    file: z
      .custom<File | null>((v) => v === null || v instanceof File)
      .refine((f): f is File => f instanceof File, "Upload a .vtt or .srt file")
      .refine((f) => !f || SUBTITLE_RULES.extensions.includes(fileExtension(f.name)), "Only .vtt or .srt files are supported")
      .refine((f) => !f || f.size <= SUBTITLE_RULES.maxBytes, "Subtitle file must be 1 MB or less"),
  });

const newSubtitleId = () => `sub-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

type SubtitleFormValues = { language: string; file: File | null };

export interface AddSubtitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: LessonEditorOption[];
  usedLanguages: string[];
  onAdd: (subtitle: LessonSubtitle) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

/** "+ Add Subtitle" modal: language + .vtt/.srt file, uploaded via mockUploadFile. */
export function AddSubtitleModal({ isOpen, onClose, languages, usedLanguages, onAdd, onUploadingChange }: AddSubtitleModalProps) {
  const schema = useMemo(() => buildSchema(usedLanguages), [usedLanguages]);
  const { upload } = useMockUpload(SUBTITLE_RULES, onUploadingChange);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubtitleFormValues, unknown, { language: string; file: File }>({
    resolver: zodResolver(schema),
    defaultValues: { language: "", file: null },
    mode: "onTouched",
  });

  const close = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async ({ language, file }) => {
    const url = await upload(file);
    if (!url) return;
    onAdd({ id: newSubtitleId(), language, fileName: file.name, url, status: "ACTIVE" });
    reset();
    onClose();
  });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Add Subtitle"
      subtitle="Upload a caption file to make your video accessible."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={close} disabled={isSubmitting}>Cancel</SecondaryButton>
          <PrimaryButton leftIcon={<Plus />} onClick={() => void onSubmit()} isLoading={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Add Subtitle"}
          </PrimaryButton>
        </>
      }
    >
      <form
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          e.stopPropagation();
          void onSubmit(e);
        }}
      >
        <div>
          <EditorFieldLabel required>Language</EditorFieldLabel>
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <AppSelect value={field.value} onValueChange={field.onChange} options={languages} placeholder="Select a language" fullWidth />
            )}
          />
          <FieldError message={errors.language?.message} />
        </div>

        <div>
          <EditorFieldLabel htmlFor="subtitle-file" required>Subtitle File</EditorFieldLabel>
          <Controller
            control={control}
            name="file"
            render={({ field }) => (
              <label
                htmlFor="subtitle-file"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 transition-colors ${errors.file ? "border-red bg-red-14" : "border-blue/40 bg-white"}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
                  {field.value ? <FileText className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate body-sm-medium text-primary-500">{field.value ? field.value.name : "Choose a .vtt or .srt file"}</span>
                  <span className="block body-xsm-regular text-primary-300">{field.value ? formatBytes(field.value.size) : "WebVTT or SubRip, max 1 MB"}</span>
                </span>
                <input
                  id="subtitle-file"
                  type="file"
                  accept=".vtt,.srt,text/vtt"
                  className="sr-only"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0] ?? null);
                    field.onBlur();
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          />
          <FieldError message={errors.file?.message} />
        </div>
      </form>
    </ModalShell>
  );
}

export default AddSubtitleModal;
