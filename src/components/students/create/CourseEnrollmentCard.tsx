"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import type { EnrollmentCourse } from "@/types/enrollmentCourse";
import { CourseEnrollmentTable } from "./CourseEnrollmentTable";
import { SelectedCoursesChips } from "./SelectedCoursesChips";

interface CourseEnrollmentCardProps {
  /** Workspace courses (null while loading). */
  courses: EnrollmentCourse[] | null;
  selectedCourseIds: string[];
  onChangeSelectedCourseIds: (ids: string[]) => void;
}

export function CourseEnrollmentCard({
  courses,
  selectedCourseIds,
  onChangeSelectedCourseIds,
}: CourseEnrollmentCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Filter courses based on search & category
  const filteredCourses = useMemo(() => {
    if (!courses) return null;
    return courses.filter((course) => {
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || course.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, categoryFilter]);

  const categoryOptions = useMemo(
    () => [{ value: "All", label: "All Categories" }, ...Array.from(new Set((courses ?? []).map((c) => c.category))).map((c) => ({ value: c, label: c }))],
    [courses]
  );

  // Selected courses full objects for chips
  const selectedCourseObjects = useMemo(() => {
    return (courses ?? []).filter((c) => selectedCourseIds.includes(c.id));
  }, [courses, selectedCourseIds]);

  const handleToggleSelect = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      onChangeSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      onChangeSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleSelectAll = () => {
    const allFilteredIds = (filteredCourses ?? []).map((c) => c.id);
    const areAllFilteredSelected = allFilteredIds.every((id) =>
      selectedCourseIds.includes(id)
    );

    if (areAllFilteredSelected) {
      onChangeSelectedCourseIds(
        selectedCourseIds.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      const merged = Array.from(new Set([...selectedCourseIds, ...allFilteredIds]));
      onChangeSelectedCourseIds(merged);
    }
  };

  const allSelected =
    !!filteredCourses?.length &&
    filteredCourses.every((c) => selectedCourseIds.includes(c.id));

  const handleRemoveChip = (courseId: string) => {
    onChangeSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
  };

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header with Title and Search/Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="title-medium text-primary-500">
              Course Enrollment
            </h2>
            <p className="body-sm-regular text-primary-300">
              Select the courses to enroll this student in. You can select multiple courses.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Controls - Strictly Side-by-Side (pasapasi) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-dash bg-gray-bg body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          {/* Category Dropdown powered by Radix UI */}
          <AppSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Course Enrollment Table */}
      <CourseEnrollmentTable
        courses={filteredCourses}
        emptyMessage={courses?.length === 0 ? "This workspace has no courses yet." : "No courses match your search."}
        selectedCourseIds={selectedCourseIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        allSelected={allSelected}
      />

      {/* Selected Courses Chips / Tags */}
      <SelectedCoursesChips
        selectedCourses={selectedCourseObjects}
        onRemove={handleRemoveChip}
      />
    </div>
  );
}
