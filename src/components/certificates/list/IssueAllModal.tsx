"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Award, Info } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

const schema = z.object({ sendEmail: z.boolean() });
type Values = z.infer<typeof schema>;

export interface IssueAllModalProps {
  isOpen: boolean;
  courseTitle: string;
  count: number;
  templateName: string | null;
  onClose: () => void;
  /** Throw to keep the modal open (the caller shows the toast). */
  onConfirm: (sendEmail: boolean) => Promise<unknown>;
}

/** Confirms "Issue to all (N)" for one course's eligible queue. */
export function IssueAllModal({ isOpen, courseTitle, count, templateName, onClose, onConfirm }: IssueAllModalProps) {
  const formId = useId();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { sendEmail: true } });

  useEffect(() => {
    if (isOpen) reset({ sendEmail: true });
  }, [isOpen, reset]);

  const submit = async (v: Values) => {
    try {
      await onConfirm(v.sendEmail);
      onClose();
    } catch {
      /* toast shown by caller */
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={`Issue ${count} Certificate${count === 1 ? "" : "s"}`}
      subtitle={courseTitle}
      maxWidth="sm"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting || !templateName} leftIcon={<Award className="h-4 w-4" />}>
            {isSubmitting ? "Issuing..." : `Issue to All (${count})`}
          </PrimaryButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
        <div className="flex items-start gap-3 rounded-xl border border-blue bg-blue-14 p-3.5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
          <p className="body-sm-regular text-primary-400">
            {templateName ? (
              <>
                Every learner in this course&apos;s eligible queue gets a certificate on <span className="body-sm-medium text-primary-500">{templateName}</span>. Learners who already hold a valid certificate are skipped.
              </>
            ) : (
              "This course has no active certificate template. Assign one in the Templates tab first."
            )}
          </p>
        </div>
        <Controller
          control={control}
          name="sendEmail"
          render={({ field }) => <SettingToggleRow title="Email each learner their certificate" description="Sends a download link right after issuing." checked={field.value} onChange={field.onChange} />}
        />
      </form>
    </ModalShell>
  );
}

export default IssueAllModal;
