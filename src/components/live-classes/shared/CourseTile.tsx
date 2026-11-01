import React from "react";
import type { LiveCourseRef } from "@/types/liveClass";
import { courseOf } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";

const TONE_CLASS: Record<LiveCourseRef["tone"], string> = {
  yellow: "bg-yellow-bg text-yellow border-yellow/30",
  purple: "bg-purple-14 text-purple border-purple/30",
  blue: "bg-blue-14 text-blue border-blue/30",
  orange: "bg-brand-orange-light text-brand-orange border-brand-orange/20",
  green: "bg-green-bg text-green border-green/30",
  red: "bg-red-14 text-red border-red/30",
};

const SIZE_CLASS = {
  sm: "w-8 h-8 rounded-lg body-2xsm-regular",
  md: "w-10 h-10 rounded-lg body-xsm-medium",
  lg: "w-14 h-14 rounded-xl body-medium",
} as const;

export interface CourseTileProps {
  courseId: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

/** Square course logo tile: course initials on the course tone (no brand images in mock phase). */
export function CourseTile({ courseId, size = "md", className }: CourseTileProps) {
  const course = courseOf(courseId);
  return (
    <span
      title={course?.title}
      aria-hidden={!course}
      className={cn(
        "inline-flex shrink-0 items-center justify-center border font-semibold! select-none",
        SIZE_CLASS[size],
        TONE_CLASS[course?.tone ?? "blue"],
        className
      )}
    >
      {course?.short ?? "?"}
    </span>
  );
}

export default CourseTile;
