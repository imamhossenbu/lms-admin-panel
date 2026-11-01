"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";

export interface CreateCourseStepFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  /** Replaces the default arrow (e.g. a send icon for "Publish Course"). Shown on the left when given. */
  nextIcon?: React.ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  backLabel?: string;
}

/** Bottom action bar for Create Course steps 3–5: "Previous" on the left, primary "Next" on the right. */
export function CreateCourseStepFooter({
  onBack,
  onNext,
  nextLabel,
  nextIcon,
  isLoading = false,
  loadingLabel = "Saving...",
  disabled = false,
  backLabel = "Previous",
}: CreateCourseStepFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
      className="flex items-center justify-between gap-3 border-t border-dash pt-5"
    >
      <SecondaryButton type="button" onClick={onBack} disabled={isLoading} leftIcon={<ArrowLeft />}>
        {backLabel}
      </SecondaryButton>
      <PrimaryButton
        type="button"
        onClick={onNext}
        isLoading={isLoading}
        disabled={disabled}
        leftIcon={nextIcon}
        rightIcon={nextIcon ? undefined : <ArrowRight />}
        className="edupro-glow-btn"
      >
        {isLoading ? loadingLabel : nextLabel}
      </PrimaryButton>
    </motion.div>
  );
}

export default CreateCourseStepFooter;
