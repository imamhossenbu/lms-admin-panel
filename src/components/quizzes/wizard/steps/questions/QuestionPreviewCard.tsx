"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, FileText } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface QuestionPreviewCardProps {
  disabled?: boolean;
  onPreview: () => void;
}

/** "Question Preview (Student View)" side card with a "Preview Question" button. */
export function QuestionPreviewCard({ disabled, onPreview }: QuestionPreviewCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-dash bg-gray-bg p-4"
    >
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
        <div className="min-w-0">
          <p className="body-sm-medium font-semibold! text-primary-500">Question Preview (Student View)</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">See how this question will appear to students.</p>
        </div>
      </div>
      <SecondaryButton type="button" fullWidth leftIcon={<Eye />} disabled={disabled} onClick={onPreview} className="mt-3">
        Preview Question
      </SecondaryButton>
    </motion.section>
  );
}

export default QuestionPreviewCard;
