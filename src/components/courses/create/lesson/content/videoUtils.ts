import type { LessonVideoSource } from "@/validations/lessonFormSchema";

/** Accepted upload formats (MIME types browsers report for MP4, MOV, AVI, WEBM). */
export const VIDEO_UPLOAD_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/avi",
  "video/msvideo",
  "video/webm",
];
export const VIDEO_UPLOAD_EXTENSIONS = ["mp4", "mov", "avi", "webm"];
export const VIDEO_UPLOAD_ACCEPT = ".mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm";

/** Type check by MIME, falling back to the extension (some OSes report "" for .avi / .mov). */
export const isAcceptedVideoFile = (file: File) => {
  if (VIDEO_UPLOAD_TYPES.includes(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (!file.type || file.type.startsWith("video/")) && VIDEO_UPLOAD_EXTENSIONS.includes(ext);
};

/** 284 MB, 1.2 GB, 512 KB ... */
export const formatBytes = (bytes: number) => {
  if (!bytes || bytes <= 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
};

/** mm:ss (or h:mm:ss past an hour). */
export const formatDuration = (seconds: number) => {
  const total = Math.max(0, Math.round(seconds || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const parseUrl = (value: string) => {
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
};

export const isHttpUrl = (value: string) => {
  const url = parseUrl(value);
  return url?.protocol === "http:" || url?.protocol === "https:";
};

export const getYouTubeId = (value: string) => {
  const url = parseUrl(value);
  if (!url) return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const v = url.searchParams.get("v");
    if (v) return v;
    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]+)/);
    return match?.[1] ?? null;
  }
  return null;
};

export const getVimeoId = (value: string) => {
  const url = parseUrl(value);
  if (!url || !/(^|\.)vimeo\.com$/.test(url.hostname)) return null;
  const match = url.pathname.match(/(?:^|\/)(\d{5,})(?:\/|$)/);
  return match?.[1] ?? null;
};

export const isDirectVideoUrl = (value: string) => /\.(mp4|mov|webm|m4v|ogg)(\?|#|$)/i.test(value.trim());

/** Embeddable player URL for YouTube / Vimeo links, or null when the link can't be embedded. */
export const getEmbedUrl = (value: string, source: LessonVideoSource): string | null => {
  if (source === "YOUTUBE") {
    const id = getYouTubeId(value);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (source === "VIMEO") {
    const id = getVimeoId(value);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (source === "LINK") {
    // External links that happen to point at YouTube / Vimeo still get a real player.
    return getEmbedUrl(value, "YOUTUBE") ?? getEmbedUrl(value, "VIMEO");
  }
  return null;
};

/** Reads the duration from a local file's metadata. Resolves 0 when the browser can't decode it. */
export const readVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(0);
    const src = URL.createObjectURL(file);
    const video = document.createElement("video");
    const done = (seconds: number) => {
      URL.revokeObjectURL(src);
      video.removeAttribute("src");
      resolve(Number.isFinite(seconds) && seconds > 0 ? seconds : 0);
    };
    video.preload = "metadata";
    video.muted = true;
    video.onloadedmetadata = () => done(video.duration);
    video.onerror = () => done(0);
    window.setTimeout(() => done(0), 8000);
    video.src = src;
  });

