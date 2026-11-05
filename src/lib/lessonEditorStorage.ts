"use client";

import { LESSON_STATUSES, type LessonEditorResource, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext, LessonEditorLessonRef, LessonEditorRecord } from "@/types/lessonEditor";
import { LESSON_TYPES, type AiLessonType } from "@/components/courses/create/aiOutline";
import { cachedCourseContext, emptyCourseContext, loadCourseContext, refreshCourseContext } from "@/lib/courseCatalog";
import { apiClient, coursesApi } from "@/lib/api";
import { defaultLessonEditorValues } from "@/lib/lessonEditorDefaults";

/**
 * Edit Lesson page data layer, fully on the API:
 *   - the lesson row (`/courses/:courseId/modules/:moduleId/lessons/:id`): title, module, type, duration, body,
 *     status, order, video URL, free preview, plus `editorSettings` (JSON) for every other editor field
 *     (access, drip, SEO, quiz, notes, behaviour, video metadata, subtitles, thumbnail…);
 *   - resources (`/lessons/:id/resources`): title, URL / link, type, size, description, visibility and order.
 * A draft an older version kept in this browser is used once, when the server has no editor settings yet.
 * Errors are Axios errors (show them with apiErrorMessage).
 */

export const LESSON_EDITOR_UPDATED_EVENT = "edupro_lesson_editor_updated";

/** Where an older version kept per-lesson drafts in this browser (read once as a migration, never written). */
const LEGACY_EXTRAS_KEY = "edupro_lesson_editor_v1";

interface ApiLessonResource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  size: string;
  isDownloadable: boolean;
  description?: string;
  order?: number;
  isVisible?: boolean;
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
  /** Staff-only JSON with the editor fields that have no column (see the header). */
  editorSettings?: Partial<EditorSettings> | null;
  lessonResources?: ApiLessonResource[];
}

/** What `editorSettings` holds: the editor values without the resources (own table) and the body (own column). */
type EditorSettings = Omit<LessonEditorValues, "resources">;

// ---------------------------------------------------------------- legacy browser drafts (read-only)

type ExtrasStore = Record<string, LessonEditorRecord>;
const keyOf = (courseId: string, lessonId: string) => `${courseId}::${lessonId}`;

function readLegacyDraft(courseId: string, lessonId: string): LessonEditorValues | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_EXTRAS_KEY) ?? "{}") as ExtrasStore;
    return parsed?.[keyOf(courseId, lessonId)]?.values ?? null;
  } catch {
    return null;
  }
}

/** Once a lesson's settings are on the server its old browser draft is dropped. */
function forgetLegacyDraft(courseId: string, lessonId: string) {
  if (typeof window === "undefined") return;
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_EXTRAS_KEY) ?? "{}") as ExtrasStore;
    if (!parsed?.[keyOf(courseId, lessonId)]) return;
    delete parsed[keyOf(courseId, lessonId)];
    if (Object.keys(parsed).length) localStorage.setItem(LEGACY_EXTRAS_KEY, JSON.stringify(parsed));
    else localStorage.removeItem(LEGACY_EXTRAS_KEY);
  } catch {
    // Unreadable storage: nothing to clean up.
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
    description: r.description ?? local?.description ?? "",
    url: r.fileUrl,
    fileName: isLink ? "" : local?.url === r.fileUrl && local.fileName ? local.fileName : fileNameOf(r.fileUrl),
    size: isLink ? 0 : parseSize(r.size) || (local?.url === r.fileUrl ? local.size : 0),
    format,
    visible: r.isVisible ?? local?.visible ?? true,
  };
}

const resourceBody = (r: LessonEditorResource, order: number) => ({
  title: r.title.trim(),
  fileUrl: r.url.trim(),
  fileType: r.kind === "LINK" ? "LINK" : r.format || extOf(r.url) || "FILE",
  size: r.kind === "LINK" ? "" : formatSize(r.size),
  description: r.description.trim(),
  order,
  isVisible: r.visible,
});

