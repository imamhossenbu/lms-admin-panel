"use client";

import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { CharCounter } from "@/components/ui/CharCounter";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { REPLY_MAX, replyFormSchema, type ReplyFormValues } from "@/validations/communitySchema";
import { plainLength } from "../threadFormat";

export interface ReplyComposerProps {
  /** Starting HTML (edit mode). */
  initialHtml?: string;
  placeholder?: string;
  submitLabel: string;
  pendingLabel?: string;
  submitIcon?: React.ReactNode;
  minHeight?: string;
  /** Resolve = success (the editor is cleared); reject = keep the text (the caller shows the error toast). */
  onSubmit: (bodyHtml: string) => Promise<unknown>;
  onCancel?: () => void;
}

/** Rich-text reply / edit form: react-hook-form + zodResolver(replyFormSchema), counter, error and submit. */
export function ReplyComposer({
  initialHtml = "",
  placeholder = "Write your reply...",
  submitLabel,
  pendingLabel = "Posting...",
  submitIcon = <Send />,
  minHeight = "140px",
  onSubmit,
  onCancel,
}: ReplyComposerProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyFormValues>({ resolver: zodResolver(replyFormSchema), defaultValues: { bodyHtml: initialHtml } });
  const body = useWatch({ control, name: "bodyHtml" });

  const submit = async (values: ReplyFormValues) => {
    try {
      await onSubmit(values.bodyHtml);
      reset({ bodyHtml: "" });
    } catch {
      // Error toast is shown by the caller; keep the text so nothing is lost.
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-2">
      <Controller
        control={control}
        name="bodyHtml"
        render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} placeholder={placeholder} minHeight={minHeight} />}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="min-h-5 body-xsm-regular text-red">{errors.bodyHtml?.message}</p>
        <CharCounter count={plainLength(body ?? "")} max={REPLY_MAX} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        {onCancel && (
          <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
        )}
        <PrimaryButton type="submit" leftIcon={submitIcon} isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? pendingLabel : submitLabel}
        </PrimaryButton>
      </div>
    </form>
  );
}

export default ReplyComposer;
