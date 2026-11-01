import React from "react";
import type { LiveCourseRef } from "@/types/liveClass";
import { courseOf } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";

const TONE: Record<LiveCourseRef["tone"], string> = {
  yellow: "bg-yellow-bg text-yellow border-yellow/30",
  purple: "bg-purple-14 text-purple border-purple/30",
  blue: "bg-blue-14 text-blue border-blue/30",
  orange: "bg-brand-orange-light text-brand-orange border-brand-orange/20",
  green: "bg-green-bg text-green border-green/30",
  red: "bg-red-14 text-red border-red/30",
};

/**
 * Big course tile (summary card / thumbnail banner). Same tone map as shared/CourseTile, but with a
 * heading-size label — CourseTile's largest size is 56px with body text, which can't be overridden
 * (globals.css typography classes aren't layered).
 */
export function LargeCourseTile({ courseId, className }: { courseId: string; className?: string }) {
  const course = courseOf(courseId);
  return (
    <span
      title={course?.title}
      aria-hidden
      className={cn("inline-flex h-24 w-24 shrink-0 select-none items-center justify-center rounded-2xl border heading-h1-bold sm:h-28 sm:w-28", TONE[course?.tone ?? "blue"], className)}
    >
      {course?.short ?? "?"}
    </span>
  );
}

export default LargeCourseTile;
