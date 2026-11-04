import type { AppSelectOption } from "@/components/ui/AppSelect";
import { toCsv } from "@/components/commerce/exportFile";
import { isInDateRange } from "@/components/ui/date-range/dateRangeUtils";
import { cachedCourseContext, courseTitleOf as catalogTitleOf } from "@/lib/courseCatalog";
import type { ThreadView } from "@/lib/communityStats";
import type { ThreadListItem } from "@/lib/communityStorage";
import type { ReportReason, ThreadCategory } from "@/types/community";
import type { Tone } from "@/components/ui/ToneBadge";
import { CATEGORY_VIEW, THREAD_CATEGORIES } from "../shared/CategoryBadge";

// ---------------------------------------------------------------- tabs / sort / view

export type CommunityTab = "all" | "unanswered" | "moderation" | "pinned" | "resolved" | "hidden";
export const COMMUNITY_TABS: { id: CommunityTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unanswered", label: "Unanswered" },
  { id: "moderation", label: "Needs Moderation" },
  { id: "pinned", label: "Pinned" },
  { id: "resolved", label: "Resolved" },
  { id: "hidden", label: "Hidden" },
];
export const parseTab = (v: string): CommunityTab => (COMMUNITY_TABS.some((t) => t.id === v) ? (v as CommunityTab) : "all");

const TAB_MATCH: Record<CommunityTab, (v: ThreadView) => boolean> = {
  all: () => true,
  unanswered: (v) => v.isUnanswered,
  moderation: (v) => v.openReports > 0,
  pinned: (v) => v.thread.isPinned,
  resolved: (v) => v.isResolved,
  hidden: (v) => v.thread.isHidden,
};

export type CommunitySort = "activity" | "newest" | "replies" | "views";
export const SORT_OPTIONS: AppSelectOption[] = [
  { value: "activity", label: "Latest activity" },
  { value: "newest", label: "Newest" },
  { value: "replies", label: "Most replies" },
  { value: "views", label: "Most viewed" },
];
export const parseSort = (v: string): CommunitySort => (SORT_OPTIONS.some((o) => o.value === v) ? (v as CommunitySort) : "activity");

export type CommunityListView = "list" | "table";

// ---------------------------------------------------------------- filter options

/** "All Courses" + the workspace courses (pass the loaded catalogue). */
export const courseFilterOptions = (courses: AppSelectOption[] | null): AppSelectOption[] => [{ value: "All", label: "All Courses" }, ...(courses ?? [])];
export const CATEGORY_FILTER_OPTIONS: AppSelectOption[] = [
  { value: "All", label: "All Categories" },
  ...THREAD_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_VIEW[c].label })),
];

// ---------------------------------------------------------------- display helpers

/** The row's course title (sent by the API), else the cached catalogue. */
export const courseTitleOf = (courseId: string, known = "") => known || catalogTitleOf(courseId) || "Unknown course";

