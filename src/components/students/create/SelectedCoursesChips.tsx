"use client";

import React from "react";
import { X } from "lucide-react";
import { CourseBadgeIcon } from "./CourseBadgeIcon";
import { EnrollmentCourse } from "./mockEnrollmentCourses";

interface SelectedCoursesChipsProps {
  selectedCourses: EnrollmentCourse[];
  onRemove: (courseId: string) => void;
}

export function SelectedCoursesChips({
  selectedCourses,
  onRemove,
}: SelectedCoursesChipsProps) {
  if (selectedCourses.length === 0) {
    return null;
  }

  return (
    <div className="pt-3 border-t border-dash space-y-2.5 text-left">
      <div className="flex items-center gap-2">
        <span className="body-sm-medium text-primary-500 font-semibold">
          Selected Courses ({selectedCourses.length})
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selectedCourses.map((course) => (
          <div
            key={course.id}
            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-dash bg-[#F8FAFC] text-primary-500 body-xsm-medium shadow-2xs group hover:border-primary-300 transition-colors"
          >
            <CourseBadgeIcon type={course.iconType} size="sm" />
            <span className="truncate max-w-[200px]">{course.title}</span>
            <button
              type="button"
              onClick={() => onRemove(course.id)}
              className="p-0.5 rounded text-primary-300 hover:text-red hover:bg-red-14 transition-colors cursor-pointer"
              title={`Remove ${course.title}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
