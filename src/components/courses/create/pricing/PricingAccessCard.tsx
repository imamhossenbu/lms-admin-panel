"use client";

import React from "react";
import { motion } from "framer-motion";
import { AccessDurationField } from "./AccessDurationField";
import { EnrollmentField } from "./EnrollmentField";
import { EnrollmentLimitField } from "./EnrollmentLimitField";
import { PriceField } from "./PriceField";
import { PriceTypeField } from "./PriceTypeField";

/** Step 3: price type, price, enrollment and access settings (reads `CoursePublishInput` form context). */
export function PricingAccessCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs text-left"
    >
      <header className="px-5 py-4 border-b border-dash">
        <h2 className="heading-h5 text-primary-500">Pricing &amp; Access</h2>
        <p className="body-sm-regular text-primary-400 mt-1">
          Set the price for your course and configure enrollment options.
        </p>
      </header>
      <div className="p-5 space-y-6">
        <PriceTypeField />
        <PriceField />
        <EnrollmentField />
        <EnrollmentLimitField />
        <AccessDurationField />
      </div>
    </motion.section>
  );
}

export default PricingAccessCard;
