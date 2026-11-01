"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, Tag } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { accessSummaryLabel, priceSummaryLabel } from "./pricingLabels";
import { SummaryEditButton } from "./SummaryEditButton";

interface CourseSummaryPricingProps {
  onEdit: () => void;
}

/** "Pricing & Access" block of the summary card; reads live values from the publish form. */
export function CourseSummaryPricing({ onEdit }: CourseSummaryPricingProps) {
  const { control } = useFormContext<CoursePublishInput>();
  const [priceType, price, enrollment, accessDuration, accessDays] = useWatch({
    control,
    name: ["priceType", "price", "enrollment", "accessDuration", "accessDays"],
  });
  const isFree = priceType === "FREE";
  const Icon = isFree ? Gift : Tag;

  return (
    <div className="pt-5 mt-5 border-t border-dash">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="title-medium text-primary-500">Pricing &amp; Access</h3>
        <SummaryEditButton onClick={onEdit} label="Edit pricing and access" />
      </div>
      <motion.div
        layout
        className={
          isFree
            ? "flex items-center gap-3 rounded-xl border border-green/30 bg-green-bg p-4"
            : "flex items-center gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange-light p-4"
        }
      >
        <Icon className={isFree ? "w-6 h-6 text-green shrink-0" : "w-6 h-6 text-brand-orange shrink-0"} />
        <div className="min-w-0">
          <p className={isFree ? "body-sm-medium text-green" : "body-sm-medium text-brand-orange"}>
            {priceSummaryLabel({ priceType, price })}
          </p>
          <p className="body-xsm-regular text-primary-400 mt-0.5">
            {accessSummaryLabel({ enrollment, accessDuration, accessDays })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default CourseSummaryPricing;
