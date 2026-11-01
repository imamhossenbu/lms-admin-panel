"use client";

import React from "react";
import { motion } from "framer-motion";
import { ReviewEditButton } from "./ReviewEditButton";

export interface ReviewSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export const reviewSectionMotion = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" as const } },
};

/** Bordered review block: icon tile, title/subtitle, Edit action and body. */
export function ReviewSection({ icon, title, subtitle, onEdit, children }: ReviewSectionProps) {
  return (
    <motion.section variants={reviewSectionMotion} className="rounded-xl border border-dash p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <span className="hidden sm:flex w-11 h-11 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue [&>svg]:w-5 [&>svg]:h-5">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 border-b border-dash pb-3 mb-3">
            <div className="min-w-0">
              <h3 className="title-sm font-semibold text-primary-500">{title}</h3>
              <p className="body-sm-regular text-primary-300 mt-0.5">{subtitle}</p>
            </div>
            <ReviewEditButton onClick={onEdit} label={`Edit ${title}`} />
          </div>
          {children}
        </div>
      </div>
    </motion.section>
  );
}

export default ReviewSection;
