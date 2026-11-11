"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { moduleTitleSchema, type ModuleTitleValues } from "@/validations/teacherContentSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Add a module, or rename one (`initial` set). */
export function ModuleTitleModal({ open, initial, onClose, onSave }: { open: boolean; initial?: string; onClose: () => void; onSave: (title: string) => Promise<unknown> }) {
  const { register, handleSubmit, reset, formState } = useForm<ModuleTitleValues>({ resolver: zodResolver(moduleTitleSchema), mode: "onChange" });
  useEffect(() => {
    if (open) reset({ title: initial ?? "" });
  }, [open, initial, reset]);
  const editing = initial !== undefined;

  const onSubmit = async (v: ModuleTitleValues) => {
    const id = toast.loading(editing ? "Renaming the module…" : "Adding the module…");
    try {
      await onSave(v.title);
      toast.success(editing ? "Module renamed" : "Module added", { id, description: v.title });
      onClose();
    } catch (e) {
      toast.error(editing ? "Couldn't rename the module" : "Couldn't add the module", { id, description: apiErrorMessage(e) });
    }
  };

  return (
    <ModalShell
      isOpen={open}
      onClose={onClose}
      title={editing ? "Rename module" : "Add module"}
      subtitle="Modules group your lessons into sections."
      titleIcon={<FolderPlus className="h-5 w-5" />}
      maxWidth="md"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 hover:border-primary-300">
            Cancel
          </button>
          <PrimaryButton type="submit" form="module-form" isLoading={formState.isSubmitting}>
            {editing ? "Save" : "Add module"}
          </PrimaryButton>
        </div>
      }
    >
      <form id="module-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField id="module-title" label="Module title" required placeholder="e.g. Getting started" error={formState.errors.title?.message} {...register("title")} />
      </form>
    </ModalShell>
  );
}

export default ModuleTitleModal;
