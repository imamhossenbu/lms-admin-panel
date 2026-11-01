import type { LessonEditorValues } from "@/validations/lessonEditorSchema";

export type LessonVideo = LessonEditorValues["media"]["video"];
export type VideoSource = LessonVideo["source"];

export const EMPTY_VIDEO: Omit<LessonVideo, "source"> = {
  url: "",
  fileName: "",
  fileSize: 0,
  width: 0,
  height: 0,
  durationSeconds: 0,
  format: "",
};

export const VIDEO_UPLOAD_RULES = {
  extensions: ["mp4", "mov", "avi", "webm"],
  maxBytes: 2 * 1024 * 1024 * 1024,
  label: "video",
};

/** "12:45" / "1:02:03". */
export const formatDuration = (totalSeconds: number) => {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

const youTubeId = (url: string) =>
  url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i)?.[1] ?? null;
const vimeoId = (url: string) => url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1] ?? null;

export type PlayableVideo =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string }
  | { kind: "none" };

/** How the preview should play a URL: an iframe embed (YouTube/Vimeo), a <video> file, or nothing. */
export function resolvePlayable(url: string): PlayableVideo {
  if (!url) return { kind: "none" };
  const yt = youTubeId(url);
  if (yt) return { kind: "embed", src: `https://www.youtube.com/embed/${yt}` };
  const vm = vimeoId(url);
  if (vm) return { kind: "embed", src: `https://player.vimeo.com/video/${vm}` };
  if (/^(https?:|blob:)/i.test(url)) return { kind: "file", src: url };
  return { kind: "none" };
}

/** Reads width/height/duration from a local file via a temporary object URL. */
export function readVideoMetadata(file: File): Promise<{ width: number; height: number; durationSeconds: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    const done = (meta: { width: number; height: number; durationSeconds: number }) => {
      URL.revokeObjectURL(url);
      resolve(meta);
    };
    video.preload = "metadata";
    video.onloadedmetadata = () =>
      done({ width: video.videoWidth, height: video.videoHeight, durationSeconds: Number.isFinite(video.duration) ? Math.round(video.duration) : 0 });
    video.onerror = () => done({ width: 0, height: 0, durationSeconds: 0 });
    video.src = url;
  });
}
