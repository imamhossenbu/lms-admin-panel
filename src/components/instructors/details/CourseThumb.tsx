"use client";

import React from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { CourseBadgeIcon } from "@/components/students/create/CourseBadgeIcon";
import { InstructorCourseRow } from "./instructorDetailsData";

interface CourseThumbProps {
  course: Pick<InstructorCourseRow, "title" | "iconType" | "thumbnailUrl">;
  size?: "sm" | "md" | "lg";
}

const BOX = { sm: "w-5 h-5 rounded", md: "w-7 h-7 rounded-md", lg: "w-10 h-10 rounded-lg" };

/** Technology badge for catalog courses, thumbnail image otherwise. */
export function CourseThumb({ course, size = "md" }: CourseThumbProps) {
  if (course.iconType) {
    return <CourseBadgeIcon type={course.iconType} size={size} />;
  }
  return (
    <span className={`${BOX[size]} relative overflow-hidden bg-slate-100 flex items-center justify-center shrink-0`}>
      {course.thumbnailUrl ? (
        <Image src={course.thumbnailUrl} alt={course.title} fill unoptimized className="object-cover" />
      ) : (
        <BookOpen className="w-1/2 h-1/2 text-primary-300" />
      )}
    </span>
  );
}

export default CourseThumb;
