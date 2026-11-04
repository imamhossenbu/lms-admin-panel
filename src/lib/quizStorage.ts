"use client";

import { useMemo } from "react";
import type { QuizActivity, QuizAttempt, QuizCourseRef, QuizItem, QuizStatus } from "@/types/quiz";
import { apiClient } from "@/lib/api";
import { useCourseCatalog, useCourseContexts } from "@/lib/courseCatalog";

/**
 * Quizzes data layer, backed by the Quizzes API (`/admin/quizzes*`, workspace-scoped). Function names match the
 * earlier mock store. Reads cache what they fetch so the `get*Snapshot` helpers return the latest data; every
 * write announces QUIZZES_UPDATED_EVENT. Errors are Axios errors (show them with apiErrorMessage).
 */

export const QUIZZES_UPDATED_EVENT = "edupro_quizzes_updated";

export interface QuizAttemptSummary {
  total: number;
  passed: number;
  avgScore: number;
}
export type QuizListItem = QuizItem & { attemptSummary: QuizAttemptSummary };

interface Page<T> {
  data: T[];
  meta: { totalPages: number };
}

const enc = encodeURIComponent;
const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(QUIZZES_UPDATED_EVENT));

let quizCache: QuizListItem[] = [];
const attemptCache = new Map<string, QuizAttempt[]>();
const activityCache = new Map<string, QuizActivity[]>();

async function allPages<T>(url: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data } = await apiClient.get<Page<T>>(url, { params: { ...params, page, limit: 100 } });
    rows.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return rows;
}

// ---------------------------------------------------------------- reads

export const getQuizzesSnapshot = (): QuizItem[] => quizCache;
export const getQuizAttemptsSnapshot = (quizId?: string): QuizAttempt[] => (quizId ? attemptCache.get(quizId) ?? [] : [...attemptCache.values()].flat());
export const getQuizActivitySnapshot = (quizId: string): QuizActivity[] => activityCache.get(quizId) ?? [];

/** Every quiz of the workspace, with attempt totals. */
export async function fetchQuizzes(): Promise<QuizListItem[]> {
  quizCache = await allPages<QuizListItem>("/admin/quizzes");
  return quizCache;
}

/** One quiz, or null when it isn't in this workspace. */
export async function fetchQuiz(id: string): Promise<QuizItem | null> {
  try {
    return (await apiClient.get<QuizItem>(`/admin/quizzes/${enc(id)}`)).data;
  } catch (err) {
    if ((err as { response?: { status?: number } }).response?.status === 404) return null;
    throw err;
  }
}

export async function fetchQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  const rows = await allPages<QuizAttempt>(`/admin/quizzes/${enc(quizId)}/attempts`);
  attemptCache.set(quizId, rows);
  return rows;
}

export async function fetchQuizActivity(quizId: string): Promise<QuizActivity[]> {
  const rows = await allPages<QuizActivity>(`/admin/quizzes/${enc(quizId)}/activity`);
  activityCache.set(quizId, rows);
  return rows;
}

// ---------------------------------------------------------------- writes

export type QuizFields = Omit<QuizItem, "id" | "status" | "createdBy" | "createdAt" | "updatedAt">;

export async function createQuiz(fields: QuizFields, status: Extract<QuizStatus, "PUBLISHED" | "DRAFT">): Promise<QuizItem> {
  const { data } = await apiClient.post<QuizItem>("/admin/quizzes", { ...fields, status });
  announce();
  return data;
}

export async function updateQuiz(id: string, patch: Partial<QuizFields> & { status?: QuizStatus }): Promise<QuizItem> {
  const { data } = await apiClient.patch<QuizItem>(`/admin/quizzes/${enc(id)}`, patch);
  quizCache = quizCache.map((q) => (q.id === id ? { ...q, ...data } : q));
  announce();
  return data;
}

export const setQuizStatus = (id: string, status: QuizStatus) => updateQuiz(id, { status });

/** Copy as DRAFT without attempts. */
export async function duplicateQuiz(id: string): Promise<QuizItem> {
  const { data } = await apiClient.post<QuizItem>(`/admin/quizzes/${enc(id)}/duplicate`);
  announce();
  return data;
}

/** Deletes the quiz with its questions and attempts. */
export async function deleteQuiz(id: string): Promise<void> {
  await apiClient.delete(`/admin/quizzes/${enc(id)}`);
  quizCache = quizCache.filter((q) => q.id !== id);
  attemptCache.delete(id);
  activityCache.delete(id);
  announce();
}

// ---------------------------------------------------------------- courses

/**
 * Workspace courses with their modules (QuizCourseRef) for the quiz screens: the list filters, the wizard's
 * course / module pickers and the details header. null until the course list loads; modules fill in as each
 * course's curriculum loads.
 */
export function useQuizCourses(): QuizCourseRef[] | null {
  const catalog = useCourseCatalog();
  const ids = useMemo(() => (catalog ?? []).map((c) => c.value), [catalog]);
  const contexts = useCourseContexts(ids);
  const size = contexts.size;
  return useMemo(
    () => (catalog ? catalog.map((c) => ({ id: c.value, title: c.label, modules: contexts.get(c.value)?.modules ?? [] })) : null),
    // contexts is a live cache; `size` changes as curricula load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalog, contexts, size]
  );
}
