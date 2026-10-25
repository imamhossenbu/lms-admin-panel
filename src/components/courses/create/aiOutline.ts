/* eslint-disable @typescript-eslint/no-explicit-any */
import { coursesApi } from "@/lib/api";

/**
 * Shared contract for the Create Course page and its AI flow:
 *   GenerateCourseAiModal (request → API → normalized AiOutline)
 *   AiOutlineReviewModal  (review / edit AiOutline)
 *   Create page           (keeps the outline, saves it as modules/lessons after the course is created)
 */

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";

export const LESSON_TYPES = ["VIDEO", "TEXT", "CODING", "QUIZ", "ASSIGNMENT", "LIVE"] as const;
export type AiLessonType = (typeof LESSON_TYPES)[number];

export const LESSON_TYPE_LABEL: Record<AiLessonType, string> = {
  VIDEO: "Video",
  TEXT: "Text",
  CODING: "Coding",
  QUIZ: "Quiz",
  ASSIGNMENT: "Assignment",
  LIVE: "Live Class",
};

export interface AiOutlineLesson {
  id: string;
  title: string;
  type: AiLessonType;
  durationMinutes: number;
  summary?: string;
}

export interface AiOutlineModule {
  id: string;
  title: string;
  description?: string;
  /** Module learning objectives (saved into the module description; the API has no column for them). */
  objectives?: string[];
  /** Optional module cover (preview only; the API has no module thumbnail field). */
  thumbnailUrl?: string;
  lessons: AiOutlineLesson[];
}

export interface AiOutline {
  title: string;
  summary: string;
  level: CourseLevel;
  learningOutcomes: string[];
  durationWeeks: number;
  modules: AiOutlineModule[];
}

export const LESSONS_PER_MODULE_OPTIONS = ["2 - 3", "4 - 6", "6 - 8"] as const;
export type LessonsPerModule = (typeof LESSONS_PER_MODULE_OPTIONS)[number];

/** What the admin fills in on the "Generate Course with AI" form. */
export interface AiOutlineRequest {
  topic: string;
  audience: string;
  level: CourseLevel;
  language: string;
  goals?: string;
  durationWeeks: number;
  moduleCount: number;
  lessonsPerModule: LessonsPerModule;
}

let idCounter = 0;
export const newOutlineId = (prefix: "m" | "l") => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

const toLessonType = (value: unknown): AiLessonType => {
  const upper = String(value ?? "").toUpperCase();
  if ((LESSON_TYPES as readonly string[]).includes(upper)) return upper as AiLessonType;
  if (upper.includes("DOC") || upper.includes("READ") || upper.includes("ARTICLE")) return "TEXT";
  if (upper.includes("CODE") || upper.includes("LAB") || upper.includes("EXERCISE")) return "CODING";
  if (upper.includes("LIVE")) return "LIVE";
  return "VIDEO";
};

const cleanTitle = (value: string) => value.replace(/^(module|lesson)\s*\d+\s*[:.-]\s*/i, "").replace(/^\d+\.\s*/, "").trim();

/** Turns whatever the AI endpoint returns into a well-formed outline (ids, types, numbers). */
export function normalizeAiOutline(raw: any, request: AiOutlineRequest): AiOutline {
  const rawModules: any[] = Array.isArray(raw?.modules) ? raw.modules : [];
  const modules: AiOutlineModule[] = rawModules.slice(0, Math.max(1, request.moduleCount)).map((m, mi) => ({
    id: newOutlineId("m"),
    title: cleanTitle(String(m?.title ?? m?.moduleTitle ?? `Module ${mi + 1}`)) || `Module ${mi + 1}`,
    description: m?.description ? String(m.description) : undefined,
    lessons: (Array.isArray(m?.lessons) ? m.lessons : []).map((l: any, li: number) => {
      const isText = typeof l === "string";
      return {
        id: newOutlineId("l"),
        title: cleanTitle(isText ? l : String(l?.title ?? `Lesson ${li + 1}`)) || `Lesson ${li + 1}`,
        type: isText ? "VIDEO" : toLessonType(l?.type),
        durationMinutes: Math.max(1, Math.round(Number(isText ? 15 : l?.durationMinutes) || 15)),
        summary: !isText && (l?.summary || l?.description) ? String(l.summary ?? l.description) : undefined,
      };
    }),
  }));

  return {
    title: String(raw?.title || request.topic).trim(),
    summary: String(raw?.summary || raw?.description || "").trim(),
    level: request.level,
    learningOutcomes: Array.isArray(raw?.learningOutcomes) ? raw.learningOutcomes.map(String).filter(Boolean) : [],
    durationWeeks: request.durationWeeks,
    modules,
  };
}

export interface OutlineStats {
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  byType: Record<AiLessonType, number>;
}

export function outlineStats(outline: AiOutline): OutlineStats {
  const byType = Object.fromEntries(LESSON_TYPES.map((t) => [t, 0])) as Record<AiLessonType, number>;
  let lessonCount = 0;
  let totalMinutes = 0;
  outline.modules.forEach((m) =>
    m.lessons.forEach((l) => {
      lessonCount += 1;
      totalMinutes += l.durationMinutes;
      byType[l.type] += 1;
    })
  );
  return { moduleCount: outline.modules.length, lessonCount, totalMinutes, byType };
}

export const moduleMinutes = (module: AiOutlineModule) => module.lessons.reduce((sum, l) => sum + l.durationMinutes, 0);

/** 72 → "1 hr 12 min", 45 → "45 min" */
export const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

/** Module description sent to the API, with learning objectives appended as a list. */
export const moduleDescriptionForApi = (m: AiOutlineModule) => {
  const objectives = (m.objectives ?? []).map((o) => o.trim()).filter(Boolean);
  const parts = [m.description?.trim() ?? ""];
  if (objectives.length) parts.push(`Learning objectives:\n${objectives.map((o) => `- ${o}`).join("\n")}`);
  return parts.filter(Boolean).join("\n\n");
};

/** Creates every module and lesson of the outline under an existing course (sequential to keep order). */
export async function saveOutlineToCourse(courseId: string, outline: AiOutline): Promise<void> {
  for (let mi = 0; mi < outline.modules.length; mi++) {
    const outlineModule = outline.modules[mi];
    const created = await coursesApi.createModule(courseId, {
      title: outlineModule.title,
      description: moduleDescriptionForApi(outlineModule),
      order: mi + 1,
    });
    if (!created?.id) continue;
    for (let li = 0; li < outlineModule.lessons.length; li++) {
      const lesson = outlineModule.lessons[li];
      await coursesApi.createLesson(courseId, created.id, {
        title: lesson.title,
        type: lesson.type,
        durationMinutes: lesson.durationMinutes,
        order: li + 1,
        content: lesson.summary ?? null,
      });
    }
  }
}
