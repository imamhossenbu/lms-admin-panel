import type { CurriculumModuleInput } from "@/validations/courseOutlineSchema";
import { newOutlineId, type AiOutline, type AiOutlineLesson, type AiOutlineModule, type LessonDetails } from "../aiOutline";

/** Deep copy for duplicates; server ids are dropped so the copy creates its own quiz instead of editing the original. */
const copyDetails = (details: LessonDetails | undefined): LessonDetails | undefined => {
  if (!details) return undefined;
  const copy = structuredClone(details);
  if (copy.quiz) copy.quiz = { ...copy.quiz, id: "", questions: copy.quiz.questions.map((q) => ({ ...q, id: "" })) };
  return copy;
};

const withCopy = (title: string) => (title.endsWith("(Copy)") ? title : `${title} (Copy)`);

const cleanObjectives = (values: CurriculumModuleInput["objectives"]) =>
  values.map((o) => o.value.trim()).filter(Boolean);

/** Creates or updates a module from the Add / Edit Module panel. Returns the module id. */
export function saveModuleFromPanel(
  outline: AiOutline,
  values: CurriculumModuleInput,
  moduleId?: string
): { outline: AiOutline; moduleId: string } {
  const patch = {
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    thumbnailUrl: values.thumbnailUrl || undefined,
    objectives: cleanObjectives(values.objectives),
  };
  if (moduleId) {
    return {
      outline: { ...outline, modules: outline.modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)) },
      moduleId,
    };
  }
  const created: AiOutlineModule = { id: newOutlineId("m"), lessons: [], ...patch };
  return { outline: { ...outline, modules: [...outline.modules, created] }, moduleId: created.id };
}

export const moduleToPanel = (m: AiOutlineModule): CurriculumModuleInput => ({
  title: m.title,
  description: m.description ?? "",
  thumbnailUrl: m.thumbnailUrl ?? "",
  objectives: (m.objectives ?? []).map((value) => ({ value })),
});

export const EMPTY_MODULE_PANEL: CurriculumModuleInput = { title: "", description: "", thumbnailUrl: "", objectives: [] };

/** Inserts a copy (new ids) right after the original module. */
export function duplicateModule(outline: AiOutline, moduleId: string): AiOutline {
  const index = outline.modules.findIndex((m) => m.id === moduleId);
  if (index === -1) return outline;
  const source = outline.modules[index];
  const copy: AiOutlineModule = {
    ...source,
    id: newOutlineId("m"),
    title: withCopy(source.title),
    lessons: source.lessons.map((l) => ({
      ...l,
      id: newOutlineId("l"),
      details: copyDetails(l.details),
    })),
  };
  const modules = [...outline.modules];
  modules.splice(index + 1, 0, copy);
  return { ...outline, modules };
}

/** Inserts a copy right after the original lesson in the same module. */
export function duplicateLesson(outline: AiOutline, moduleId: string, lessonId: string): AiOutline {
  return {
    ...outline,
    modules: outline.modules.map((m) => {
      if (m.id !== moduleId) return m;
      const index = m.lessons.findIndex((l) => l.id === lessonId);
      if (index === -1) return m;
      const source = m.lessons[index];
      const copy: AiOutlineLesson = {
        ...source,
        id: newOutlineId("l"),
        title: withCopy(source.title),
        // Deep copy so the duplicate's content / resources / settings never share references with the original.
        details: copyDetails(source.details),
      };
      const lessons = [...m.lessons];
      lessons.splice(index + 1, 0, copy);
      return { ...m, lessons };
    }),
  };
}

/** Keyboard/menu alternative to drag: move a lesson up (-1) or down (+1) within its module. */
export function moveLesson(outline: AiOutline, moduleId: string, lessonId: string, direction: -1 | 1): AiOutline {
  return {
    ...outline,
    modules: outline.modules.map((m) => {
      if (m.id !== moduleId) return m;
      const index = m.lessons.findIndex((l) => l.id === lessonId);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= m.lessons.length) return m;
      const lessons = [...m.lessons];
      [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
      return { ...m, lessons };
    }),
  };
}

/** Move a module up (-1) or down (+1). */
export function moveModule(outline: AiOutline, moduleId: string, direction: -1 | 1): AiOutline {
  const index = outline.modules.findIndex((m) => m.id === moduleId);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= outline.modules.length) return outline;
  const modules = [...outline.modules];
  [modules[index], modules[target]] = [modules[target], modules[index]];
  return { ...outline, modules };
}
