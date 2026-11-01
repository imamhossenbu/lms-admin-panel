"use client";

import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldOff } from "lucide-react";
import { revokeCertificateSchema, type RevokeCertificateValues } from "@/validations/certificateSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { REVOKE_REASONS } from "./certificateDetailFormat";

const DEFAULTS: RevokeCertificateValues = { reason: "ISSUED_IN_ERROR", details: "", notifyLearner: true };
const DETAILS_MAX = 300;

export interface RevokeCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  code: string;
  /** Resolve to close; throw to keep the modal open (caller toasts). */
  onSubmit: (values: RevokeCertificateValues) => Promise<void>;
}

/** Revoke form: reason tiles, optional details (required for "Other"), "Notify learner" toggle. */
export function RevokeCertificateModal({ isOpen, onClose, recipientName, code, onSubmit }: RevokeCertificateModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RevokeCertificateValues>({ resolver: zodResolver(revokeCertificateSchema), defaultValues: DEFAULTS, mode: "onChange" });

  useEffect(() => {
    if (isOpen) reset(DEFAULTS);
  }, [isOpen, reset]);

  const reason = useWatch({ control, name: "reason" });
  const details = useWatch({ control, name: "details" }) ?? "";

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      /* caller shows the error toast */
    }
  });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Revoke certificate"
      subtitle={`${recipientName} · ${code}`}
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="revoke-certificate-form" variant="danger" leftIcon={<ShieldOff />} isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Revoking..." : "Revoke Certificate"}
          </PrimaryButton>
        </>
      }
    >
      <form id="revoke-certificate-form" onSubmit={submit} className="space-y-5" noValidate>
        <div className="rounded-xl border border-red bg-red-14 p-3.5 body-sm-regular text-red-dark">
          The verification page will show this certificate as <strong>revoked</strong>. You can restore it later.
        </div>

        <div className="space-y-2">
          <p className="body-sm-medium font-semibold! text-primary-500">Reason</p>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <ChoiceCardGroup name="revoke-reason" aria-label="Revoke reason" columns={2} value={field.value} onChange={field.onChange} options={REVOKE_REASONS} />
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="revoke-details" className="body-sm-medium font-semibold! text-primary-500">
              Details {reason === "OTHER" ? <span className="text-red">*</span> : <span className="body-xsm-regular text-primary-300">(optional)</span>}
            </label>
            <span className="body-xsm-regular text-primary-300">
              {details.length}/{DETAILS_MAX}
            </span>
          </div>
          <TextAreaField
            id="revoke-details"
            rows={3}
            maxLength={DETAILS_MAX}
            placeholder={reason === "OTHER" ? "Explain why this certificate is being revoked" : "Add context for the audit log (optional)"}
            error={errors.details?.message}
            {...register("details")}
          />
        </div>

        <Controller
          control={control}
          name="notifyLearner"
          render={({ field }) => (
            <SettingToggleRow
              title="Notify learner"
              description={`Email ${recipientName} that this certificate was revoked.`}
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </form>
    </ModalShell>
  );
}

export default RevokeCertificateModal;
