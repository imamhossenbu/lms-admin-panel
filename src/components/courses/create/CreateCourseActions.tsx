"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";

interface CreateCourseActionsProps {
  isContinuing: boolean;
  disabled: boolean;
  onCancel: () => void;
  onContinue: () => void;
}

export function CreateCourseActions({ isContinuing, disabled, onCancel, onContinue }: CreateCourseActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
      className="bg-white rounded-xl border border-dash shadow-2xs p-4 flex items-center justify-end gap-3"
    >
      <SecondaryButton onClick={onCancel} disabled={isContinuing}>
        Cancel
      </SecondaryButton>
      <PrimaryButton
        onClick={onContinue}
        isLoading={isContinuing}
        disabled={disabled}
        rightIcon={<ArrowRight />}
        className="edupro-glow-btn"
      >
        {isContinuing ? "Saving course..." : "Continue to Curriculum"}
      </PrimaryButton>
    </motion.div>
  );
}

export default CreateCourseActions;
