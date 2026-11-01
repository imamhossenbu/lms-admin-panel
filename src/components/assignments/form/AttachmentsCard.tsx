"use client";

import React, { useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { FieldError } from "@/components/courses/lesson-editor/fields/FieldError";
import type { AssignmentAttachment } from "@/types/assignment";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";
import { cn } from "@/lib/cn";
import { ATTACHMENT_ACCEPT } from "./assignmentFormConfig";
import { useAttachmentUploads } from "./useAttachmentUploads";
import { AttachmentFileRow, AttachmentUploadingRow } from "./AttachmentRows";

interface AttachmentsFieldProps {
  value: AssignmentAttachment[];
  onChange: (next: AssignmentAttachment[]) => void;
  /** Reads the latest list (uploads finish asynchronously). */
  getLatest: () => AssignmentAttachment[];
  error?: string;
  onUploadingChange: (uploading: boolean) => void;
}

function AttachmentsField({ value, onChange, getLatest, error, onUploadingChange }: AttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { pending, addFiles } = useAttachmentUploads(value.length, (file) => onChange([...getLatest(), file]), onUploadingChange);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-colors cursor-pointer",
          error ? "border-red bg-red-14" : dragOver ? "border-blue bg-blue-14" : "border-dash bg-white hover:border-blue"
        )}
      >
        <span className="flex items-center gap-4 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-bg text-primary-500">
            <Upload className="h-5 w-5" />
          </span>
          <span>
            <span className="block body-sm-medium text-primary-500">
              Drag and drop files here or <span className="text-blue">click to upload</span>
            </span>
            <span className="block body-xsm-regular text-primary-300">PDF, DOC, PPT, ZIP (Max 50 MB)</span>
          </span>
        </span>
      </motion.button>

      {(value.length > 0 || pending.length > 0) && (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {value.map((file) => (
              <AttachmentFileRow key={file.id} file={file} onRemove={() => onChange(getLatest().filter((f) => f.id !== file.id))} />
            ))}
            {pending.map((upload) => (
              <AttachmentUploadingRow key={upload.id} upload={upload} />
            ))}
          </AnimatePresence>
        </ul>
      )}
      <FieldError message={error} />
    </div>
  );
}

export interface AttachmentsCardProps {
  form: UseFormReturn<AssignmentFormValues>;
  onUploadingChange: (uploading: boolean) => void;
}

/** "Instructions & Attachments": dashed multi-file dropzone with progress rows. */
export function AttachmentsCard({ form, onUploadingChange }: AttachmentsCardProps) {
  return (
    <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Instructions & Attachments" description="Add detailed instructions and optional resources for students.">
      <Controller
        control={form.control}
        name="attachments"
        render={({ field, fieldState }) => (
          <AttachmentsField
            value={field.value}
            onChange={(next) => form.setValue("attachments", next, { shouldDirty: true, shouldValidate: true })}
            getLatest={() => form.getValues("attachments")}
            error={fieldState.error?.message}
            onUploadingChange={onUploadingChange}
          />
        )}
      />
    </IconSectionCard>
  );
}

export default AttachmentsCard;
