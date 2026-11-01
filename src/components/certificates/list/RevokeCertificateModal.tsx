"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Ban } from "lucide-react";
import { revokeCertificateSchema, type RevokeCertificateValues } from "@/validations/certificateSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { REVOKE_REASON_OPTIONS, revokeReasonText, type IssuedRow } from "./certificateListUtils";

export interface RevokeCertificateModalProps {
  isOpen: boolean;
  /** One row (row menu) or many (bulk). */
  rows: IssuedRow[];
  onClose: () => void;
  /** Throw to keep the modal open (the caller shows the toast). */
  onConfirm: (reason: string, notifyLearner: boolean) => Promise<unknown>;
}

const DEFAULTS: RevokeCertificateValues = { reason: "ISSUED_IN_ERROR", details: "", notifyLearner: true };

/** Reason (required) + details (required for "Other") + notify toggle, validated by revokeCertificateSchema. */
export function RevokeCertificateModal({ isOpen, rows, onClose, onConfirm }: RevokeCertificateModalProps) {
  const formId = useId();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RevokeCertificateValues>({ resolver: zodResolver(revokeCertificateSchema), mode: "onTouched", defaultValues: DEFAULTS });
  const reason = useWatch({ control, name: "reason" });

  useEffect(() => {
    if (isOpen) reset(DEFAULTS);
  }, [isOpen, reset]);

  const submit = async (v: RevokeCertificateValues) => {
    try {
      await onConfirm(revokeReasonText(v.reason, v.details), v.notifyLearner);
      onClose();
    } catch {
      /* toast shown by caller */
    }
  };

  const single = rows.length === 1 ? rows[0] : null;
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={single ? "Revoke Certificate" : `Revoke ${rows.length} Certificates`}
      subtitle={single ? `${single.cert.code} · ${single.cert.recipient.name}` : "The selected valid certificates will be revoked."}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} variant="danger" isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Ban className="h-4 w-4" />}>
            {isSubmitting ? "Revoking..." : single ? "Revoke Certificate" : "Revoke All"}
          </PrimaryButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
        <div className="flex items-start gap-3 rounded-xl border border-red/30 bg-red-14 p-3.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red" />
          <p className="body-sm-regular text-red-dark">
            Revoked certificates fail public verification immediately. You can restore them later from the row menu.
          </p>
        </div>
        <div>
          <label className="mb-2 block body-sm-medium text-primary-500">
            Reason <span className="text-red">*</span>
          </label>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <AppSelect value={field.value} onValueChange={field.onChange} options={REVOKE_REASON_OPTIONS} className="w-full" triggerClassName={`w-full h-10 bg-white ${errors.reason ? "border-red" : ""}`} />
            )}
          />
          {errors.reason?.message && <p className="mt-1.5 body-xsm-regular text-red">{errors.reason.message}</p>}
        </div>
        <div>
          <label htmlFor={`${formId}-details`} className="mb-2 block body-sm-medium text-primary-500">
            Details {reason === "OTHER" ? <span className="text-red">*</span> : <span className="body-xsm-regular text-primary-300">(optional)</span>}
          </label>
          <TextAreaField id={`${formId}-details`} rows={3} placeholder="Add context for the audit log..." error={errors.details?.message} {...register("details")} />
        </div>
        <Controller
          control={control}
          name="notifyLearner"
          render={({ field }) => (
            <SettingToggleRow
              title={single ? "Notify the learner by email" : "Notify the learners by email"}
              description="Explains that the certificate is no longer valid."
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
