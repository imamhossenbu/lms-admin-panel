"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Headset, Send } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { FieldLabel } from "@/components/ui/SelectField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { wait } from "../shared/billingFormat";

const contactSalesSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "80 characters or less"),
  email: z.string().trim().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email address"),
  students: z
    .string()
    .trim()
    .min(1, "Roughly how many students?")
    .regex(/^\d{1,7}$/, "Enter a number"),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(1000, "1000 characters or less"),
});

type ContactSalesValues = z.infer<typeof contactSalesSchema>;

export interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName: string;
  defaultEmail: string;
}

/** Enterprise enquiry form (mock submission). */
export function ContactSalesModal({ isOpen, onClose, defaultName, defaultEmail }: ContactSalesModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSalesValues>({
    resolver: zodResolver(contactSalesSchema),
    mode: "onTouched",
    defaultValues: { name: defaultName, email: defaultEmail, students: "", message: "" },
  });

  const submit = async (values: ContactSalesValues) => {
    const id = toast.loading("Sending your request...", { description: "Connecting you with our sales team." });
    try {
      await wait(800);
      toast.success("Request sent", { id, description: `We'll email ${values.email} within one business day.` });
      reset();
      onClose();
    } catch {
      toast.error("Couldn't send your request", { id, description: "Please try again in a moment." });
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Talk to sales about Enterprise"
      subtitle="Unlimited scale, SSO, dedicated success manager and custom contracts."
      titleIcon={<Headset className="text-brand-orange" />}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="contact-sales-form" isLoading={isSubmitting} leftIcon={<Send />}>
            {isSubmitting ? "Sending..." : "Send request"}
          </PrimaryButton>
        </>
      }
    >
      <form id="contact-sales-form" noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField id="cs-name" label="Your name" required error={errors.name?.message} {...register("name")} />
          <InputField id="cs-email" label="Work email" type="email" required error={errors.email?.message} {...register("email")} />
        </div>
        <InputField id="cs-students" label="Expected students" required inputMode="numeric" placeholder="e.g. 5000" error={errors.students?.message} {...register("students")} />
        <div>
          <FieldLabel htmlFor="cs-message">What do you need? *</FieldLabel>
          <TextAreaField id="cs-message" rows={4} placeholder="SSO, custom integrations, volume pricing…" error={errors.message?.message} {...register("message")} />
        </div>
      </form>
    </ModalShell>
  );
}

export default ContactSalesModal;
