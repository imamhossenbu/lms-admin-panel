"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { CoursePreviewContent, type CoursePreviewContentProps } from "./preview/CoursePreviewContent";

interface CoursePreviewCardProps extends Omit<CoursePreviewContentProps, "size"> {
  onExpand: () => void;
}

/** Sticky right-column card that mirrors the form live. */
export function CoursePreviewCard({ onExpand, ...contentProps }: CoursePreviewCardProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      className="bg-white rounded-xl border border-dash shadow-2xs p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="heading-h5 font-bold text-primary-500">Course Preview</h2>
        <button
          type="button"
          onClick={onExpand}
          aria-label="Open full preview"
          title="Open full preview"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-brand-orange hover:bg-brand-orange-light transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4.5 h-4.5" />
        </button>
      </div>
      <CoursePreviewContent {...contentProps} size="compact" />
    </motion.aside>
  );
}

export default CoursePreviewCard;
