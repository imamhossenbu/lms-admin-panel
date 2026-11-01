"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { fileExtension } from "./resourceUtils";

const renameSchema = z.object({
  name: z.string().trim().min(1, "File name is required").max(200, "File name must be 200 characters or less"),
});
type RenameValues = z.infer<typeof renameSchema>;

interface RenameResourceFileModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

/** Small modal to rename an uploaded resource file (keeps its extension). */
export function RenameResourceFileModal({ isOpen, currentName, onClose, onSave }: RenameResourceFileModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RenameValues>({ resolver: zodResolver(renameSchema), mode: "onChange", defaultValues: { name: currentName } });

  useEffect(() => {
    if (isOpen) reset({ name: currentName });
  }, [isOpen, currentName, reset]);

  const submit = handleSubmit(({ name }) => {
    const ext = fileExtension(currentName);
    const next = ext && fileExtension(name) !== ext ? `${name}.${ext.toLowerCase()}` : name;
    onSave(next);
  });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Rename File"
      subtitle="Choose the name students will see for this resource."
      maxWidth="sm"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" form="rename-resource-file-form" isLoading={isSubmitting}>
            Save
          </PrimaryButton>
        </>
      }
    >
      <form
        id="rename-resource-file-form"
        noValidate
        onSubmit={(e) => {
          // The modal is portalled, but React events still bubble to the lesson form — keep them here.
          e.stopPropagation();
          void submit(e);
        }}
      >
        <InputField id="resource-file-name" label="File name" required autoFocus error={errors.name?.message} {...register("name")} />
      </form>
    </ModalShell>
  );
}

export default RenameResourceFileModal;
