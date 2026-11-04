"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { apiErrorMessage } from "@/lib/apiError";
import type { EnrollmentCourse } from "@/types/enrollmentCourse";
import { courseIcon } from "./studentView";

/** Course as returned by GET /courses (only the fields the student screens use). */
interface ApiCourse {
  id: string;
  title: string;
  status: string;
  price: string | number | null;
  isFree: boolean;
  durationMinutes: number | null;
  totalStudents: number;
  category?: { name: string } | null;
  instructor?: { name: string; avatar?: string | null } | null;
}

const duration = (min: number | null) => (!min ? "—" : min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}` : `${min}m`);
const price = (c: ApiCourse) => (c.isFree || !Number(c.price) ? "Free" : `$${Number(c.price).toLocaleString("en-US", { maximumFractionDigits: 2 })}`);

const toOption = (c: ApiCourse, i: number): EnrollmentCourse => ({
  id: c.id,
  orderNumber: i + 1,
  title: c.title,
  category: c.category?.name ?? "—",
  instructor: { name: c.instructor?.name ?? "—", avatarUrl: c.instructor?.avatar ?? "" },
  studentsCount: c.totalStudents,
  duration: duration(c.durationMinutes),
  price: price(c),
  iconType: courseIcon(c.title, c.category?.name ?? ""),
});

let cache: EnrollmentCourse[] | null = null;

/** The workspace's courses, loaded once per page session. `null` while loading. */
export function useCourseOptions(): EnrollmentCourse[] | null {
  const [courses, setCourses] = useState<EnrollmentCourse[] | null>(cache);
  useEffect(() => {
    if (cache) return;
    let alive = true;
    apiClient
      .get<{ data: ApiCourse[] }>("/courses", { params: { limit: 100 } })
      .then((res) => {
        cache = (res.data.data ?? []).map(toOption);
        if (alive) setCourses(cache);
      })
      .catch((err) => {
        if (alive) setCourses([]);
        toast.error("Couldn't load courses", { id: "course-options", description: apiErrorMessage(err) });
      });
    return () => {
      alive = false;
    };
  }, []);
  return courses;
}
