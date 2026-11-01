import type { CommunityThread, ThreadCategory } from "@/types/community";
import type { ThreadFormValues } from "@/validations/communitySchema";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import { getCourseContext, isKnownCourse } from "@/data/mockCourseCatalog";

/** New / Edit Discussion form: defaults, mapping, text helpers, module options and sessionStorage drafts. */

export type ThreadFormMode = "create" | "edit";

export const THREAD_FORM_DEFAULTS: ThreadFormValues = {
  title: "",
  category: "QUESTION",
  courseId: "",
  moduleId: "",
  bodyHtml: "",
  tags: [],
  isPinned: false,
  isLocked: false,
};

export const toThreadFormValues = (t: CommunityThread): ThreadFormValues => ({
  title: t.title,
  category: t.category,
  courseId: t.courseId,
  moduleId: t.moduleId,
  bodyHtml: t.bodyHtml,
  tags: [...t.tags],
  isPinned: t.isPinned,
  isLocked: t.isLocked,
});

/** Trimmed title + lowercase unique tags (what gets saved). */
export const normalizeThreadValues = (v: ThreadFormValues): ThreadFormValues => ({
  ...v,
  title: v.title.trim(),
  tags: Array.from(new Set(v.tags.map((t) => t.trim().toLowerCase()).filter(Boolean))),
});

// ---------------------------------------------------------------- text
const isEmptyHtml = (html: string) => /^(<p>\s*<\/p>|\s)*$/.test(html);

/** Plain text of rich-text HTML (same rule the schema uses for its length checks). */
export const htmlToPlainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Same count as the schema's plainLength (entities untouched except &nbsp;). */
export const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;

export const excerpt = (html: string, max = 160) => {
  const text = htmlToPlainText(html);
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

/** Stable comparison string ("<p></p>" ≈ "") to detect unsaved changes. */
export const snapshotThreadValues = (v: ThreadFormValues) => JSON.stringify(v, (_k, val) => (typeof val === "string" && isEmptyHtml(val) ? "" : val));

// ---------------------------------------------------------------- course / module
export const COURSE_WIDE_VALUE = "__course_wide__";

/** "Course-wide" + the course's modules. AppSelect needs a non-empty value, so "" maps to COURSE_WIDE_VALUE. */
export function moduleOptions(courseId: string): AppSelectOption[] {
  if (!courseId) return [];
  const modules = isKnownCourse(courseId) ? getCourseContext(courseId).modules : [];
  return [{ value: COURSE_WIDE_VALUE, label: "Course-wide" }, ...[...modules].sort((a, b) => a.order - b.order).map((m) => ({ value: m.id, label: m.title }))];
}

export const courseTitle = (courseId: string) => (courseId && isKnownCourse(courseId) ? getCourseContext(courseId).course.title : "");

export const moduleTitle = (courseId: string, moduleId: string) =>
  courseId && moduleId && isKnownCourse(courseId) ? getCourseContext(courseId).modules.find((m) => m.id === moduleId)?.title ?? "" : "";

// ---------------------------------------------------------------- similar discussions
const STOP_WORDS = new Set(
  "a an and are as at be but by can do does for from how i in is it my of on or the this to was what when where which why with you your vs not no get use using".split(" ")
);

export const titleTokens = (title: string) =>
  new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );

/** Up to `limit` threads in the same course whose titles share the most words with `title`. */
export function findSimilarThreads(threads: CommunityThread[], title: string, courseId: string, excludeId?: string, limit = 3): CommunityThread[] {
  const tokens = titleTokens(title);
  if (!courseId || tokens.size === 0) return [];
  return threads
    .filter((t) => t.courseId === courseId && t.id !== excludeId)
    .map((t) => {
      let score = 0;
      titleTokens(t.title).forEach((w) => tokens.has(w) && score++);
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.t.createdAt.localeCompare(a.t.createdAt))
    .slice(0, limit)
    .map((x) => x.t);
}

// ---------------------------------------------------------------- type tips
export const TYPE_TIPS: Record<ThreadCategory, string[]> = {
  QUESTION: [
    "Put the actual question in the title, not just the topic.",
    "Share what you tried and the exact error or output you got.",
    "Pick the module so the right instructor sees it.",
    "Mark the best reply as the answer once it's solved.",
  ],
  DISCUSSION: [
    "Open with a clear prompt that invites different opinions.",
    "Give enough context so newcomers can join in.",
    "Use tags so students can find related conversations.",
  ],
  ANNOUNCEMENT: [
    "Lead with what changed and when it takes effect.",
    "Keep it short — link to details instead of pasting them.",
    "Pin it so every student sees it first.",
    "Lock replies if you don't want a comment thread.",
  ],
  SHOWCASE: [
    "Describe what you built and which lessons it uses.",
    "Add a link to the live demo or repository.",
    "Say what kind of feedback you'd like.",
  ],
  FEEDBACK: [
    "Describe the issue or idea in one sentence first.",
    "Include the lesson or module where it happens.",
    "List steps to reproduce bugs and what you expected.",
  ],
};

// ---------------------------------------------------------------- sessionStorage draft
const DRAFT_PREFIX = "edupro_community_thread_form_v1";
export const threadDraftKey = (mode: ThreadFormMode, threadId?: string) => (mode === "create" ? `${DRAFT_PREFIX}::new` : `${DRAFT_PREFIX}::edit::${threadId ?? ""}`);

export function readThreadDraft(key: string): ThreadFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<ThreadFormValues> | null;
    if (!p || typeof p !== "object") return null;
    return {
      ...THREAD_FORM_DEFAULTS,
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [],
      isPinned: !!p.isPinned,
      isLocked: !!p.isLocked,
    };
  } catch {
    return null;
  }
}

export function writeThreadDraft(key: string, values: ThreadFormValues) {
  try {
    sessionStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Storage full / disabled: the form still works, it just won't survive a reload.
  }
}

export function clearThreadDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
