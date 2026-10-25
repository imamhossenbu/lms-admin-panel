"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { instructorMessageSchema, InstructorMessageInput } from "@/validations/instructorSchema";
import { InstructorItem } from "@/types/instructor";

interface SendMessageModalProps {
  isOpen: boolean;
  instructor: InstructorItem;
  onClose: () => void;
}

const FORM_ID = "instructor-message-form";

export function SendMessageModal({ isOpen, instructor, onClose }: SendMessageModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InstructorMessageInput>({
    resolver: zodResolver(instructorMessageSchema),
    mode: "onTouched",
    defaultValues: { subject: "", body: "" },
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: InstructorMessageInput) => {
    const toastId = toast.loading("Sending message...", {
      description: `Delivering to ${instructor.email}`,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Message sent", {
        id: toastId,
        description: `"${data.subject}" was sent to ${instructor.name}.`,
      });
      onClose();
    } catch {
      toast.error("Message not sent", {
        id: toastId,
        description: "We couldn't deliver your message. Please try again.",
      });
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`Message ${instructor.name}`}
      subtitle={`The message will be emailed to ${instructor.email}.`}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form={FORM_ID}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </PrimaryButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 text-left">
        <InputField
          id="message-subject"
          label="Subject"
          required
          placeholder="e.g. Course review feedback"
          error={errors.subject?.message}
          {...register("subject")}
        />

        <div>
          <label htmlFor="message-body" className="block body-sm-regular text-primary-400 mb-2">
            Message <span className="text-red">*</span>
          </label>
          <textarea
            id="message-body"
            rows={5}
            placeholder="Write your message to the instructor..."
            className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
              errors.body ? "border-red bg-red-14 focus:border-red" : "border-dash bg-white focus:border-brand-orange"
            }`}
            {...register("body")}
          />
          {errors.body?.message && (
            <p className="body-xsm-regular text-red mt-1">{errors.body.message}</p>
          )}
        </div>
      </form>
    </ModalShell>
  );
}

export default SendMessageModal;
