"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { ENROLLMENT_OPTIONS } from "./pricingOptions";
import { PricingSectionHeader } from "./PricingSectionHeader";

/** Open / Approval / Invitation-only enrollment. */
export function EnrollmentField() {
  const { control } = useFormContext<CoursePublishInput>();

  return (
    <section>
      <PricingSectionHeader title="Enrollment Settings" description="Configure how students can enroll in this course." />
      <Controller
        control={control}
        name="enrollment"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Enrollment settings"
            columns={3}
            value={field.value}
            onChange={field.onChange}
            options={ENROLLMENT_OPTIONS}
          />
        )}
      />
    </section>
  );
}

export default EnrollmentField;
