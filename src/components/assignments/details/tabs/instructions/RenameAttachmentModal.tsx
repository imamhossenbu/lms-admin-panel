"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { AssignmentAttachment } from "@/types/assignment";

const renameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(120, "120 characters or less")
    .refine((n) => !/[\\/:*?"<>|]/.test(n), "File names can't contain \\ / : * ? \" < > |"),
});
type RenameValues = z.infer<typeof renameSchema>;

const splitName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? { base: name.slice(0, dot), ext: name.slice(dot) } : { base: name, ext: "" };
};

export interface RenameAttachmentModalProps {
  file: AssignmentAttachment;
  onClose: () => void;
  /** Resolve to close; throw to keep it open. */
  onRename: (name: string) => Promise<void>;
}

/** Rename an attachment (extension is kept). Mount only while open. */
export function RenameAttachmentModal({ file, onClose, onRename }: RenameAttachmentModalProps) {
  const { base, ext } = splitName(file.name);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RenameValues>({ resolver: zodResolver(renameSchema), defaultValues: { name: base }, mode: "onTouched" });

  const submit = handleSubmit(async ({ name }) => {
    try {
      await onRename(`${name}${ext}`);
      onClose();
    } catch {
      /* caller shows the error toast */
    }
  });

  return (
    <ModalShell
      isOpen
      onClose={isSubmitting ? () => {} : onClose}
      title="Rename Attachment"
      subtitle="Students will see the new name when they download the file."
      maxWidth="sm"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="rename-attachment-form" isLoading={isSubmitting}>
            {isSubmitting ? "Saving..." : "Rename"}
          </PrimaryButton>
        </>
      }
    >
      <form id="rename-attachment-form" onSubmit={submit} noValidate>
        <InputField
          id="attachment-name"
          label="File Name"
          required
          autoFocus
          error={errors.name?.message}
          rightElement={ext ? <span className="body-sm-regular text-primary-300">{ext}</span> : undefined}
          {...register("name")}
        />
      </form>
    </ModalShell>
  );
}

export default RenameAttachmentModal;
