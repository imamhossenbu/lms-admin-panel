"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { CourseSummaryPricing } from "./CourseSummaryPricing";
import { CourseSummaryStats } from "./CourseSummaryStats";
import { SummaryEditButton } from "./SummaryEditButton";

export interface CourseSummaryCardProps {
  heading: string;
  subheading: string;
  title: string;
  shortDescription: string;
  thumbnail?: string;
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  levelLabel: string;
  language: string;
  onEdit?: () => void;
  onEditThumbnail?: () => void;
  /** When given, renders the Pricing & Access block (reads CoursePublishInput from form context). */
  onEditPricing?: () => void;
}

/** Right-column overview card (Step 3 "Course Summary", Step 4 "Course Preview"). */
export function CourseSummaryCard({
  heading,
  subheading,
  title,
  shortDescription,
  thumbnail,
  moduleCount,
  lessonCount,
  totalMinutes,
  levelLabel,
  language,
  onEdit,
  onEditThumbnail,
  onEditPricing,
}: CourseSummaryCardProps) {
  const displayTitle = title.trim() || "Untitled course";

  return (
    <motion.aside
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-5 text-left"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="heading-h5 font-bold text-primary-500">{heading}</h2>
          <p className="body-sm-regular text-primary-300 mt-0.5">{subheading}</p>
        </div>
        {onEdit && <SummaryEditButton onClick={onEdit} label="Edit course details" />}
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dash">
        {thumbnail ? (
          <Image src={thumbnail} alt={displayTitle} fill unoptimized sizes="480px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-end bg-gradient-to-br from-brand-navy via-brand-surface to-brand-card p-4">
            <p className="heading-h5 font-bold text-white line-clamp-2">{displayTitle}</p>
          </div>
        )}
        {onEditThumbnail && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={onEditThumbnail}
            aria-label="Edit thumbnail"
            className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-lg bg-brand-dark/85 px-2.5 py-1.5 body-xsm-medium text-white hover:bg-brand-dark transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Edit
          </motion.button>
        )}
      </div>

      <h3 className="title-medium font-bold text-primary-500 mt-4">{displayTitle}</h3>
      {shortDescription.trim() && (
        <p className="body-sm-regular text-primary-300 mt-1.5 line-clamp-3">{shortDescription}</p>
      )}

      <CourseSummaryStats
        className="space-y-3 mt-4"
        moduleCount={moduleCount}
        lessonCount={lessonCount}
        totalMinutes={totalMinutes}
        levelLabel={levelLabel}
        language={language}
      />

      {onEditPricing && <CourseSummaryPricing onEdit={onEditPricing} />}
    </motion.aside>
  );
}

export default CourseSummaryCard;
