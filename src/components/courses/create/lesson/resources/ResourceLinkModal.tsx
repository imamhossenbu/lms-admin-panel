"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2 } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { lessonResourceLinkSchema, type LessonResourceLink } from "@/validations/lessonFormSchema";
import { newResourceId } from "./resourceUtils";

interface ResourceLinkModalProps {
  isOpen: boolean;
  /** Link being edited; null = adding a new link. */
  link: LessonResourceLink | null;
  onClose: () => void;
  onSave: (link: LessonResourceLink) => void;
}

const EMPTY: LessonResourceLink = { id: "", title: "", url: "" };

/** Add / edit an external resource link (own react-hook-form + `lessonResourceLinkSchema`). */
export function ResourceLinkModal({ isOpen, link, onClose, onSave }: ResourceLinkModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonResourceLink>({
    resolver: zodResolver(lessonResourceLinkSchema),
    mode: "onChange",
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (isOpen) reset(link ?? { ...EMPTY, id: newResourceId() });
  }, [isOpen, link, reset]);

  const submit = handleSubmit((values) => onSave({ ...values, title: values.title.trim(), url: values.url.trim() }));

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={link ? "Edit Link" : "Add Link"}
      subtitle="Share documentation, articles, tools or websites with your students."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" form="resource-link-form" isLoading={isSubmitting}>
            {link ? "Save Changes" : "Add Link"}
          </PrimaryButton>
        </>
      }
    >
      <form
        id="resource-link-form"
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          // The modal is portalled, but React events still bubble to the lesson form — keep them here.
          e.stopPropagation();
          void submit(e);
        }}
      >
        <input type="hidden" {...register("id")} />
        <InputField
          id="resource-link-title"
          label="Title"
          required
          autoFocus
          placeholder="e.g. MDN HTML Documentation"
          error={errors.title?.message}
          {...register("title")}
        />
        <InputField
          id="resource-link-url"
          label="URL"
          required
          type="url"
          inputMode="url"
          placeholder="https://developer.mozilla.org/..."
          leftElement={<Link2 className="h-4 w-4" />}
          error={errors.url?.message}
          {...register("url")}
        />
      </form>
    </ModalShell>
  );
}

export default ResourceLinkModal;
