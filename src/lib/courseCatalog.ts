"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { apiClient } from "@/lib/api";
import type { LessonEditorContext, LessonEditorLessonRef } from "@/types/lessonEditor";
import type { AiLessonType } from "@/components/courses/create/aiOutline";
import { MOCK_LESSON_CONTEXT } from "@/data/mockLessonEditorData";

/**
 * The workspace's course catalogue from the API: the course list (GET /courses) and, per course, its
 * modules + lessons (GET /courses/:id) in the LessonEditorContext shape the Assignments / Quizzes / Certificates /
 * Community screens use. Cached for the page session; `useCourseCatalog()` loads the list, `useCourseContext(id)`
 * one course's curriculum. Sync getters return what's cached ("" / null until loaded).
 */

export interface CourseOption {
  value: string;
  label: string;
}

interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  status: string;
  thumbnail: string | null;
  modules?: { id: string; title: string; order: number; durationMinutes?: number; lessons?: { id: string; title: string; type: string; order: number; durationMinutes?: number }[] }[];
}

const EVENT = "edupro:course-catalog";
let list: ApiCourse[] | null = null;
let listInflight: Promise<ApiCourse[]> | null = null;
const contexts = new Map<string, LessonEditorContext>();
const contextInflight = new Map<string, Promise<LessonEditorContext | null>>();

const notify = () => typeof window !== "undefined" && window.dispatchEvent(new Event(EVENT));
const subscribe = (cb: () => void) => {
  const h = () => queueMicrotask(cb);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
};

/** Loads every course of the workspace (pages of 100). */
export function loadCourses(): Promise<ApiCourse[]> {
  listInflight ??= (async () => {
    const rows: ApiCourse[] = [];
    for (let page = 1; page <= 20; page++) {
      const res = await apiClient.get<{ data: ApiCourse[]; pagination?: { totalPages: number }; meta?: { totalPages: number } }>("/courses", { params: { page, limit: 100 } });
      rows.push(...(res.data.data ?? []));
      const total = res.data.pagination?.totalPages ?? res.data.meta?.totalPages ?? 1;
      if (page >= total) break;
    }
    return rows;
  })()
    .then((rows) => {
      list = rows;
      notify();
      return rows;
    })
    .finally(() => {
      listInflight = null;
    });
  return listInflight;
}

const LESSON_TYPES: AiLessonType[] = ["VIDEO", "TEXT", "CODING"];
const toLessonType = (t: string): AiLessonType => (LESSON_TYPES.includes(t?.toUpperCase() as AiLessonType) ? (t.toUpperCase() as AiLessonType) : "TEXT");

function toContext(c: ApiCourse): LessonEditorContext {
  const modules = [...(c.modules ?? [])].sort((a, b) => a.order - b.order);
  const lessons: LessonEditorLessonRef[] = modules.flatMap((m) =>
    [...(m.lessons ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((l, i) => ({ id: l.id, title: l.title, type: toLessonType(l.type), moduleId: m.id, moduleTitle: m.title, order: i + 1 }))
  );
  const totalMinutes = modules.reduce((s, m) => s + (m.lessons ?? []).reduce((t, l) => t + (l.durationMinutes ?? 0), 0), 0);
  return {
    ...MOCK_LESSON_CONTEXT,
    course: {
      id: c.id,
      title: c.title,
      thumbnailUrl: c.thumbnail ?? "",
      status: c.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      moduleCount: modules.length,
      lessonCount: lessons.length,
      totalMinutes,
      publicUrl: `/courses/${c.slug}`,
    },
    modules: modules.map((m, i) => ({ id: m.id, title: m.title, order: i + 1 })),
    lessons,
  };
}

/** Loads one course's curriculum (cached). Resolves null when the course isn't in this workspace. */
export function loadCourseContext(courseId: string): Promise<LessonEditorContext | null> {
  const cached = contexts.get(courseId);
  if (cached) return Promise.resolve(cached);
  let p = contextInflight.get(courseId);
  if (!p) {
    p = apiClient
      .get<ApiCourse>(`/courses/${encodeURIComponent(courseId)}`)
      .then((res) => {
        const ctx = toContext(res.data);
        contexts.set(courseId, ctx);
        notify();
        return ctx;
      })
      .catch(() => null)
      .finally(() => contextInflight.delete(courseId));
    contextInflight.set(courseId, p);
  }
  return p;
}

// ---------------------------------------------------------------- sync getters (cached)

export const courseOptions = (): CourseOption[] => (list ?? []).map((c) => ({ value: c.id, label: c.title }));
export const courseTitleOf = (courseId: string) => list?.find((c) => c.id === courseId)?.title ?? contexts.get(courseId)?.course.title ?? "";
export const cachedCourseContext = (courseId: string) => contexts.get(courseId) ?? null;
/** Empty context (no modules / lessons) while a course's curriculum loads. */
export const emptyCourseContext = (courseId: string, title = ""): LessonEditorContext => ({
  ...MOCK_LESSON_CONTEXT,
  course: { ...MOCK_LESSON_CONTEXT.course, id: courseId, title, thumbnailUrl: "", moduleCount: 0, lessonCount: 0, totalMinutes: 0 },
  modules: [],
  lessons: [],
});

// ---------------------------------------------------------------- hooks

/** Course options for pickers / filters (null until loaded). */
export function useCourseCatalog(): CourseOption[] | null {
  const loaded = useSyncExternalStore(subscribe, () => list, () => null);
  useEffect(() => {
    if (!list) void loadCourses().catch(() => undefined);
  }, []);
  return loaded ? loaded.map((c) => ({ value: c.id, label: c.title })) : null;
}

/** One course's curriculum context (null while loading or when `courseId` is empty). */
export function useCourseContext(courseId: string | null | undefined): LessonEditorContext | null {
  const [, force] = useState(0);
  useEffect(() => {
    if (!courseId || contexts.has(courseId)) return;
    let alive = true;
    void loadCourseContext(courseId).then(() => alive && force((n) => n + 1));
    return () => {
      alive = false;
    };
  }, [courseId]);
  useSyncExternalStore(subscribe, () => (courseId ? contexts.get(courseId) ?? null : null), () => null);
  return courseId ? contexts.get(courseId) ?? null : null;
}

/** Contexts for several courses at once (loads the missing ones); map is keyed by course id. */
export function useCourseContexts(courseIds: string[]): Map<string, LessonEditorContext> {
  const key = [...new Set(courseIds)].sort().join(",");
  const [, force] = useState(0);
  useEffect(() => {
    const missing = key ? key.split(",").filter((id) => !contexts.has(id)) : [];
    if (!missing.length) return;
    let alive = true;
    void Promise.all(missing.map(loadCourseContext)).then(() => alive && force((n) => n + 1));
    return () => {
      alive = false;
    };
  }, [key]);
  useSyncExternalStore(subscribe, () => contexts.size, () => 0);
  return contexts;
}

/** Re-reads one course's curriculum (e.g. after a lesson was renamed or moved) and returns the fresh context. */
export function refreshCourseContext(courseId: string): Promise<LessonEditorContext | null> {
  contexts.delete(courseId);
  return loadCourseContext(courseId);
}
