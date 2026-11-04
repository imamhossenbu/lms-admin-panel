"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { toast } from "sonner";
import type { EnrollmentCourse } from "@/types/enrollmentCourse";
import { SelectedCoursesChips } from "@/components/students/create/SelectedCoursesChips";
import { InstructorFormCardHeader } from "./InstructorFormCardHeader";
import { AssignCoursesTable } from "./AssignCoursesTable";

interface AssignCoursesCardProps {
  /** Workspace courses (null while loading). */
  courses: EnrollmentCourse[] | null;
  selectedCourseIds: string[];
  onChangeSelectedCourseIds: (ids: string[]) => void;
  /**
   * Courses the instructor already teaches. Every course always has one instructor, so these can't be
   * deselected here: to move one, assign it to another instructor.
   */
  lockedCourseIds?: string[];
}

export function AssignCoursesCard({ courses, selectedCourseIds, onChangeSelectedCourseIds, lockedCourseIds = [] }: AssignCoursesCardProps) {
  const CATEGORY_OPTIONS = useMemo(
    () => [{ value: "All", label: "All Categories" }, ...Array.from(new Set((courses ?? []).map((c) => c.category))).map((c) => ({ value: c, label: c }))],
    [courses]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!courses) return null;
    return courses.filter(
      (course) =>
        (!q || course.title.toLowerCase().includes(q)) &&
        (categoryFilter === "All" || course.category === categoryFilter)
    );
  }, [courses, searchQuery, categoryFilter]);

  const selectedCourses = useMemo(
    () => (courses ?? []).filter((c) => selectedCourseIds.includes(c.id)),
    [courses, selectedCourseIds]
  );

  const warnLocked = (courseId: string) => {
    const title = courses?.find((c) => c.id === courseId)?.title ?? "This course";
    toast.info("Already taught by this instructor", { id: "locked-course", description: `To move "${title}", assign it to another instructor.` });
  };

  const handleToggleSelect = (courseId: string) => {
    if (lockedCourseIds.includes(courseId) && selectedCourseIds.includes(courseId)) return warnLocked(courseId);
    onChangeSelectedCourseIds(
      selectedCourseIds.includes(courseId)
        ? selectedCourseIds.filter((id) => id !== courseId)
        : [...selectedCourseIds, courseId]
    );
  };

  const handleToggleAll = (checked: boolean) => {
    const visibleIds = (filteredCourses ?? []).map((c) => c.id);
    onChangeSelectedCourseIds(
      checked
        ? Array.from(new Set([...selectedCourseIds, ...visibleIds]))
        : selectedCourseIds.filter((id) => !visibleIds.includes(id) || lockedCourseIds.includes(id))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <InstructorFormCardHeader
          icon={<BookOpen className="w-5 h-5" />}
          title={
            <>
              Assign Courses <span className="title-regular text-primary-300">(Optional)</span>
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
        courses={filteredCourses ?? []}
        isLoading={filteredCourses === null}
        emptyMessage={courses?.length === 0 ? "This workspace has no courses yet." : "No courses match your search."}
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