/** Section-wise merge of the stored editor settings over the defaults (new fields keep their defaults). */
function withStoredSettings(base: LessonEditorValues, stored: Partial<EditorSettings>): LessonEditorValues {
  const out = structuredClone(base) as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(stored)) {
    const current = out[key];
    if (key === "resources" || value == null) continue;
    out[key] = current && typeof current === "object" && !Array.isArray(current) && typeof value === "object" && !Array.isArray(value) ? { ...current, ...value } : value;
  }
  return out as unknown as LessonEditorValues;
}

/** Group / plan access isn't offered (the LMS has no student groups or plans): clear values older drafts may hold. */
function withoutGroupOrPlanAccess(values: LessonEditorValues): LessonEditorValues {
  return { ...values, access: { ...values.access, groupMode: "ALL", groupIds: [], planRestriction: { enabled: false, planIds: [] } } };
}

const toEditorSettings = (values: LessonEditorValues): EditorSettings => {
  const { resources, ...rest } = structuredClone(values);
  void resources;
  return { ...rest, content: { ...rest.content, body: "" } };
};

/** Lesson columns win over the stored editor settings / defaults. */
function mergeValues(base: LessonEditorValues, lesson: ApiLesson): LessonEditorValues {
  const videoUrl = lesson.videoUrl ?? "";
  const sameVideo = base.media.video.url === videoUrl;
  const localResources = new Map(base.resources.items.map((r) => [r.id, r]));
  const resources = [...(lesson.lessonResources ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((r) => toResource(r, localResources.get(r.id)));
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

/** Defaults for a lesson ref of the course (an older browser draft, if one is left, takes their place). */
function baseValues(courseId: string, ref: LessonEditorLessonRef, ctx: LessonEditorContext): LessonEditorValues {
  const legacy = readLegacyDraft(courseId, ref.id);
  return legacy ? structuredClone(legacy) : defaultLessonEditorValues(ref, ctx.course.title);
}

// ---------------------------------------------------------------- reads

/** Course reference data (cached curriculum; an empty context until `fetchLessonEditor` loads it). */
export function getLessonEditorContext(courseId: string): LessonEditorContext {
  return cachedCourseContext(courseId) ?? emptyCourseContext(courseId);
}

/** Latest known values of a lesson (loaded → defaults). Sync. */
export function getLessonEditorValues(courseId: string, lessonId: string): LessonEditorValues {
  const hit = loaded.get(keyOf(courseId, lessonId));
  if (hit) return structuredClone(hit.values);
  const ctx = getLessonEditorContext(courseId);
  const ref = ctx.lessons.find((l) => l.id === lessonId);
  if (ref) return baseValues(courseId, ref, ctx);
  return defaultLessonEditorValues({ id: lessonId, title: "Untitled lesson", type: "TEXT", moduleId: ctx.modules[0]?.id ?? "", moduleTitle: ctx.modules[0]?.title ?? "", order: 1 }, ctx.course.title);
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
  const base = data.editorSettings ? withStoredSettings(defaultLessonEditorValues(ref, context.course.title), data.editorSettings) : baseValues(courseId, ref, context);
  const values = withoutGroupOrPlanAccess(mergeValues(base, data));
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
  for (const [order, item] of items.entries()) {
    if (serverIds.has(item.id)) {
      await apiClient.patch(`${base}/${encodeURIComponent(item.id)}`, resourceBody(item, order));
      out.push(item);
    } else {
      const { data } = await apiClient.post<ApiLessonResource>(base, resourceBody(item, order));
      out.push({ ...item, id: data.id });
    }
  }
  return out;
}

/**
 * "Update Lesson": saves the lesson row (with its editor settings) and the resources, and
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
    editorSettings: toEditorSettings(values) as unknown as Record<string, unknown>,
    ...(c.moduleId && c.moduleId !== hit.moduleId ? { moduleId: c.moduleId } : {}),
  });
  const moduleId = c.moduleId || hit.moduleId;
  // The lesson row is saved; keep the cache in step even if a resource call fails below.
  loaded.set(key, { ...hit, moduleId });

  const items = await syncResources(lessonId, values.resources.items, hit.resourceIds);
  const saved: LessonEditorValues = { ...structuredClone(values), resources: { items } };
  const record: LessonEditorRecord = { courseId, lessonId, values: saved, updatedAt: new Date().toISOString() };
  forgetLegacyDraft(courseId, lessonId);
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
