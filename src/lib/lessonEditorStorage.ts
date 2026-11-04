"use client";

import { LESSON_STATUSES, type LessonEditorResource, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext, LessonEditorLessonRef, LessonEditorRecord } from "@/types/lessonEditor";
import { LESSON_TYPES, type AiLessonType } from "@/components/courses/create/aiOutline";
import { cachedCourseContext, emptyCourseContext, loadCourseContext, refreshCourseContext } from "@/lib/courseCatalog";
import { apiClient, coursesApi } from "@/lib/api";
import { defaultLessonEditorValues } from "@/lib/lessonEditorDefaults";

/**
 * Edit Lesson page data layer.
 *
 * Saved on the API (`/courses/:courseId/modules/:moduleId/lessons/:id`, `/lessons/:id/resources`):
 *   content: title, module, type, duration, body, status, order · media: video URL · settings: free preview ·
 *   resources: title, URL / link, type, size.
 * Everything else (access, drip, SEO, quiz, notes, the other settings, video metadata, subtitles, resource
 * descriptions / visibility / order) has no column on the Lesson model yet, so it is kept as a per-lesson draft in
 * this browser (`LOCAL_ONLY_TABS`) until the schema grows. Errors are Axios errors (show them with apiErrorMessage).
 */

export const LESSON_EDITOR_UPDATED_EVENT = "edupro_lesson_editor_updated";

/** Tabs whose settings are kept in this browser only (no API fields yet). */
export const LOCAL_ONLY_TABS = ["access", "drip", "seo", "quiz", "notes"] as const;

/** Tabs that are only partly saved on the API: what stays on this device. */
export const PARTLY_LOCAL_TABS: Partial<Record<string, string>> = {
  content: "Title, module, type, duration, content, status and order are saved on the server; the short description, visibility, publish date and thumbnail stay on this device.",
  media: "The video link is saved on the server; player options, the poster and subtitles stay on this device.",
  settings: "Free preview is saved on the server; the other lesson settings stay on this device.",
  resources: "Titles, files and links are saved on the server; descriptions, visibility and order stay on this device.",
};

const EXTRAS_KEY = "edupro_lesson_editor_v1";

interface ApiLessonResource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  size: string;
  isDownloadable: boolean;
}

interface ApiLesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  durationMinutes: number;
  order: number;
  isPreview: boolean;
  status: string;
  lessonResources?: ApiLessonResource[];
}

// ---------------------------------------------------------------- browser-local extras

type ExtrasStore = Record<string, LessonEditorRecord>;
const keyOf = (courseId: string, lessonId: string) => `${courseId}::${lessonId}`;

function readExtras(): ExtrasStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(EXTRAS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as ExtrasStore) : {};
  } catch {
    return {};
  }
}

function writeExtras(record: LessonEditorRecord) {
  const store = readExtras();
  store[keyOf(record.courseId, record.lessonId)] = record;
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(store));
  } catch {
    // Storage full: the API part is already saved; the local-only extras just won't survive a reload.
  }
}

// ---------------------------------------------------------------- mapping

const toType = (t: string): AiLessonType => {
  const up = (t ?? "").toUpperCase() as AiLessonType;
  return LESSON_TYPES.includes(up) ? up : "TEXT";
};
const toStatus = (s: string): LessonEditorValues["content"]["status"] => {
  const up = (s ?? "").toUpperCase() as LessonEditorValues["content"]["status"];
  return (LESSON_STATUSES as readonly string[]).includes(up) ? up : "DRAFT";
};

const videoSourceOf = (url: string): LessonEditorValues["media"]["video"]["source"] =>
  /(youtube\.com|youtu\.be)\//i.test(url) ? "YOUTUBE" : /vimeo\.com\//i.test(url) ? "VIMEO" : /cloudinary\.com\//i.test(url) ? "UPLOAD" : "LINK";

/** "2.45 MB" / "450 KB" / "1024" → bytes. */
function parseSize(size: string): number {
  const m = /^\s*([\d.]+)\s*(B|KB|MB|GB)?\s*$/i.exec(size ?? "");
  if (!m) return 0;
  const mult = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }[(m[2] ?? "B").toUpperCase() as "B"] ?? 1;
  return Math.round(Number(m[1]) * mult);
}
const formatSize = (bytes: number) => (bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "");

