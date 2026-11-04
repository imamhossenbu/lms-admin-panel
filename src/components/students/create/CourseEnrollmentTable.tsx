"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Check } from "lucide-react";
import { EnrollmentCourse } from "./mockEnrollmentCourses";
import { CourseBadgeIcon } from "./CourseBadgeIcon";

interface CourseEnrollmentTableProps {
  /** null while the workspace courses load. */
  courses: EnrollmentCourse[] | null;
  selectedCourseIds: string[];
  onToggleSelect: (courseId: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
}

export function CourseEnrollmentTable({
  courses,
  selectedCourseIds,
  onToggleSelect,
  onSelectAll,
  allSelected,
  emptyMessage = "No courses match your search.",
}: CourseEnrollmentTableProps & { emptyMessage?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dash">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-bg border-b border-dash body-xsm-medium text-primary-400 divide-x divide-dash">
            <th className="py-3 px-3.5 w-10 text-center">
              <button
                type="button"
                onClick={onSelectAll}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                  allSelected
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "border-dash bg-white hover:border-primary-300"
                }`}
                title="Select all courses"
              >
                {allSelected && <Check className="w-3 h-3" strokeWidth={3} />}
              </button>
            </th>
            <th className="py-3 px-3 body-xsm-medium font-semibold! text-primary-400 w-10">#</th>
            <th className="py-3 px-3 body-xsm-medium font-semibold! text-primary-400">Course Title</th>
            <th className="py-3 px-3 body-xsm-medium font-semibold! text-primary-400">Category</th>
            <th className="py-3 px-3 body-xsm-medium font-semibold! text-primary-400">Instructor</th>
            <th className="py-3 px-3 body-xsm-medium font-semibold! text-primary-400">Duration</th>
            <th className="py-3 px-3.5 body-xsm-medium font-semibold! text-primary-400 text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dash body-sm-regular">
          {courses === null &&
            Array.from({ length: 4 }, (_, i) => (
              <tr key={`sk-${i}`} className="divide-x divide-dash animate-pulse">
                <td className="py-3 px-3.5"><div className="mx-auto h-4 w-4 rounded bg-slate-100" /></td>
                <td className="py-3 px-3"><div className="h-3 w-4 rounded bg-slate-100" /></td>
                <td className="py-3 px-3"><div className="flex items-center gap-2.5"><div className="h-7 w-7 rounded-md bg-slate-200" /><div className="h-3.5 w-40 rounded bg-slate-100" /></div></td>
                <td className="py-3 px-3"><div className="h-3 w-24 rounded bg-slate-100" /></td>
                <td className="py-3 px-3"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-slate-200" /><div className="h-3 w-20 rounded bg-slate-100" /></div></td>
                <td className="py-3 px-3"><div className="h-3 w-12 rounded bg-slate-100" /></td>
                <td className="py-3 px-3.5"><div className="ml-auto h-3 w-10 rounded bg-slate-100" /></td>
              </tr>
            ))}
          {courses?.length === 0 && (
            <tr>
              <td colSpan={7} className="py-10 text-center body-sm-regular text-primary-300">
                {emptyMessage}
              </td>
            </tr>
          )}
          {(courses ?? []).map((course, idx) => {
            const isSelected = selectedCourseIds.includes(course.id);
            return (
              <tr
                key={course.id}
                onClick={() => onToggleSelect(course.id)}
                className={`divide-x divide-dash transition-colors cursor-pointer select-none ${
                  isSelected
                    ? "bg-brand-orange-soft/60 hover:bg-brand-orange-soft"
                    : "hover:bg-slate-50/70"
                }`}
              >
                {/* Checkbox */}
                <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleSelect(course.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-brand-orange border-brand-orange text-white"
                        : "border-dash bg-white hover:border-primary-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </button>
                </td>

                {/* Index */}
                <td className="py-3 px-3 text-primary-300 body-xsm-medium">
                  {idx + 1}
                </td>

                {/* Course Title with Technology Badge */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <CourseBadgeIcon type={course.iconType} />
                    <span className="body-sm-medium text-primary-500">
                      {course.title}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-3 text-primary-400 body-sm-regular">
                  {course.category}
                </td>

                {/* Instructor with Avatar */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Avatar src={course.instructor.avatarUrl || null} name={course.instructor.name} size={24} className="rounded-full border border-dash shrink-0" />
                    <span className="body-sm-regular text-primary-500">
                      {course.instructor.name}
                    </span>
                  </div>
                </td>

                {/* Duration */}
                <td className="py-3 px-3 text-primary-400 body-sm-regular">
                  {course.duration}
                </td>

                {/* Price */}
                <td className="py-3 px-3.5 text-right">
                  <span
                    className={`body-sm-medium ${
                      course.price.toLowerCase() === "free"
                        ? "text-green"
                        : "text-primary-500"
                    }`}
                  >
                    {course.price}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
