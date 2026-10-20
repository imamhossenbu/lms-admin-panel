"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, SettingsInput } from "@/validations/settingsSchema";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SectionCard } from "@/components/ui/SectionCard";
import { toast } from "sonner";

export function SettingsFormClient() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "LMS AI Platform",
      supportEmail: "support@lms-ai.com",
      primaryColor: "#1C4D8D",
      secondaryColor: "#4988C4",
      maintenanceMode: false,
    },
  });

  const onSubmit = (data: SettingsInput) => {
    toast.success("Platform settings updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <SectionCard
        title="White-Label Identity & Branding"
        description="Configure client-facing application name and brand identity."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Platform Title"
            {...register("siteName")}
            error={errors.siteName?.message}
          />
          <InputField
            label="Support Email"
            type="email"
            {...register("supportEmail")}
            error={errors.supportEmail?.message}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Color Schema Tokens"
        description="Theme palette used across student portals and certificate badges."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1C4D8D] border border-[#EDEDED] shrink-0" />
            <InputField
              label="Primary Brand Color"
              {...register("primaryColor")}
              error={errors.primaryColor?.message}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4988C4] border border-[#EDEDED] shrink-0" />
            <InputField
              label="Accent Brand Color"
              {...register("secondaryColor")}
              error={errors.secondaryColor?.message}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="System Maintenance"
        description="Temporarily redirect student traffic during scheduled updates."
      >
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#EDEDED]">
          <div>
            <span className="body-sm-medium text-primary-500 font-semibold">Maintenance Lockdown</span>
            <p className="body-xsm-regular subtext-500">Only administrators can authenticate</p>
          </div>
          <input
            type="checkbox"
            {...register("maintenanceMode")}
            className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
          />
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <PrimaryButton type="submit" isLoading={isSubmitting}>
          Save Platform Configuration
        </PrimaryButton>
      </div>
    </form>
  );
}
