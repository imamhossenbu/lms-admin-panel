"use client";

import React from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { CourseSummaryBanner } from "@/components/courses/lesson-editor/CourseSummaryBanner";
import type { LessonEditorCourse } from "@/types/lessonEditor";

export interface AssignmentsHeaderProps {
  /** Selected course (?course=…), or null for the all-courses view. */
  course: LessonEditorCourse | null;
}

const courseHref = (courseId: string) => `/courses/${courseId}`;

/**
 * Breadcrumb + "Assignments" title / subtitle. With a course selected: course trail and the compact
 * course banner on the right; otherwise just 🏠 › Assignments.
 */
export function AssignmentsHeader({ course }: AssignmentsHeaderProps) {
  const items: BreadcrumbItem[] = course
    ? [{ label: "Courses", href: "/courses" }, { label: course.title, href: courseHref(course.id) }, { label: "Assignments" }]
    : [{ label: "Assignments" }];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-left">
      <div className="min-w-0">
        <Breadcrumb className="mb-3" items={items} />
        <h1 className="heading-h3 font-bold! text-primary-500">Assignments</h1>
        <p className="body-regular text-primary-400 mt-1">
          {course
            ? "Create and manage assignments for this course. Track student submissions and grades."
            : "Create and manage assignments across all your courses. Track student submissions and grades."}
        </p>
      </div>
      {course && <CourseSummaryBanner course={course} compact />}
    </div>
  );
}

export default AssignmentsHeader;
