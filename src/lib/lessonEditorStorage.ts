import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext, LessonEditorRecord } from "@/types/lessonEditor";
import {
  MOCK_LESSON_CONTEXT,
  MOCK_LESSON_ID,
  MOCK_LESSON_REFS,
  defaultLessonEditorValues,
  seededIntroLessonValues,
} from "@/data/mockLessonEditorData";

/**
 * Mock-first persistence for the Edit Lesson page (localStorage, no API yet).
 * Saved values survive reloads; unknown lessons fall back to seeded / default values so the
 * page always renders. Swap these functions for API calls in the backend phase.
 */

const STORAGE_KEY = "edupro_lesson_editor_v1";
export const LESSON_EDITOR_UPDATED_EVENT = "edupro_lesson_editor_updated";

type Store = Record<string, LessonEditorRecord>;

const keyOf = (courseId: string, lessonId: string) => `${courseId}::${lessonId}`;

const readStore = (): Store => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
};

/** Reference data (course, modules, lessons, plans …). Mock for every course for now. */
export function getLessonEditorContext(courseId: string): LessonEditorContext {
  return { ...MOCK_LESSON_CONTEXT, course: { ...MOCK_LESSON_CONTEXT.course, id: courseId } };
}

/** Saved values → seeded design lesson → defaults for a known lesson → defaults for the first lesson. */
export function getLessonEditorValues(courseId: string, lessonId: string): LessonEditorValues {
  const saved = readStore()[keyOf(courseId, lessonId)];
  if (saved?.values) return structuredClone(saved.values);
  if (lessonId === MOCK_LESSON_ID) return seededIntroLessonValues();
  const ref = MOCK_LESSON_REFS.find((l) => l.id === lessonId) ?? MOCK_LESSON_REFS[0];
  return defaultLessonEditorValues(ref);
}

export function getLessonEditorUpdatedAt(courseId: string, lessonId: string): string | null {
  return readStore()[keyOf(courseId, lessonId)]?.updatedAt ?? null;
}

/** Simulates a network save (small delay) so loading states and toasts behave like the real API. */
export async function saveLessonEditorValues(courseId: string, lessonId: string, values: LessonEditorValues): Promise<LessonEditorRecord> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const record: LessonEditorRecord = { courseId, lessonId, values: structuredClone(values), updatedAt: new Date().toISOString() };
  const store = readStore();
  store[keyOf(courseId, lessonId)] = record;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(LESSON_EDITOR_UPDATED_EVENT));
  return record;
}

/** Simulates an upload: returns a stable fake hosted URL (never a blob: URL). */
export async function mockUploadFile(file: File): Promise<{ url: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  return { url: `https://res.cloudinary.com/demo/raw/upload/${Date.now().toString(36)}-${safeName}` };
}
