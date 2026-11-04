"use client";

import { useEffect, useState } from "react";
import type {
  AttendanceStatus,
  LiveActivity,
  LiveClassItem,
  LiveDisplayStatus,
  LiveEnrollment,
  LiveInstructor,
  LiveQuestion,
  LiveResource,
} from "@/types/liveClass";
import { apiClient } from "@/lib/api";
import { instructorsApi } from "@/lib/api/instructors";
import { rememberLiveCourse, rememberLiveInstructor } from "@/lib/liveClassRefs";

/**
 * Live Classes data layer, backed by the Live Classes API (`/admin/live-classes*`, workspace-scoped). Function
 * names match the earlier mock store. Every class the API returns carries its course + instructor, which are
 * registered for the sync `courseOf()` / `instructorOf()` lookups. Every write announces
 * LIVE_CLASSES_UPDATED_EVENT. Errors are Axios errors (show them with apiErrorMessage).
 */

export const LIVE_CLASSES_UPDATED_EVENT = "edupro_live_classes_updated";

/** A class as the list / details return it: the stored fields + derived status, refs and counts. */
export interface LiveClassListItem extends LiveClassItem {
  displayStatus: LiveDisplayStatus;
  course: { id: string; title: string };
  instructor: LiveInstructor;
  /** Students invited (enrolled, capped by capacity). */
  enrolledCount: number;
  attendees: number;
}

interface Page<T> {
  data: T[];
  meta: { totalPages: number };
}

const enc = encodeURIComponent;
const base = (id: string) => `/admin/live-classes/${enc(id)}`;
const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(LIVE_CLASSES_UPDATED_EVENT));
const is404 = (err: unknown) => (err as { response?: { status?: number } }).response?.status === 404;

let classCache: LiveClassListItem[] = [];
const enrollmentCache = new Map<string, LiveEnrollment[]>();

async function allPages<T>(url: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data } = await apiClient.get<Page<T>>(url, { params: { ...params, page, limit: 100 } });
    rows.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return rows;
}

function remember<T extends LiveClassListItem>(item: T): T {
  rememberLiveCourse(item.course);
  rememberLiveInstructor(item.instructor);
  return item;
}

// ---------------------------------------------------------------- reads
export const getLiveClassesSnapshot = (): LiveClassListItem[] => classCache;
export const getLiveEnrollmentsSnapshot = (classId?: string): LiveEnrollment[] =>
  classId ? enrollmentCache.get(classId) ?? [] : [...enrollmentCache.values()].flat();

export interface LiveClassBundle {
  liveClass: LiveClassListItem;
  enrollments: LiveEnrollment[];
  questions: LiveQuestion[];
  resources: LiveResource[];
  activity: LiveActivity[];
}

/** Every live class of the workspace (newest start first), with course / instructor and attendance totals. */
export async function fetchLiveClasses(): Promise<LiveClassListItem[]> {
  classCache = (await allPages<LiveClassListItem>("/admin/live-classes")).map(remember);
  return classCache;
}

/** One class with its attendance, Q&A, resources and activity — or null when it isn't in this workspace. */
export async function fetchLiveClassBundle(id: string): Promise<LiveClassBundle | null> {
  let liveClass: LiveClassListItem;
  try {
    liveClass = remember((await apiClient.get<LiveClassListItem>(base(id))).data);
  } catch (err) {
    if (is404(err)) return null;
    throw err;
  }
  const [enrollments, questions, resources, activity] = await Promise.all([
    allPages<LiveEnrollment>(`${base(id)}/attendance`),
    allPages<LiveQuestion>(`${base(id)}/questions`),
    apiClient.get<LiveResource[]>(`${base(id)}/resources`).then((r) => r.data),
    allPages<LiveActivity>(`${base(id)}/activity`),
  ]);
  enrollmentCache.set(id, enrollments);
  return { liveClass, enrollments, questions, resources, activity };
}

// ---------------------------------------------------------------- classes
export type LiveClassFields = Omit<LiveClassItem, "id" | "status" | "createdAt" | "updatedAt">;

/** New class: the API invites up to `capacity` enrolled students of the course (all NOT_JOINED). */
export async function createLiveClass(fields: LiveClassFields): Promise<LiveClassListItem> {
  const { data } = await apiClient.post<LiveClassListItem>("/admin/live-classes", fields);
  announce();
  return remember(data);
}

