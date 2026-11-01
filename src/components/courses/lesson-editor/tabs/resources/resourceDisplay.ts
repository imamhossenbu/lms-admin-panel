import type { Tone } from "@/components/ui/ToneBadge";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { formatBytes } from "@/components/courses/create/lesson/resources/resourceUtils";

export const RESOURCES_MAX = 30;

/** Badge tone per format: PDF red, Word blue, Link purple, archives orange, slides yellow, sheets green. */
const TONE_BY_FORMAT: Record<string, Tone> = {
  PDF: "red",
  DOC: "blue", DOCX: "blue", RTF: "blue", TXT: "blue", MD: "blue",
  LINK: "purple",
  ZIP: "orange", RAR: "orange", "7Z": "orange",
  PPT: "yellow", PPTX: "yellow",
  XLS: "green", XLSX: "green", CSV: "green",
};

export const resourceTone = (format: string): Tone => TONE_BY_FORMAT[format.toUpperCase()] ?? "gray";

export const resourceTypeLabel = (r: Pick<LessonEditorResource, "kind" | "format">) =>
  r.kind === "LINK" ? "Link" : r.format || "File";

/** "450 KB" / "1.2 MB" / "-" for links. */
export const resourceSizeLabel = (r: Pick<LessonEditorResource, "kind" | "size">) =>
  r.kind === "LINK" || !r.size ? "-" : formatBytes(r.size);

export const emptyResource = (): LessonEditorResource => ({
  id: "",
  kind: "FILE",
  title: "",
  description: "",
  url: "",
  fileName: "",
  size: 0,
  format: "",
  visible: true,
});

/** "html-cheat-sheet.pdf" → "Html cheat sheet" (title suggestion after an upload). */
export const titleFromFileName = (name: string) => {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
};
