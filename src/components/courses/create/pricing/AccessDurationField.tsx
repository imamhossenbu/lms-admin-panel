"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { ACCESS_DURATION_OPTIONS } from "./pricingOptions";
import { NumberStepperInput } from "./NumberStepperInput";
import { PricingSectionHeader } from "./PricingSectionHeader";

/** Lifetime / Limited (with days input) / Subscription access. */
export function AccessDurationField() {
  const { control } = useFormContext<CoursePublishInput>();
  const accessDuration = useWatch({ control, name: "accessDuration" });

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-x-5 gap-y-2 items-start">
      <PricingSectionHeader
        className="lg:col-span-2 mb-0"
        title="Access Duration"
        description="How long will students have access to the course?"
      />
      <div className="lg:col-span-3 space-y-3">
        <Controller
          control={control}
          name="accessDuration"
          render={({ field }) => (
            <ChoiceCardGroup
              name={field.name}
              aria-label="Access duration"
              columns={3}
              value={field.value}
              onChange={field.onChange}
              options={ACCESS_DURATION_OPTIONS}
            />
          )}
        />
        <AnimatePresence initial={false}>
          {accessDuration === "LIMITED" && (
            <motion.div
              key="access-days"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <label htmlFor="course-access-days" className="block body-sm-medium text-primary-500 mb-2">
                Access (days)
              </label>
              <Controller
                control={control}
                name="accessDays"
                render={({ field, fieldState }) => (
                  <NumberStepperInput
                    id="course-access-days"
                    name={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    min={1}
                    max={3650}
                    placeholder="365"
                    error={fieldState.error?.message}
                    className="sm:max-w-48"
                  />
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default AccessDurationField;
