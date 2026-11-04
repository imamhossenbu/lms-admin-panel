"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { COURSE_PRICE_MAX, type CoursePublishInput } from "@/validations/coursePublishSchema";
import { priceInfoText } from "./pricingLabels";
import { PricingSectionHeader } from "./PricingSectionHeader";
import { currencySymbol } from "@/lib/money";

/** Workspace-currency (৳) price input (locked for free courses) with a contextual info note. */
export function PriceField() {
  const { control } = useFormContext<CoursePublishInput>();
  const [priceType, price] = useWatch({ control, name: ["priceType", "price"] });
  const isFree = priceType === "FREE";
  const info = priceInfoText({ priceType, price });

  return (
    <section>
      <PricingSectionHeader title="Price" description="Set the price for your course (USD)." htmlFor="course-price" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Controller
          control={control}
          name="price"
          render={({ field, fieldState }) => (
            <InputField
              id="course-price"
              type="number"
              inputMode="decimal"
              min={0}
              max={COURSE_PRICE_MAX}
              step="0.01"
              placeholder="0.00"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              disabled={isFree}
              value={Number.isNaN(field.value) ? "" : isFree ? "" : field.value}
              onChange={(e) => field.onChange(e.target.value === "" ? Number.NaN : e.target.valueAsNumber)}
              error={fieldState.error?.message}
              leftElement={<span className="body-sm-medium text-primary-400">{currencySymbol()}</span>}
              aria-invalid={!!fieldState.error}
              className="disabled:bg-gray-bg disabled:text-primary-300 disabled:cursor-not-allowed"
            />
          )}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={info}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-start gap-2.5 rounded-xl border border-blue/20 bg-blue-14 px-3.5 py-2.5"
          >
            <Info className="w-4.5 h-4.5 text-blue shrink-0 mt-0.5" />
            <p className="body-xsm-regular text-primary-400">{info}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default PriceField;
