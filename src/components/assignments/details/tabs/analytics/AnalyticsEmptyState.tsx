"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Users } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Whole-tab empty state when there are no graded submissions to analyse yet. */
export function AnalyticsEmptyState({ isDraft, submitted, onViewSubmissions }: { isDraft: boolean; submitted: number; onViewSubmissions: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="dashboard-card flex flex-col items-center px-6 py-14 text-center shadow-2xs"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-14 text-blue">
        <BarChart3 className="h-7 w-7" />
      </span>
      <h3 className="mt-4 heading-h6 text-primary-500">No analytics yet</h3>
      <p className="mt-1.5 max-w-md body-sm-regular text-primary-300">
        {isDraft
          ? "This assignment is still a draft. Publish it so students can submit — score charts and insights appear once work is graded."
          : submitted > 0
            ? `${submitted} submission${submitted === 1 ? " is" : "s are"} waiting for review. Grade them to unlock score distribution, trends and insights.`
            : "No students have submitted yet. Charts and insights appear once submissions are graded."}
      </p>
      {submitted > 0 && (
        <PrimaryButton size="sm" leftIcon={<Users />} onClick={onViewSubmissions} className="mt-5">
          Review Submissions
        </PrimaryButton>
      )}
    </motion.div>
  );
}

export default AnalyticsEmptyState;
