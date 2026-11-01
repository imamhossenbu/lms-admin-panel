import type { LessonEditorNote } from "@/validations/lessonEditorSchema";

const decode = (text: string) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const stripTags = (html: string) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

/** Plain-text length of a rich-text note (what the 2000 limit counts). */
export const notePlainLength = (html: string) => decode(html.replace(/<[^>]*>/g, "")).length;

/** Title = first text block, body = the rest (falls back to the first sentence). */
export function splitNote(html: string): { title: string; body: string } {
  const blocks = Array.from(html.matchAll(/<(p|h[1-6]|li|blockquote|pre)[^>]*>([\s\S]*?)<\/\1>/g))
    .map((m) => stripTags(m[2]))
    .filter(Boolean);
  if (blocks.length > 1) return { title: blocks[0], body: blocks.slice(1).join(" ") };
  const text = blocks[0] ?? stripTags(html);
  return { title: text, body: "" };
}

/** "Oct 18, 2026". */
export const formatNoteDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const noteMeta = (note: Pick<LessonEditorNote, "createdAt" | "author">) =>
  [formatNoteDate(note.createdAt), note.author ? `By ${note.author}` : ""].filter(Boolean).join(" • ");

export const newNoteId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const recentNotes = (notes: LessonEditorNote[], count = 3) =>
  [...notes].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, count);
