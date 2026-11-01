"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CourseSummaryBanner } from "@/components/courses/lesson-editor/CourseSummaryBanner";
import type { LessonEditorCourse } from "@/types/lessonEditor";

export interface AssignmentsHeaderProps {
  course: LessonEditorCourse;
}

/** Breadcrumb, "Assignments" title + subtitle and the compact course banner on the right. */
export function AssignmentsHeader({ course }: AssignmentsHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-left">
      <div className="min-w-0">
        <Breadcrumb
          className="mb-3"
          items={[
            { label: "Courses", href: "/courses" },
            { label: course.title, href: `/courses/${course.id}` },
            { label: "Assignments" },
          ]}
        />
        <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Assignments</h1>
        <p className="body-regular text-primary-400 mt-1">Create and manage assignments for this course. Track student submissions and grades.</p>
      </div>
      <CourseSummaryBanner course={course} compact />
    </div>
  );
}

export default AssignmentsHeader;
