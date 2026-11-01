import type { LessonFormValues } from "@/validations/lessonFormSchema";

/** Display helpers shared by the lesson editor fields and its preview panel. */

export const LESSON_DIFFICULTY_LABEL: Record<LessonFormValues["difficulty"], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/** "10 min", "1 hr 30 min", "2 hr" from the form's duration + unit. */
export function formatLessonDuration(duration: number, unit: LessonFormValues["durationUnit"]): string {
  const value = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const minutes = Math.round(unit === "hours" ? value * 60 : value);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** Video player chip: "12:45" / "1:02:03". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

/** Plain-text check for rich-text HTML ("<p></p>" counts as empty). */
export const hasRichText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim().length > 0;

export function youTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function vimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export const isDirectVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|#|$)/i.test(url);