const extOf = (url: string) => (/\.([a-z0-9]{1,6})(?:[?#]|$)/i.exec(url)?.[1] ?? "").toUpperCase();
const fileNameOf = (url: string) => {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
  } catch {
    return "";
  }
};

function toResource(r: ApiLessonResource, local?: LessonEditorResource): LessonEditorResource {
  const isLink = r.fileType === "LINK";
  const format = isLink ? "LINK" : r.fileType && !r.fileType.includes("/") && r.fileType !== "FILE" ? r.fileType.toUpperCase() : extOf(r.fileUrl);
  return {
    id: r.id,
    kind: isLink ? "LINK" : "FILE",
    title: r.title,
    description: local?.description ?? "",
    url: r.fileUrl,
    fileName: isLink ? "" : local?.url === r.fileUrl && local.fileName ? local.fileName : fileNameOf(r.fileUrl),
    size: isLink ? 0 : parseSize(r.size) || (local?.url === r.fileUrl ? local.size : 0),
    format,
    visible: local?.visible ?? true,
  };
}

const resourceBody = (r: LessonEditorResource) => ({
  title: r.title.trim(),
  fileUrl: r.url.trim(),
  fileType: r.kind === "LINK" ? "LINK" : r.format || extOf(r.url) || "FILE",
  size: r.kind === "LINK" ? "" : formatSize(r.size),
});

/** Server fields win; local extras fill in everything the API doesn't store. */
function mergeValues(base: LessonEditorValues, lesson: ApiLesson): LessonEditorValues {
  const videoUrl = lesson.videoUrl ?? "";
  const sameVideo = base.media.video.url === videoUrl;
  const localResources = new Map(base.resources.items.map((r) => [r.id, r]));
  const localOrder = base.resources.items.map((r) => r.id);
  const resources = (lesson.lessonResources ?? [])
    .map((r) => toResource(r, localResources.get(r.id)))
    .sort((a, b) => {
      const ia = localOrder.indexOf(a.id);
      const ib = localOrder.indexOf(b.id);
      return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib);
    });
  return {
    ...base,
    content: {
      ...base.content,
      title: lesson.title,
      moduleId: lesson.moduleId,
      type: toType(lesson.type),
      durationMinutes: Math.max(1, Math.min(600, lesson.durationMinutes || 1)),
      body: lesson.content ?? "",
      status: toStatus(lesson.status),
      order: Math.max(1, Math.min(999, lesson.order || 1)),
    },
    media: {
      ...base.media,
      video: sameVideo ? base.media.video : { source: videoUrl ? videoSourceOf(videoUrl) : "UPLOAD", url: videoUrl, fileName: "", fileSize: 0, width: 0, height: 0, durationSeconds: 0, format: "" },
    },
    settings: { ...base.settings, freePreview: lesson.isPreview },
    resources: { items: resources },
  };
}

// ---------------------------------------------------------------- cache

interface Loaded {
  values: LessonEditorValues;
  /** Module the lesson lives in on the server (part of every lesson URL). */
  moduleId: string;
  resourceIds: Set<string>;
}
const loaded = new Map<string, Loaded>();

const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(LESSON_EDITOR_UPDATED_EVENT));

/** Defaults → this browser's draft extras, for a lesson ref of the course. */
function localValues(courseId: string, ref: LessonEditorLessonRef, ctx: LessonEditorContext): LessonEditorValues {
  const saved = readExtras()[keyOf(courseId, ref.id)]?.values;
  return saved ? structuredClone(saved) : defaultLessonEditorValues(ref, ctx.course.title);
}

// ---------------------------------------------------------------- reads

/** Course reference data (cached curriculum; an empty context until `fetchLessonEditor` loads it). */
export function getLessonEditorContext(courseId: string): LessonEditorContext {
  return cachedCourseContext(courseId) ?? emptyCourseContext(courseId);
}

/** Latest known values of a lesson (loaded → this browser's draft → defaults). Sync; used for sibling lessons too. */
export function getLessonEditorValues(courseId: string, lessonId: string): LessonEditorValues {
  const hit = loaded.get(keyOf(courseId, lessonId));
  if (hit) return structuredClone(hit.values);
  const ctx = getLessonEditorContext(courseId);
  const ref = ctx.lessons.find((l) => l.id === lessonId);
  if (ref) return localValues(courseId, ref, ctx);
  const saved = readExtras()[keyOf(courseId, lessonId)]?.values;
  return saved
    ? structuredClone(saved)
    : defaultLessonEditorValues({ id: lessonId, title: "Untitled lesson", type: "TEXT", moduleId: ctx.modules[0]?.id ?? "", moduleTitle: ctx.modules[0]?.title ?? "", order: 1 }, ctx.course.title);
}

