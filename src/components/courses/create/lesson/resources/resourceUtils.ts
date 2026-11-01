import { LESSON_RESOURCE_MAX_BYTES } from "@/validations/lessonFormSchema";

/** Extensions accepted by the "Upload Files" dropzone (documents, archives, code, templates). */
export const RESOURCE_EXTENSIONS = [
  "PDF", "DOC", "DOCX", "PPT", "PPTX", "XLS", "XLSX", "CSV", "TXT", "MD", "RTF",
  "ZIP", "RAR", "7Z",
  "HTML", "CSS", "JS", "TS", "JSX", "TSX", "JSON", "PY", "JAVA", "C", "CPP", "SQL",
] as const;

export const RESOURCE_ACCEPT = RESOURCE_EXTENSIONS.map((ext) => `.${ext.toLowerCase()}`).join(",");

export type ResourceFileKind = "pdf" | "doc" | "slides" | "sheet" | "archive" | "code" | "text" | "other";

const KIND_BY_EXT: Record<string, ResourceFileKind> = {
  PDF: "pdf",
  DOC: "doc", DOCX: "doc", RTF: "doc",
  PPT: "slides", PPTX: "slides",
  XLS: "sheet", XLSX: "sheet", CSV: "sheet",
  ZIP: "archive", RAR: "archive", "7Z": "archive",
  HTML: "code", CSS: "code", JS: "code", TS: "code", JSX: "code", TSX: "code", JSON: "code",
  PY: "code", JAVA: "code", C: "code", CPP: "code", SQL: "code",
  TXT: "text", MD: "text",
};

export const fileKind = (fileType: string): ResourceFileKind => KIND_BY_EXT[fileType.toUpperCase()] ?? "other";

/** Upper-case extension, e.g. "Source_Code.zip" → "ZIP". */
export const fileExtension = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "";
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const newResourceId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** Returns a friendly reason when a file can't be uploaded, otherwise null. */
export const resourceFileError = (file: File): string | null => {
  const ext = fileExtension(file.name);
  if (!(RESOURCE_EXTENSIONS as readonly string[]).includes(ext)) {
    return `${file.name} is not a supported file type.`;
  }
  if (file.size > LESSON_RESOURCE_MAX_BYTES) {
    return `${file.name} is larger than ${formatBytes(LESSON_RESOURCE_MAX_BYTES)}.`;
  }
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
};

/** True for http(s) URLs — never open `blob:` or `javascript:` links. */
export const isSafeHttpUrl = (url: string) => /^https?:\/\//i.test(url.trim());
