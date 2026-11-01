import { File, FileArchive, FileCode, FileImage, FileText, type LucideIcon } from "lucide-react";

export const MAX_ATTACHMENTS = 10;
export const MAX_ATTACHMENT_BYTES = 50 * 1024 * 1024;

export const formatBytes = (bytes: number) =>
  bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const extensionOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toUpperCase() : "FILE");

/** Icon + tile colours per file format. */
export function fileVisual(format: string): { icon: LucideIcon; tile: string } {
  const f = format.toUpperCase();
  if (["ZIP", "RAR", "7Z", "TAR", "GZ"].includes(f)) return { icon: FileArchive, tile: "bg-gray-bg text-primary-400" };
  if (["PNG", "JPG", "JPEG", "GIF", "SVG", "WEBP"].includes(f)) return { icon: FileImage, tile: "bg-blue-14 text-blue" };
  if (f === "PDF") return { icon: FileText, tile: "bg-red-14 text-red" };
  if (["HTML", "HTM", "CSS", "JS", "TS", "JSON"].includes(f)) return { icon: FileCode, tile: "bg-purple-14 text-purple" };
  if (["DOC", "DOCX", "TXT", "MD"].includes(f)) return { icon: FileText, tile: "bg-blue-14 text-blue" };
  return { icon: File, tile: "bg-gray-bg text-primary-400" };
}

export const attachmentId = () => `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