/** ISO time of the last "Update Lesson" from this browser (the API doesn't track it), or null. */
export function getLessonEditorUpdatedAt(courseId: string, lessonId: string): string | null {
  return readExtras()[keyOf(courseId, lessonId)]?.updatedAt ?? null;
}

export class LessonNotFoundError extends Error {
  constructor() {
    super("This lesson doesn't exist in this course anymore.");
  }
}

/** Loads the course curriculum and the lesson (with resources). Throws LessonNotFoundError for unknown ids. */
export async function fetchLessonEditor(courseId: string, lessonId: string): Promise<{ context: LessonEditorContext; values: LessonEditorValues }> {
  const context = await loadCourseContext(courseId);
  const ref = context?.lessons.find((l) => l.id === lessonId);
  if (!context || !ref) throw new LessonNotFoundError();
  const { data } = await apiClient.get<ApiLesson>(`/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(ref.moduleId)}/lessons/${encodeURIComponent(lessonId)}`);
  const values = mergeValues(localValues(courseId, ref, context), data);
  loaded.set(keyOf(courseId, lessonId), { values, moduleId: data.moduleId, resourceIds: new Set((data.lessonResources ?? []).map((r) => r.id)) });
  return { context, values: structuredClone(values) };
}

// ---------------------------------------------------------------- writes

/** Creates / updates / deletes the lesson's resources so the server matches `items`; returns items with server ids. */
async function syncResources(lessonId: string, items: LessonEditorResource[], serverIds: Set<string>): Promise<LessonEditorResource[]> {
  const base = `/lessons/${encodeURIComponent(lessonId)}/resources`;
  const keep = new Set(items.map((r) => r.id));
  for (const id of serverIds) if (!keep.has(id)) await apiClient.delete(`${base}/${encodeURIComponent(id)}`);
  const out: LessonEditorResource[] = [];
  for (const item of items) {
    if (serverIds.has(item.id)) {
      await apiClient.patch(`${base}/${encodeURIComponent(item.id)}`, resourceBody(item));
      out.push(item);
    } else {
      const { data } = await apiClient.post<ApiLessonResource>(base, resourceBody(item));
      out.push({ ...item, id: data.id });
    }
  }
  return out;
}

/**
 * "Update Lesson": saves the API fields (lesson row + resources), keeps the rest as this browser's draft and
 * refreshes the course curriculum. Resolves with the saved record (resource ids replaced by server ids).
 */
export async function saveLessonEditorValues(courseId: string, lessonId: string, values: LessonEditorValues): Promise<LessonEditorRecord> {
  const key = keyOf(courseId, lessonId);
  let hit = loaded.get(key);
  if (!hit) {
    await fetchLessonEditor(courseId, lessonId);
    hit = loaded.get(key)!;
  }
  const c = values.content;
  await coursesApi.updateLesson(courseId, hit.moduleId, lessonId, {
    title: c.title.trim(),
    type: c.type,
    durationMinutes: c.durationMinutes,
    order: c.order,
    content: c.body,
    videoUrl: values.media.video.url.trim(),
    isPreview: values.settings.freePreview,
    status: c.status,
    ...(c.moduleId && c.moduleId !== hit.moduleId ? { moduleId: c.moduleId } : {}),
  });
  const moduleId = c.moduleId || hit.moduleId;
  // The lesson row is saved; keep the cache in step even if a resource call fails below.
  loaded.set(key, { ...hit, moduleId });

  const items = await syncResources(lessonId, values.resources.items, hit.resourceIds);
  const saved: LessonEditorValues = { ...structuredClone(values), resources: { items } };
  const record: LessonEditorRecord = { courseId, lessonId, values: saved, updatedAt: new Date().toISOString() };
  writeExtras(record);
  loaded.set(key, { values: saved, moduleId, resourceIds: new Set(items.map((r) => r.id)) });
  await refreshCourseContext(courseId).catch(() => null);
  announce();
  return record;
}

// ---------------------------------------------------------------- uploads

/** Uploads a file to the media store (POST /courses/upload-media → Cloudinary) and returns its hosted URL. */
export async function uploadFile(file: File): Promise<{ url: string }> {
  return coursesApi.uploadMedia(file);
}

/** @deprecated Kept for existing call sites; uploads for real now (see `uploadFile`). */
export const mockUploadFile = uploadFile;