export async function updateLiveClass(id: string, patch: Partial<LiveClassFields>): Promise<LiveClassListItem> {
  const { data } = await apiClient.patch<LiveClassListItem>(base(id), patch);
  announce();
  return remember(data);
}

async function classAction(id: string, action: "cancel" | "restore" | "duplicate"): Promise<LiveClassListItem> {
  const { data } = await apiClient.post<LiveClassListItem>(`${base(id)}/${action}`);
  announce();
  return remember(data);
}

/** Cancels the class (students are notified). */
export const cancelLiveClass = (id: string) => classAction(id, "cancel");
/** Re-activates a cancelled class. */
export const restoreLiveClass = (id: string) => classAction(id, "restore");
/** Copy as "<title> (Copy)" with fresh invitations. */
export const duplicateLiveClass = (id: string) => classAction(id, "duplicate");

export async function deleteLiveClass(id: string): Promise<void> {
  await apiClient.delete(base(id));
  classCache = classCache.filter((c) => c.id !== id);
  enrollmentCache.delete(id);
  announce();
}

// ---------------------------------------------------------------- Q&A / resources / attendance
export async function answerLiveQuestion(classId: string, questionId: string, answerHtml: string, status: LiveQuestion["status"]): Promise<LiveQuestion> {
  const { data } = await apiClient.patch<LiveQuestion>(`${base(classId)}/questions/${enc(questionId)}`, { answerHtml, status });
  announce();
  return data;
}

export type LiveResourceFields = Omit<LiveResource, "id" | "classId" | "addedAt">;

export async function addLiveResource(classId: string, r: LiveResourceFields): Promise<LiveResource> {
  const { data } = await apiClient.post<LiveResource>(`${base(classId)}/resources`, r);
  announce();
  return data;
}

export async function updateLiveResource(classId: string, id: string, patch: Partial<LiveResourceFields>): Promise<LiveResource> {
  const { data } = await apiClient.patch<LiveResource>(`${base(classId)}/resources/${enc(id)}`, patch);
  announce();
  return data;
}

export async function deleteLiveResource(classId: string, id: string): Promise<void> {
  await apiClient.delete(`${base(classId)}/resources/${enc(id)}`);
  announce();
}

/** Manual attendance override. Rows are keyed by the student id. */
export async function setAttendance(classId: string, studentId: string, status: AttendanceStatus): Promise<LiveEnrollment> {
  const { data } = await apiClient.patch<LiveEnrollment>(`${base(classId)}/attendance/${enc(studentId)}`, { status });
  announce();
  return data;
}

/** E-mails the class reminder; resolves to how many students were reminded. */
export async function sendLiveReminder(classId: string, onlyNotJoined = false): Promise<number> {
  const { data } = await apiClient.post<{ reminded: number; failed: number }>(`${base(classId)}/reminders`, { onlyNotJoined });
  return data.reminded;
}

// ---------------------------------------------------------------- instructors

let instructorList: Promise<LiveInstructor[]> | null = null;

/** Workspace instructors (cached for the page session; a failed load is retried next time). */
export function loadLiveInstructors(): Promise<LiveInstructor[]> {
  instructorList ??= (async () => {
    const rows: LiveInstructor[] = [];
    for (let page = 1; page <= 20; page++) {
      const res = await instructorsApi.list({ page, limit: 100, sortBy: "name", sortOrder: "asc" });
      rows.push(...res.data.map((i) => ({ id: i.id, name: i.name, email: i.email })));
      if (page >= res.meta.totalPages) break;
    }
    rows.forEach(rememberLiveInstructor);
    return rows;
  })().catch((err) => {
    instructorList = null;
    throw err;
  });
  return instructorList;
}

/** Instructor picker / filter options. null while loading ([] when the list can't be read). */
export function useLiveInstructors(): LiveInstructor[] | null {
  const [list, setList] = useState<LiveInstructor[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadLiveInstructors().then(
      (rows) => alive && setList(rows),
      () => alive && setList([])
    );
    return () => {
      alive = false;
    };
  }, []);
  return list;
}
