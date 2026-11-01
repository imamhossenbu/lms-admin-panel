"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { PRICE_TYPE_OPTIONS } from "./pricingOptions";
import { PricingSectionHeader } from "./PricingSectionHeader";

/** Free / One-time / Subscription / Bundle. Choosing Free resets the price to 0. */
export function PriceTypeField() {
  const { control, setValue, clearErrors } = useFormContext<CoursePublishInput>();

  return (
    <section>
      <PricingSectionHeader title="Price Type" description="Choose how you want to offer this course." />
      <Controller
        control={control}
        name="priceType"
        render={({ field }) => (
          <ChoiceCardGroup
            name={field.name}
            aria-label="Price type"
            columns={4}
            value={field.value}
            options={PRICE_TYPE_OPTIONS}
            onChange={(next) => {
              field.onChange(next);
              if (next === "FREE") {
                setValue("price", 0, { shouldDirty: true });
                clearErrors("price");
              }
            }}
          />
        )}
      />
    </section>
  );
}

export default PriceTypeField;
