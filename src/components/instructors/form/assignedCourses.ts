import { InstructorCourseItem } from "@/types/instructor";
import { ENROLLMENT_COURSES } from "@/components/students/create/mockEnrollmentCourses";

const ASSIGNABLE_IDS = new Set(ENROLLMENT_COURSES.map((c) => c.id));

/** IDs of an instructor's courses that can be toggled on the assign-courses table. */
export const getAssignableCourseIds = (courses: InstructorCourseItem[]): string[] =>
  courses.filter((c) => ASSIGNABLE_IDS.has(c.id)).map((c) => c.id);

/**
 * Applies a new selection from the assign-courses table, keeping any courses
 * the instructor owns that are not part of the assignable catalog.
 */
export const applyCourseSelection = (
  existing: InstructorCourseItem[],
  selectedIds: string[]
): InstructorCourseItem[] => {
  const kept = existing.filter((c) => !ASSIGNABLE_IDS.has(c.id));
  const assigned = ENROLLMENT_COURSES.filter((c) => selectedIds.includes(c.id)).map(
    (c): InstructorCourseItem =>
      existing.find((e) => e.id === c.id) ?? {
        id: c.id,
        title: c.title,
        studentsCount: c.studentsCount,
        rating: 0,
        reviewsCount: 0,
        revenue: "$0",
        category: c.category,
      }
  );
  return [...assigned, ...kept];
};
