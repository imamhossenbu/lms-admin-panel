import { Tone } from "@/components/ui/ToneBadge";
import { AdminCourseItem } from "@/lib/types";

type CourseStatus = AdminCourseItem["status"];
type CourseLevel = NonNullable<AdminCourseItem["level"]>;

export const COURSE_STATUS_VIEW: Record<CourseStatus, { label: string; tone: Tone }> = {
  PUBLISHED: { label: "Published", tone: "green" },
  DRAFT: { label: "Draft", tone: "orange" },
  ARCHIVED: { label: "Archived", tone: "gray" },
};

export const COURSE_LEVEL_LABEL: Record<CourseLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

export const COURSE_STATUS_OPTIONS = (Object.keys(COURSE_STATUS_VIEW) as CourseStatus[]).map((value) => ({
  value,
  label: COURSE_STATUS_VIEW[value].label,
}));

export const COURSE_LEVEL_OPTIONS = (Object.keys(COURSE_LEVEL_LABEL) as CourseLevel[]).map((value) => ({
  value,
  label: COURSE_LEVEL_LABEL[value],
}));

export const coursePriceLabel = (course: AdminCourseItem) =>
  course.isFree || !Number(course.price) ? "Free" : `$${Number(course.price).toFixed(2)}`;

export const courseDurationLabel = (course: AdminCourseItem) => {
  if (course.totalDuration) return course.totalDuration;
  if (!course.durationMinutes) return "—";
  const h = Math.floor(course.durationMinutes / 60);
  const m = course.durationMinutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

/** Friendly message from an axios/Nest error (never raw status codes). */
export const apiErrorMessage = (error: unknown, fallback: string) => {
  const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
};
