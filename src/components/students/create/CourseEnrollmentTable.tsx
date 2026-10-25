"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { EnrollmentCourse } from "./mockEnrollmentCourses";
import { CourseBadgeIcon } from "./CourseBadgeIcon";

interface CourseEnrollmentTableProps {
  courses: EnrollmentCourse[];
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
}: CourseEnrollmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dash">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-dash body-xsm-medium text-primary-400">
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
                {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            </th>
            <th className="py-3 px-3 text-primary-400 font-semibold w-10">#</th>
            <th className="py-3 px-3 text-primary-400 font-semibold">Course Title</th>
            <th className="py-3 px-3 text-primary-400 font-semibold">Category</th>
            <th className="py-3 px-3 text-primary-400 font-semibold">Instructor</th>
            <th className="py-3 px-3 text-primary-400 font-semibold">Duration</th>
            <th className="py-3 px-3.5 text-primary-400 font-semibold text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dash body-sm-regular">
          {courses.map((course, idx) => {
            const isSelected = selectedCourseIds.includes(course.id);
            return (
              <tr
                key={course.id}
                onClick={() => onToggleSelect(course.id)}
                className={`transition-colors cursor-pointer select-none ${
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
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
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
                    <span className="body-sm-medium text-primary-500 font-medium">
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
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-dash">
                      <Image
                        src={course.instructor.avatarUrl}
                        alt={course.instructor.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
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
                    className={`body-sm-medium font-semibold ${
                      course.price.toLowerCase() === "free"
                        ? "text-[#059669]"
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
