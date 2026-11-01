"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SecondaryButton from "@/components/ui/secondary-button";
import { PreviewLearnChecklist } from "./PreviewLearnChecklist";
import { PreviewStatsGrid } from "./PreviewStatsGrid";
import { PreviewThumbnailHero } from "./PreviewThumbnailHero";

export interface CourseReviewPreviewCardProps {
  title: string;
  shortDescription: string;
  thumbnail?: string;
  stats: { modules: number; lessons: number; totalMinutes: number };
  levelLabel: string;
  language: string;
  priceLabel: string;
  learnItems: string[];
  onViewCourse: () => void;
}

/** Step 5 right column: how the course will look to students. */
export function CourseReviewPreviewCard({
  title,
  shortDescription,
  thumbnail,
  stats,
  levelLabel,
  language,
  priceLabel,
  learnItems,
  onViewCourse,
}: CourseReviewPreviewCardProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      className="bg-white rounded-xl border border-dash shadow-2xs p-5 text-left"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="heading-h5 font-bold text-primary-500">Course Preview</h2>
          <p className="body-sm-regular text-primary-300 mt-0.5">This is how your course will appear to students.</p>
        </div>
        <SecondaryButton size="sm" icon={<ExternalLink />} onClick={onViewCourse}>
          View Course
        </SecondaryButton>
      </div>

      <div className="space-y-4">
        <PreviewThumbnailHero thumbnail={thumbnail} title={title} />
        <div>
          <h3 className="title-medium font-bold text-primary-500 break-words">{title || "Untitled course"}</h3>
          <p className="body-sm-regular text-primary-300 mt-1.5 break-words">
            {shortDescription || "Add a short description to tell students what this course is about."}
          </p>
        </div>
        <div className="border-b border-dash pb-4">
          <PreviewStatsGrid stats={stats} levelLabel={levelLabel} language={language} priceLabel={priceLabel} />
        </div>
        <PreviewLearnChecklist items={learnItems} />
      </div>
    </motion.aside>
  );
}

export default CourseReviewPreviewCard;
