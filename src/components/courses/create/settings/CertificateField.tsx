"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { FeatureToggle } from "./FeatureToggle";
import { SettingsActionButton } from "./SettingsActionButton";

/** "Enable Certificate" toggle + "Customize Certificate" action. */
export function CertificateField() {
  const { control } = useFormContext<CoursePublishInput>();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <Controller
        control={control}
        name="certificateEnabled"
        render={({ field }) => (
          <FeatureToggle
            id="course-certificate"
            title="Enable Certificate"
            description="Students will receive a certificate after completing the course"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <SettingsActionButton
        icon={<Settings />}
        onClick={() => toast.info("Certificate designer is coming soon")}
      >
        Customize Certificate
      </SettingsActionButton>
    </div>
  );
}

export default CertificateField;
