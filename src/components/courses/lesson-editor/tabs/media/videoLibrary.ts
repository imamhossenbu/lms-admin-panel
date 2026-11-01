import type { LessonVideo } from "./videoUtils";

export interface LibraryVideo extends Omit<LessonVideo, "source"> {
  id: string;
  title: string;
  uploadedAt: string;
}

/** Mock media library (mock-data phase). */
export const MOCK_VIDEO_LIBRARY: LibraryVideo[] = [
  {
    id: "lib-html-intro",
    title: "HTML Introduction",
    url: "https://res.cloudinary.com/demo/video/upload/html-introduction.mp4",
    fileName: "html-introduction.mp4",
    fileSize: 182 * 1024 * 1024,
    width: 1280,
    height: 720,
    durationSeconds: 642,
    format: "MP4",
    uploadedAt: "Oct 12, 2026",
  },
  {
    id: "lib-editor-setup",
    title: "Setting Up VS Code",
    url: "https://res.cloudinary.com/demo/video/upload/vscode-setup.mp4",
    fileName: "vscode-setup.mp4",
    fileSize: 96 * 1024 * 1024,
    width: 1920,
    height: 1080,
    durationSeconds: 418,
    format: "MP4",
    uploadedAt: "Oct 9, 2026",
  },
  {
    id: "lib-first-page",
    title: "Your First Web Page",
    url: "https://res.cloudinary.com/demo/video/upload/first-web-page.webm",
    fileName: "first-web-page.webm",
    fileSize: 74 * 1024 * 1024,
    width: 1280,
    height: 720,
    durationSeconds: 535,
    format: "WEBM",
    uploadedAt: "Sep 28, 2026",
  },
  {
    id: "lib-semantic",
    title: "Semantic HTML Explained",
    url: "https://res.cloudinary.com/demo/video/upload/semantic-html.mov",
    fileName: "semantic-html.mov",
    fileSize: 310 * 1024 * 1024,
    width: 1920,
    height: 1080,
    durationSeconds: 905,
    format: "MOV",
    uploadedAt: "Sep 15, 2026",
  },
];
