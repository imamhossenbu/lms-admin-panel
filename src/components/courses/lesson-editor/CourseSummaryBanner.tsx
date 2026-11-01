"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatMinutes } from "@/components/courses/create/aiOutline";
import type { LessonEditorCourse } from "@/types/lessonEditor";
import { MediaThumbnail } from "./fields/MediaThumbnail";

export interface CourseSummaryBannerProps {
  course: LessonEditorCourse;
}

/** Course card above the tab bar: 16:9 thumbnail, title, status badge and module/lesson/time stats. */
export function CourseSummaryBanner({ course }: CourseSummaryBannerProps) {
  const isPublished = course.status === "PUBLISHED";
  const stats = [`${course.moduleCount} Modules`, `${course.lessonCount} Lessons`, formatMinutes(course.totalMinutes)];

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs flex flex-col gap-5 p-4 sm:flex-row sm:items-center"
    >
      <MediaThumbnail src={course.thumbnailUrl} title={course.title} className="sm:w-64 shrink-0" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="heading-h3 text-primary-500 truncate">{course.title}</h2>
          <ToneBadge tone={isPublished ? "green" : "yellow"} dot>
            {isPublished ? "Published" : "Draft"}
          </ToneBadge>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 body-regular text-primary-300">
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
