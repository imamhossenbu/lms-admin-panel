import type { OutlineLessonInput, OutlineModuleInput } from "@/validations/courseOutlineSchema";
import { newOutlineId, type AiOutline, type AiOutlineLesson, type AiOutlineModule } from "../aiOutline";

/** Base used when the admin starts building from an empty (null) outline. */
export const EMPTY_OUTLINE: AiOutline = {
  title: "",
  summary: "",
  level: "BEGINNER",
  learningOutcomes: [],
  durationWeeks: 4,
  modules: [],
};

const optional = (value: string) => (value.trim() ? value.trim() : undefined);

const mapModule = (outline: AiOutline, moduleId: string, fn: (module: AiOutlineModule) => AiOutlineModule): AiOutline => ({
  ...outline,
  modules: outline.modules.map((m) => (m.id === moduleId ? fn(m) : m)),
});

/* ---------- Immutable outline updaters ---------- */

export function addModule(outline: AiOutline, values: OutlineModuleInput): { outline: AiOutline; moduleId: string } {
  const created: AiOutlineModule = {
    id: newOutlineId("m"),
    title: values.title.trim(),
    description: optional(values.description),
    lessons: [],
  };
  return { outline: { ...outline, modules: [...outline.modules, created] }, moduleId: created.id };
}

export const updateModule = (outline: AiOutline, moduleId: string, values: OutlineModuleInput): AiOutline =>
  mapModule(outline, moduleId, (m) => ({ ...m, title: values.title.trim(), description: optional(values.description) }));

export const removeModule = (outline: AiOutline, moduleId: string): AiOutline => ({
  ...outline,
  modules: outline.modules.filter((m) => m.id !== moduleId),
});

export const reorderModules = (outline: AiOutline, modules: AiOutlineModule[]): AiOutline => ({ ...outline, modules });

const toLesson = (id: string, values: OutlineLessonInput): AiOutlineLesson => ({
  id,
  title: values.title.trim(),
  type: values.type,
  durationMinutes: values.durationMinutes,
  summary: optional(values.summary),
});

export const addLesson = (outline: AiOutline, moduleId: string, values: OutlineLessonInput): AiOutline =>
  mapModule(outline, moduleId, (m) => ({ ...m, lessons: [...m.lessons, toLesson(newOutlineId("l"), values)] }));

export const updateLesson = (outline: AiOutline, moduleId: string, lessonId: string, values: OutlineLessonInput): AiOutline =>
  mapModule(outline, moduleId, (m) => ({
    ...m,
    lessons: m.lessons.map((l) => (l.id === lessonId ? toLesson(lessonId, values) : l)),
  }));

export const removeLesson = (outline: AiOutline, moduleId: string, lessonId: string): AiOutline =>
  mapModule(outline, moduleId, (m) => ({ ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }));

/** Puts a deleted lesson back at its previous position (clamped to the current list). */
export const restoreLesson = (outline: AiOutline, moduleId: string, lesson: AiOutlineLesson, index: number): AiOutline =>
  mapModule(outline, moduleId, (m) => {
    if (m.lessons.some((l) => l.id === lesson.id)) return m;
    const lessons = [...m.lessons];
    lessons.splice(Math.min(index, lessons.length), 0, lesson);
    return { ...m, lessons };
  });

export const reorderLessons = (outline: AiOutline, moduleId: string, lessons: AiOutlineLesson[]): AiOutline =>
  mapModule(outline, moduleId, (m) => ({ ...m, lessons }));

/* ---------- Form initial values ---------- */

export const moduleToForm = (module: AiOutlineModule): OutlineModuleInput => ({
  title: module.title,
  description: module.description ?? "",
});

export const lessonToForm = (lesson: AiOutlineLesson): OutlineLessonInput => ({
  title: lesson.title,
  type: lesson.type,
  durationMinutes: lesson.durationMinutes,
  summary: lesson.summary ?? "",
});

/* ---------- "Add to Curriculum" validation ---------- */

export interface OutlineIssues {
  messages: string[];
  invalidModuleIds: Set<string>;
}

export function getOutlineIssues(outline: AiOutline | null): OutlineIssues {
  const modules = outline?.modules ?? [];
  if (modules.length === 0) {
    return { messages: ["Add at least one module to the outline."], invalidModuleIds: new Set() };
  }
  const invalid = modules.map((m, index) => ({ m, index })).filter(({ m }) => m.lessons.length === 0);
  return {
    messages: invalid.map(({ m, index }) => `Module ${index + 1} "${m.title}" needs at least one lesson.`),
    invalidModuleIds: new Set(invalid.map(({ m }) => m.id)),
  };
}
