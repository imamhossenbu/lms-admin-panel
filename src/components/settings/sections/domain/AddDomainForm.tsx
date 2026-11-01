"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Globe, Plus } from "lucide-react";
import { customDomainSchema, type CustomDomainFormInput, type CustomDomainFormValues } from "@/validations/saasSchema";
import { addCustomDomain } from "@/lib/saasStorage";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { errorMessage } from "@/components/billing/shared/billingFormat";

/** "learn.yourschool.com" + Add domain (zod-validated, loading → success/error toasts). */
export function AddDomainForm({ institutionId }: { institutionId: string }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomDomainFormInput, unknown, CustomDomainFormValues>({
    resolver: zodResolver(customDomainSchema),
    mode: "onTouched",
    defaultValues: { domain: "" },
  });

  const submit = async ({ domain }: CustomDomainFormValues) => {
    const id = toast.loading("Adding domain...", { description: domain });
    try {
      await addCustomDomain(institutionId, domain);
      toast.success("Domain added", { id, description: `Add the DNS records below, then click "Verify now".` });
      reset();
    } catch (err) {
      const msg = errorMessage(err);
      setError("domain", { message: msg });
      toast.error("Couldn't add domain", { id, description: msg });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <InputField
        id="custom-domain"
        aria-label="Custom domain"
        placeholder="learn.yourschool.com"
        autoComplete="off"
        spellCheck={false}
        leftElement={<Globe className="h-4 w-4" />}
        error={errors.domain?.message}
        containerClassName="flex-1"
        {...register("domain")}
      />
      <PrimaryButton type="submit" isLoading={isSubmitting} leftIcon={<Plus />} className="shrink-0">
        {isSubmitting ? "Adding..." : "Add domain"}
      </PrimaryButton>
    </form>
  );
}

export default AddDomainForm;
