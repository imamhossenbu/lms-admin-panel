"use client";

import React, { useEffect, useId, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Info } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { MOCK_STUDENTS } from "@/data/mockStudentData";
import { ORDER_COURSES } from "@/data/mockOrderData";
import { CreateOrderInput, KNOWN_COUPONS, couponDiscount } from "@/lib/orderActions";
import { createOrderSchema, CreateOrderFormInput, PAYMENT_METHOD_OPTIONS } from "@/validations/orderSchema";
import { formatCurrency } from "./orderFormat";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Throw to keep the modal open. */
  onCreate: (input: CreateOrderInput) => Promise<void>;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="body-xsm-regular text-red mt-1">{message}</p> : null;

/** Admin-created order (e.g. bank transfer / offline enrollment). */
export function CreateOrderModal({ isOpen, onClose, onCreate }: CreateOrderModalProps) {
  const formId = useId();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderFormInput>({
    resolver: zodResolver(createOrderSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isOpen) reset({ studentId: "", courseId: "", couponCode: "", markAsPaid: false, reference: "", note: "" });
  }, [isOpen, reset]);

  const [courseId, couponCode, markAsPaid] = useWatch({ control, name: ["courseId", "couponCode", "markAsPaid"] });
  const price = ORDER_COURSES.find((c) => c.id === courseId)?.price;
  const couponValid = !!couponCode && KNOWN_COUPONS.includes(couponCode.toUpperCase());

  const studentOptions = useMemo(
    () => MOCK_STUDENTS.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` })),
    []
  );

  const submit = async (data: CreateOrderFormInput) => {
    try {
      await onCreate({ ...data, couponCode: data.couponCode || undefined, note: data.note || undefined });
      onClose();
    } catch {
      // toast shown by caller
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Create Order"
      subtitle="Create a manual order, e.g. for bank transfers or offline enrollment."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Plus className="w-4 h-4" />}>
            {isSubmitting ? "Creating..." : "Create Order"}
          </PrimaryButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
        <div>
          <label className="block body-sm-medium text-primary-500 mb-2">
            Student <span className="text-red">*</span>
          </label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <AppSelect
                value={field.value ?? ""}
                onValueChange={field.onChange}
                placeholder="Select a student"
                options={studentOptions}
                className="w-full"
                triggerClassName={`w-full h-10 bg-white ${errors.studentId ? "border-red" : ""}`}
              />
            )}
          />
          <FieldError message={errors.studentId?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block body-sm-medium text-primary-500 mb-2">
              Course <span className="text-red">*</span>
            </label>
            <Controller
              control={control}
              name="courseId"
              render={({ field }) => (
                <AppSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Select a course"
                  options={ORDER_COURSES.map((c) => ({ value: c.id, label: `${c.title} · ${formatCurrency(c.price)}` }))}
                  className="w-full"
                  triggerClassName={`w-full h-10 bg-white ${errors.courseId ? "border-red" : ""}`}
                />
              )}
            />
            <FieldError message={errors.courseId?.message} />
          </div>
          <div>
            <label className="block body-sm-medium text-primary-500 mb-2">
              Payment Method <span className="text-red">*</span>
            </label>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <AppSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Select method"
                  options={[...PAYMENT_METHOD_OPTIONS]}
                  className="w-full"
                  triggerClassName={`w-full h-10 bg-white ${errors.method ? "border-red" : ""}`}
                />
              )}
            />
            <FieldError message={errors.method?.message} />
          </div>
        </div>

        <InputField
          id={`${formId}-coupon`}
          label={<span className="body-sm-medium text-primary-500">Coupon Code (optional)</span>}
          placeholder={`e.g. ${KNOWN_COUPONS.join(" or ")}`}
          error={errors.couponCode?.message}
          {...register("couponCode")}
        />
        {couponCode && !errors.couponCode && (
          <p className={`body-xsm-regular -mt-2 ${couponValid ? "text-green" : "text-yellow"}`}>
            {couponValid ? "Coupon will be applied." : "Unknown coupon. It will be ignored."}
          </p>
        )}

        <Controller
          control={control}
          name="markAsPaid"
          render={({ field }) => (
            <ToggleSwitch id={`${formId}-paid`} checked={!!field.value} onChange={field.onChange} label="Payment already received (mark as paid)" />
          )}
        />
        {markAsPaid ? (
          <InputField
            id={`${formId}-reference`}
            label={<span className="body-sm-medium text-primary-500">Transaction / Reference ID</span>}
            required
            placeholder="e.g. 9A7XK2LM01"
            error={errors.reference?.message}
            {...register("reference")}
          />
        ) : (
          <p className="flex items-start gap-2 body-xsm-regular text-primary-400">
            <Info className="w-4 h-4 shrink-0 text-blue" />
            The order will be created as Processing until payment is received.
          </p>
        )}

        <div>
          <label htmlFor={`${formId}-note`} className="block body-sm-medium text-primary-500 mb-2">
            Admin Note (optional)
          </label>
          <textarea
            id={`${formId}-note`}
            rows={2}
            className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
              errors.note ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
            }`}
            placeholder="Why was this order created manually?"
            {...register("note")}
          />
          <FieldError message={errors.note?.message} />
        </div>

        {price !== undefined && (
          <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-dash px-4 py-3">
            <span className="body-sm-regular text-primary-400">Order total</span>
            <span className="body-medium font-semibold text-primary-500">
              {formatCurrency(price - couponDiscount(couponCode, price))}
            </span>
          </div>
        )}
      </form>
    </ModalShell>
  );
}

export default CreateOrderModal;
