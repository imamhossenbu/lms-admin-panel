"use client";

import React, { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, SquarePen, Save } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { OrderItem } from "@/types/order";
import { AdditionalInfoInput } from "@/lib/orderActions";
import { additionalInfoSchema, AdditionalInfoFormInput, REFERRAL_SOURCES } from "@/validations/orderSchema";

interface AdditionalInfoCardProps {
  order: OrderItem;
  showReferral?: boolean;
  /** Throw to keep the edit modal open. */
  onSave: (order: OrderItem, input: AdditionalInfoInput) => Promise<void>;
  /** Controlled open state so header buttons (e.g. "Edit Order") can open the editor. */
  isEditing?: boolean;
  onEditingChange?: (open: boolean) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="body-sm-regular text-primary-400 w-32 shrink-0">{label}</span>
      <div className="body-sm-regular text-primary-500 min-w-0 flex-1 break-words">{children}</div>
    </div>
  );
}

export function AdditionalInfoCard({ order, showReferral = true, onSave, isEditing, onEditingChange }: AdditionalInfoCardProps) {
  const formId = useId();
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = isEditing ?? localOpen;
  const setOpen = onEditingChange ?? setLocalOpen;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdditionalInfoFormInput>({ resolver: zodResolver(additionalInfoSchema), mode: "onTouched" });

  useEffect(() => {
    if (isOpen) {
      reset({
        referralSource: (REFERRAL_SOURCES as readonly string[]).includes(order.referralSource)
          ? (order.referralSource as AdditionalInfoFormInput["referralSource"])
          : "Other",
        couponCode: order.couponCode ?? "",
        notes: order.notes ?? "",
      });
    }
  }, [isOpen, order, reset]);

  const submit = async (data: AdditionalInfoFormInput) => {
    try {
      await onSave(order, data);
      setOpen(false);
    } catch {
      // toast shown by caller
    }
  };

  return (
    <DetailCard
      title="Additional Information"
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-9 px-3.5 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          Edit
        </button>
      }
    >
      <div className="space-y-3">
        <Row label="IP Address">{order.ipAddress}</Row>
        <Row label="Device">
          <span className="inline-flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary-300" />
            {order.device}
          </span>
        </Row>
        {showReferral && <Row label="Referral Source">{order.referralSource}</Row>}
        <Row label="Coupon Code">{order.couponCode ?? "—"}</Row>
        <Row label="Notes">{order.notes ?? "—"}</Row>
      </div>

      <ModalShell
        isOpen={isOpen}
        onClose={isSubmitting ? () => {} : () => setOpen(false)}
        title="Edit Additional Information"
        subtitle={order.orderNumber}
        maxWidth="md"
        footer={
          <>
            <SecondaryButton type="button" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
          <div>
            <label className="block body-sm-medium text-primary-500 mb-2">
              Referral Source <span className="text-red">*</span>
            </label>
            <Controller
              control={control}
              name="referralSource"
              render={({ field }) => (
                <AppSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Select source"
                  options={[...REFERRAL_SOURCES]}
                  className="w-full"
                  triggerClassName={`w-full h-10 bg-white ${errors.referralSource ? "border-red" : ""}`}
                />
              )}
            />
            {errors.referralSource?.message && <p className="body-xsm-regular text-red mt-1">{errors.referralSource.message}</p>}
          </div>
          <InputField
            id={`${formId}-coupon`}
            label={<span className="body-sm-medium text-primary-500">Coupon Code</span>}
            placeholder="e.g. WELCOME10"
            error={errors.couponCode?.message}
            {...register("couponCode")}
          />
          <div>
            <label htmlFor={`${formId}-notes`} className="block body-sm-medium text-primary-500 mb-2">
              Notes
            </label>
            <textarea
              id={`${formId}-notes`}
              rows={3}
              placeholder="Anything other admins should know about this purchase"
              className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
                errors.notes ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
              }`}
              {...register("notes")}
            />
            {errors.notes?.message && <p className="body-xsm-regular text-red mt-1">{errors.notes.message}</p>}
          </div>
        </form>
      </ModalShell>
    </DetailCard>
  );
}

export default AdditionalInfoCard;
