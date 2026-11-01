"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatMinutes } from "@/components/courses/create/aiOutline";
import type { LessonEditorCourse } from "@/types/lessonEditor";
import { cn } from "@/lib/cn";
import { MediaThumbnail } from "./fields/MediaThumbnail";

export interface CourseSummaryBannerProps {
  course: LessonEditorCourse;
  /** Smaller thumbnail + title for page headers (Assignments list). */
  compact?: boolean;
}

/** Course card above the tab bar: 16:9 thumbnail, title, status badge and module/lesson/time stats. */
export function CourseSummaryBanner({ course, compact = false }: CourseSummaryBannerProps) {
  const isPublished = course.status === "PUBLISHED";
  const stats = [`${course.moduleCount} Modules`, `${course.lessonCount} Lessons`, formatMinutes(course.totalMinutes)];

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("dashboard-card shadow-2xs flex flex-col sm:flex-row sm:items-center", compact ? "gap-4 p-3" : "gap-5 p-4")}
    >
      <MediaThumbnail
        src={course.thumbnailUrl}
        title={course.title}
        size={compact ? "sm" : "md"}
        className={cn("shrink-0", compact ? "sm:w-40" : "sm:w-64")}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className={cn("text-primary-500 truncate", compact ? "heading-h5 font-bold!" : "heading-h3")}>{course.title}</h2>
          <ToneBadge tone={isPublished ? "green" : "yellow"} dot>
            {isPublished ? "Published" : "Draft"}
          </ToneBadge>
        </div>
        <p className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-primary-300", compact ? "mt-1.5 body-sm-regular" : "mt-2 body-regular")}>
          {stats.map((stat, i) => (
            <React.Fragment key={stat}>
              {i > 0 && <span aria-hidden>•</span>}
              <span>{stat}</span>
            </React.Fragment>
          ))}
        </p>
      </div>
    </motion.section>
  );
}

export default CourseSummaryBanner;
