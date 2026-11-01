"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { COURSE_ENROLLMENT_LIMIT_MAX, type CoursePublishInput } from "@/validations/coursePublishSchema";
import { NumberStepperInput } from "./NumberStepperInput";
import { PricingSectionHeader } from "./PricingSectionHeader";

/** Optional seat cap (0 = unlimited). */
export function EnrollmentLimitField() {
  const { control } = useFormContext<CoursePublishInput>();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-x-5 gap-y-2 items-start">
      <PricingSectionHeader
        className="lg:col-span-2 mb-0"
        title="Enrollment Limit"
        optional
        htmlFor="course-enrollment-limit"
        description="Limit the number of students who can enroll."
      />
      <div className="lg:col-span-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
        <Controller
          control={control}
          name="enrollmentLimit"
          render={({ field, fieldState }) => (
            <NumberStepperInput
              id="course-enrollment-limit"
              name={field.name}
              inputRef={field.ref}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              min={0}
              max={COURSE_ENROLLMENT_LIMIT_MAX}
              placeholder="0"
              error={fieldState.error?.message}
              className="sm:max-w-48"
            />
          )}
        />
        <p className="body-xsm-regular text-primary-300 sm:mt-3 whitespace-nowrap">Set 0 for unlimited enrollment</p>
      </div>
    </section>
  );
}

export default EnrollmentLimitField;
