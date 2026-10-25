"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { ENROLLMENT_COURSES } from "@/components/students/create/mockEnrollmentCourses";
import { SelectedCoursesChips } from "@/components/students/create/SelectedCoursesChips";
import { InstructorFormCardHeader } from "./InstructorFormCardHeader";
import { AssignCoursesTable } from "./AssignCoursesTable";

interface AssignCoursesCardProps {
  selectedCourseIds: string[];
  onChangeSelectedCourseIds: (ids: string[]) => void;
}

const CATEGORY_OPTIONS = [
  { value: "All", label: "All Categories" },
  ...Array.from(new Set(ENROLLMENT_COURSES.map((c) => c.category))).map((c) => ({
    value: c,
    label: c,
  })),
];

export function AssignCoursesCard({
  selectedCourseIds,
  onChangeSelectedCourseIds,
}: AssignCoursesCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ENROLLMENT_COURSES.filter(
      (course) =>
        (!q || course.title.toLowerCase().includes(q)) &&
        (categoryFilter === "All" || course.category === categoryFilter)
    );
  }, [searchQuery, categoryFilter]);

  const selectedCourses = useMemo(
    () => ENROLLMENT_COURSES.filter((c) => selectedCourseIds.includes(c.id)),
    [selectedCourseIds]
  );

  const handleToggleSelect = (courseId: string) => {
    onChangeSelectedCourseIds(
      selectedCourseIds.includes(courseId)
        ? selectedCourseIds.filter((id) => id !== courseId)
        : [...selectedCourseIds, courseId]
    );
  };

  const handleToggleAll = (checked: boolean) => {
    const visibleIds = filteredCourses.map((c) => c.id);
    onChangeSelectedCourseIds(
      checked
        ? Array.from(new Set([...selectedCourseIds, ...visibleIds]))
        : selectedCourseIds.filter((id) => !visibleIds.includes(id))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <InstructorFormCardHeader
          icon={<BookOpen className="w-5 h-5" />}
          title={
            <>
              Assign Courses <span className="font-normal text-primary-300">(Optional)</span>
            </>
          }
          description="Select the courses this instructor will teach. You can assign multiple courses."
        />

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash bg-white body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <AppSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={CATEGORY_OPTIONS}
          />
        </div>
      </div>

      <AssignCoursesTable
        courses={filteredCourses}
        selectedCourseIds={selectedCourseIds}
        onToggleSelect={handleToggleSelect}
        onToggleAll={handleToggleAll}
      />

      <SelectedCoursesChips
        selectedCourses={selectedCourses}
        onRemove={handleToggleSelect}
      />
    </div>
  );
}

export default AssignCoursesCard;
