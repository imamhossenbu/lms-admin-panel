import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import { EMPTY_COURSE_PUBLISH, type CoursePublishInput } from "@/validations/coursePublishSchema";
import { EMPTY_LESSON_FORM, type LessonVideoSource } from "@/validations/lessonFormSchema";
import { LESSON_TYPES, type AiLessonType, type AiOutline, type AiOutlineLesson, type AiOutlineModule, type CourseLevel, type LessonDetails } from "../aiOutline";
import { EMPTY_BASIC_INFO } from "../createCourseOptions";

/** Shape of `GET /courses/:id` (only the fields the wizard uses). */
export interface ServerLesson {
  id: string;
  title: string;
  type?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  durationMinutes?: number | null;
  order?: number | null;
  status?: string | null;
}

export interface ServerModule {
  id: string;
  title: string;
  description?: string | null;
  order?: number | null;
  lessons?: ServerLesson[] | null;
}

export interface ServerCourse {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  thumbnail?: string | null;
  categoryId?: string | null;
  level?: string | null;
  language?: string | null;
  price?: number | string | null;
  isFree?: boolean | null;
  status?: string | null;
  learningOutcomes?: string | null;
  tags?: string | null;
  modules?: ServerModule[] | null;
}

const LEVELS: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"];

const toLevel = (value?: string | null): CourseLevel => {
  const upper = String(value ?? "").toUpperCase() as CourseLevel;
  return LEVELS.includes(upper) ? upper : "BEGINNER";
};

const toLessonType = (value?: string | null): AiLessonType => {
  const upper = String(value ?? "").toUpperCase();
  return (LESSON_TYPES as readonly string[]).includes(upper) ? (upper as AiLessonType) : "VIDEO";
};

const parseJsonList = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return value.split("\n").map((s) => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  }
};

/** Reverses `moduleDescriptionForApi`: "desc\n\nLearning objectives:\n- a\n- b". */
export const parseModuleDescription = (raw?: string | null): { description: string; objectives: string[] } => {
  const text = raw ?? "";
  const marker = text.search(/(^|\n)Learning objectives:\s*\n/i);
  if (marker === -1) return { description: text.trim(), objectives: [] };
  const description = text.slice(0, marker).trim();
  const objectives = text
    .slice(marker)
    .replace(/^\n?Learning objectives:\s*\n/i, "")
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  return { description, objectives };
};

const videoSourceFor = (url: string): LessonVideoSource => {
  if (/(youtube\.com|youtu\.be)\//i.test(url)) return "YOUTUBE";
  if (/vimeo\.com\//i.test(url)) return "VIMEO";
  if (/res\.cloudinary\.com\//i.test(url)) return "UPLOAD";
  return "LINK";
};

const isHosted = (url: string) => /^https?:\/\//i.test(url);

const VISIBILITY_FROM_STATUS: Record<string, LessonDetails["visibility"]> = {
  PUBLISHED: "PUBLIC",
  DRAFT: "DRAFT",
  // The API has no scheduled date, so a scheduled lesson reopens as a draft.
  SCHEDULED: "DRAFT",
};

/** Empty-form values minus the fields that live on the outline lesson itself (title/type/summary). */
const lessonDefaults = (): Omit<LessonDetails, "video" | "quiz" | "content" | "resourceFiles" | "resourceLinks" | "tags"> => {
  const d = EMPTY_LESSON_FORM;
  return {
    duration: d.duration,
    durationUnit: d.durationUnit,
    difficulty: d.difficulty,
    prerequisiteLessonId: d.prerequisiteLessonId,
    thumbnailUrl: d.thumbnailUrl,
    thumbnailPrompt: d.thumbnailPrompt,
    visibility: d.visibility,
    scheduledAt: d.scheduledAt,
    releaseType: d.releaseType,
    dripValue: d.dripValue,
    dripUnit: d.dripUnit,
    completion: d.completion,
    access: d.access,
    instructorNotes: d.instructorNotes,
  };
};

/** Server lesson → outline lesson. Fields the API doesn't store fall back to the empty form defaults. */
export function serverLessonToOutline(lesson: ServerLesson): AiOutlineLesson {
  const minutes = Math.min(600, Math.max(1, Math.round(lesson.durationMinutes || 10)));
  const url = (lesson.videoUrl ?? "").trim();
  const hostedUrl = isHosted(url) ? url : "";
  const details: LessonDetails = {
    ...lessonDefaults(),
    duration: minutes,
    durationUnit: "minutes",
    video: hostedUrl
      ? { source: videoSourceFor(hostedUrl), url: hostedUrl, fileName: hostedUrl.split("/").pop()?.split("?")[0] ?? "", fileSize: 0, durationSeconds: 0 }
      : { ...EMPTY_LESSON_FORM.video },
    quiz: { ...EMPTY_LESSON_FORM.quiz, questions: [] },
    content: lesson.content ?? "",
    resourceFiles: [],
    resourceLinks: [],
    tags: [],
    visibility: VISIBILITY_FROM_STATUS[String(lesson.status ?? "").toUpperCase()] ?? "PUBLIC",
  };
  return {
    id: lesson.id,
    title: lesson.title,
    type: toLessonType(lesson.type),
    durationMinutes: minutes,
    details,
  };
}

export function serverModuleToOutline(module: ServerModule): AiOutlineModule {
  const { description, objectives } = parseModuleDescription(module.description);
  const lessons = [...(module.lessons ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return {
    id: module.id,
    title: module.title,
    description,
    objectives,
    lessons: lessons.map(serverLessonToOutline),
  };
}

export function courseToOutline(course: ServerCourse): AiOutline {
  const modules = [...(course.modules ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return {
    title: course.title,
    summary: course.shortDescription ?? "",
    level: toLevel(course.level),
    learningOutcomes: parseJsonList(course.learningOutcomes),
    durationWeeks: 0,
    modules: modules.map(serverModuleToOutline),
  };
}

export function courseToBasicInfo(course: ServerCourse): CourseBasicInfoInput {
  return {
    ...EMPTY_BASIC_INFO,
    title: course.title ?? "",
    shortDescription: course.shortDescription ?? "",
    description: course.description ?? "",
    thumbnail: course.thumbnail ?? "",
    categoryId: course.categoryId ?? "",
    language: course.language || EMPTY_BASIC_INFO.language,
    level: toLevel(course.level),
    tags: (course.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
  };
}

export function courseToPublish(course: ServerCourse): CoursePublishInput {
  const price = Number(course.price) || 0;
  const isFree = course.isFree ?? price === 0;
  return {
    ...EMPTY_COURSE_PUBLISH,
    features: { ...EMPTY_COURSE_PUBLISH.features },
    priceType: isFree ? "FREE" : "ONE_TIME",
    price: isFree ? 0 : price,
  };
}

/** Server ids present when the course was loaded — used to work out what to create / update / delete on save. */
export interface CourseSnapshot {
  courseId: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  moduleIds: Set<string>;
  /** lessonId → moduleId it belonged to. */
  lessonModule: Map<string, string>;
}

export function snapshotOf(course: ServerCourse, outline: AiOutline): CourseSnapshot {
  const lessonModule = new Map<string, string>();
  outline.modules.forEach((m) => m.lessons.forEach((l) => lessonModule.set(l.id, m.id)));
  return {
    courseId: course.id,
    slug: course.slug,
    status: String(course.status ?? "").toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    moduleIds: new Set(outline.modules.map((m) => m.id)),
    lessonModule,
  };
}
