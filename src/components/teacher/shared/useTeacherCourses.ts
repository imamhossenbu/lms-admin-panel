"use client";

import { useEffect, useState } from "react";
import { teacherApi } from "@/lib/api/teacher";
import type { TeacherCourse } from "@/types/teacher";

let cache: TeacherCourse[] | null = null;

/** The teacher's courses (cached for the session) — course filters and the courses page. */
export function useTeacherCourses() {
  const [courses, setCourses] = useState<TeacherCourse[] | null>(cache);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    teacherApi
      .courses()
      .then((c) => {
        cache = c;
        if (alive) setCourses(c);
      })
      .catch(() => alive && setError("Couldn't load your courses."));
    return () => {
      alive = false;
    };
  }, []);
  return { courses, error };
}
