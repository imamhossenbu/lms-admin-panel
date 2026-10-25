"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { outlineModuleSchema, type OutlineModuleInput } from "@/validations/courseOutlineSchema";
import { OutlineTextArea } from "./OutlineTextArea";

export interface ModuleFormModalProps {
  isOpen: boolean;
  /** Values of the module being edited; omit when adding. */
  initialValues?: OutlineModuleInput;
  onClose: () => void;
  onSubmit: (values: OutlineModuleInput) => void;
}

const EMPTY: OutlineModuleInput = { title: "", description: "" };

export function ModuleFormModal({ isOpen, initialValues, onClose, onSubmit }: ModuleFormModalProps) {
  const isEdit = Boolean(initialValues);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OutlineModuleInput>({
    resolver: zodResolver(outlineModuleSchema),
    mode: "onTouched",
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (isOpen) reset(initialValues ?? EMPTY);
  }, [isOpen, initialValues, reset]);

  const description = useWatch({ control, name: "description" }) ?? "";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Module" : "Add New Module"}
      subtitle={isEdit ? "Update the module title and description." : "Add a module to the generated outline."}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form="outline-module-form"
            isLoading={isSubmitting}
            leftIcon={isEdit ? <Check /> : <Plus />}
          >
            {isEdit ? "Save Module" : "Add Module"}
          </PrimaryButton>
        </>
      }
    >
      <form id="outline-module-form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="outline-module-title"
          label="Module Title"
          required
          placeholder="e.g. HTML Fundamentals"
          autoFocus
          error={errors.title?.message}
          {...register("title")}
        />
        <OutlineTextArea
          id="outline-module-description"
          label="Description"
          placeholder="What will learners cover in this module?"
          maxLength={300}
          count={description.length}
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </ModalShell>
  );
}

export default ModuleFormModal;