/** "Module 2: Forms" or "" for course-wide threads. */
export function moduleLabelOf(courseId: string, moduleId: string) {
  if (!moduleId) return "";
  const m = cachedCourseContext(courseId)?.modules.find((x) => x.id === moduleId);
  return m ? `Module ${m.order}: ${m.title}` : "";
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
/** Rich-text HTML → one line of plain text. */
export const plainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();

export const REPORT_REASON_VIEW: Record<ReportReason, { label: string; tone: Tone }> = {
  SPAM: { label: "Spam", tone: "yellow" },
  ABUSIVE: { label: "Abusive", tone: "red" },
  OFF_TOPIC: { label: "Off-topic", tone: "gray" },
  PLAGIARISM: { label: "Plagiarism", tone: "purple" },
  OTHER: { label: "Other", tone: "gray" },
};

export const CATEGORY_BAR_CLASS: Record<ThreadCategory, string> = {
  QUESTION: "bg-blue",
  DISCUSSION: "bg-purple",
  ANNOUNCEMENT: "bg-brand-orange",
  SHOWCASE: "bg-green",
  FEEDBACK: "bg-yellow",
};

// ---------------------------------------------------------------- filtering

export interface CommunityFilters {
  q: string;
  course: string;
  category: string;
  from: string;
  to: string;
}

export const isFilteredBy = (f: CommunityFilters) => !!f.q || f.course !== "All" || f.category !== "All" || !!f.from || !!f.to;

/** Search (title / body / author / tags / course), course, category and last-activity range — tab not applied. */
export function applyFilters<T extends ThreadListItem>(views: T[], f: CommunityFilters): T[] {
  const q = f.q.toLowerCase().trim().replace(/^#/, "");
  const range = { from: f.from || undefined, to: f.to || undefined };
  return views.filter((v) => {
    const t = v.thread;
    if (f.course !== "All" && t.courseId !== f.course) return false;
    if (f.category !== "All" && t.category !== f.category) return false;
    if ((range.from || range.to) && !isInDateRange(v.lastActivityAt, range)) return false;
    if (!q) return true;
    return [t.title, plainText(t.bodyHtml), t.author.name, courseTitleOf(t.courseId, v.courseTitle), ...t.tags].some((s) => s.toLowerCase().includes(q));
  });
}

export const tabCounts = (views: ThreadView[]) =>
  COMMUNITY_TABS.reduce<Record<CommunityTab, number>>((acc, t) => ((acc[t.id] = views.filter(TAB_MATCH[t.id]).length), acc), {
    all: 0,
    unanswered: 0,
    moderation: 0,
    pinned: 0,
    resolved: 0,
    hidden: 0,
  });

const SORTERS: Record<CommunitySort, (a: ThreadView, b: ThreadView) => number> = {
  activity: (a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt),
  newest: (a, b) => b.thread.createdAt.localeCompare(a.thread.createdAt),
  replies: (a, b) => b.replyCount - a.replyCount || b.lastActivityAt.localeCompare(a.lastActivityAt),
  views: (a, b) => b.thread.views - a.thread.views || b.lastActivityAt.localeCompare(a.lastActivityAt),
};

/** Tab filter + sort; pinned threads float to the top within the chosen sort. */
export const tabAndSort = <T extends ThreadView>(views: T[], tab: CommunityTab, sort: CommunitySort): T[] =>
  views.filter(TAB_MATCH[tab]).sort((a, b) => Number(b.thread.isPinned) - Number(a.thread.isPinned) || SORTERS[sort](a, b));

// ---------------------------------------------------------------- export

const statusText = (v: ThreadView) =>
  [
    v.thread.isPinned && "Pinned",
    v.thread.isLocked && "Locked",
    v.thread.isHidden && "Hidden",
    v.isResolved && (v.thread.category === "QUESTION" ? "Resolved" : "Answered"),
    v.isUnanswered && "Unanswered",
  ]
    .filter(Boolean)
    .join(" / ") || "Open";

const csvDate = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function communityCsv(views: ThreadListItem[]) {
  return toCsv(
    ["Title", "Category", "Course", "Module", "Author", "Role", "Tags", "Replies", "Views", "Status", "Open Reports", "Created", "Last Activity"],
    views.map((v) => [
      v.thread.title,
      CATEGORY_VIEW[v.thread.category].label,
      courseTitleOf(v.thread.courseId, v.courseTitle),
      moduleLabelOf(v.thread.courseId, v.thread.moduleId) || "Course-wide",
      v.thread.author.name,
      v.thread.author.role === "STUDENT" ? "Student" : v.thread.author.role === "ADMIN" ? "Admin" : "Instructor",
      v.thread.tags.join("; "),
      v.replyCount,
      v.thread.views,
      statusText(v),
      v.openReports,
      csvDate(v.thread.createdAt),
      csvDate(v.lastActivityAt),
    ])
  );
}
