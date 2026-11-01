import type { QuizActivity, QuizAttempt, QuizItem, QuizStatus } from "@/types/quiz";
import { buildQuizSeed, MOCK_QUIZ_COURSES, type QuizSeed } from "@/data/mockQuizData";

/**
 * Mock-first persistence for Quizzes (localStorage, simulated latency). Replace with API calls later.
 * Every write also appends an Activity Log entry so the "Activity Log" tab stays truthful.
 */

const STORAGE_KEY = "edupro_quizzes_v1";
export const QUIZZES_UPDATED_EVENT = "edupro_quizzes_updated";
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const QUIZ_COURSES = MOCK_QUIZ_COURSES;
export const CURRENT_ADMIN = "Admin";

function read(): QuizSeed {
  if (typeof window === "undefined") return buildQuizSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QuizSeed;
      if (Array.isArray(parsed?.quizzes) && Array.isArray(parsed?.attempts) && Array.isArray(parsed?.activity)) return parsed;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildQuizSeed();
  write(seed);
  return seed;
}

function write(data: QuizSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(QUIZZES_UPDATED_EVENT));
}

const log = (data: QuizSeed, quizId: string, kind: QuizActivity["kind"], message: string): QuizSeed => ({
  ...data,
  activity: [{ id: uid("act"), quizId, kind, message, actor: CURRENT_ADMIN, at: new Date().toISOString() }, ...data.activity],
});

// ---------------------------------------------------------------- reads
export const getQuizzesSnapshot = () => read().quizzes;
export const getQuizAttemptsSnapshot = (quizId?: string) => read().attempts.filter((a) => !quizId || a.quizId === quizId);
export const getQuizActivitySnapshot = (quizId: string) => read().activity.filter((a) => a.quizId === quizId);

export async function fetchQuizzes(): Promise<QuizItem[]> {
  await wait(300);
  return read().quizzes;
}
export async function fetchQuiz(id: string): Promise<QuizItem | null> {
  await wait(300);
  return read().quizzes.find((q) => q.id === id) ?? null;
}
export async function fetchQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  await wait(300);
  return getQuizAttemptsSnapshot(quizId);
}
export async function fetchQuizActivity(quizId: string): Promise<QuizActivity[]> {
  await wait(250);
  return getQuizActivitySnapshot(quizId);
}

// ---------------------------------------------------------------- writes
export type QuizFields = Omit<QuizItem, "id" | "status" | "createdBy" | "createdAt" | "updatedAt">;

export async function createQuiz(fields: QuizFields, status: Extract<QuizStatus, "PUBLISHED" | "DRAFT">): Promise<QuizItem> {
  await wait();
  const now = new Date().toISOString();
  const item: QuizItem = { ...fields, id: uid("quiz"), status, createdBy: CURRENT_ADMIN, createdAt: now, updatedAt: now };
  let data = read();
  data = { ...data, quizzes: [item, ...data.quizzes] };
  data = log(data, item.id, "CREATED", `created the quiz "${item.title}" with ${item.questions.length} questions`);
  if (status === "PUBLISHED") data = log(data, item.id, "PUBLISHED", "published the quiz");
  write(data);
  return item;
}

export async function updateQuiz(id: string, patch: Partial<QuizFields> & { status?: QuizStatus }): Promise<QuizItem> {
  await wait();
  let data = read();
  const current = data.quizzes.find((q) => q.id === id);
  if (!current) throw new Error("This quiz no longer exists.");
  const next: QuizItem = { ...current, ...patch, updatedAt: new Date().toISOString() };
  data = { ...data, quizzes: data.quizzes.map((q) => (q.id === id ? next : q)) };
  if (patch.status && patch.status !== current.status) {
    const kind = patch.status === "PUBLISHED" ? "PUBLISHED" : patch.status === "ARCHIVED" ? "ARCHIVED" : "UNPUBLISHED";
    data = log(data, id, kind, patch.status === "PUBLISHED" ? "published the quiz" : patch.status === "ARCHIVED" ? "archived the quiz" : "moved the quiz to drafts");
  }
  const contentChanged = Object.keys(patch).some((k) => k !== "status");
  if (contentChanged) {
    const diff = (patch.questions?.length ?? current.questions.length) - current.questions.length;
    data = log(data, id, diff !== 0 ? (diff > 0 ? "QUESTION_ADDED" : "QUESTION_REMOVED") : "UPDATED", diff > 0 ? `added ${diff} question${diff === 1 ? "" : "s"}` : diff < 0 ? `removed ${-diff} question${diff === -1 ? "" : "s"}` : "updated the quiz");
  }
  write(data);
  return next;
}

export async function setQuizStatus(id: string, status: QuizStatus) {
  return updateQuiz(id, { status });
}

/** Copy as DRAFT without attempts. */
export async function duplicateQuiz(id: string): Promise<QuizItem> {
  await wait();
  let data = read();
  const src = data.quizzes.find((q) => q.id === id);
  if (!src) throw new Error("This quiz no longer exists.");
  const now = new Date().toISOString();
  const copy: QuizItem = { ...structuredClone(src), id: uid("quiz"), title: `${src.title} (Copy)`.slice(0, 120), status: "DRAFT", createdBy: CURRENT_ADMIN, createdAt: now, updatedAt: now };
  const i = data.quizzes.findIndex((q) => q.id === id);
  const quizzes = [...data.quizzes];
  quizzes.splice(i + 1, 0, copy);
  data = log({ ...data, quizzes }, copy.id, "DUPLICATED", `duplicated from "${src.title}"`);
  write(data);
  return copy;
}

export async function deleteQuiz(id: string): Promise<void> {
  await wait();
  const data = read();
  write({ quizzes: data.quizzes.filter((q) => q.id !== id), attempts: data.attempts.filter((a) => a.quizId !== id), activity: data.activity.filter((a) => a.quizId !== id) });
}

export function resetQuizMockData() {
  write(buildQuizSeed());
}
