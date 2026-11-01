import React from "react";
import { FileArchive, FileCode, FileSpreadsheet, FileText, File as FileIcon, Presentation } from "lucide-react";
import { cn } from "@/lib/cn";
import { fileKind, type ResourceFileKind } from "./resourceUtils";

const STYLES: Record<ResourceFileKind, { tile: string; Icon: React.ElementType }> = {
  pdf: { tile: "bg-red text-white", Icon: FileText },
  doc: { tile: "bg-blue text-white", Icon: FileText },
  slides: { tile: "bg-brand-orange text-white", Icon: Presentation },
  sheet: { tile: "bg-green text-white", Icon: FileSpreadsheet },
  archive: { tile: "bg-green text-white", Icon: FileArchive },
  code: { tile: "bg-purple text-white", Icon: FileCode },
  text: { tile: "bg-slate-100 text-primary-400", Icon: FileText },
  other: { tile: "bg-slate-100 text-primary-300", Icon: FileIcon },
};

interface FileTypeIconProps {
  fileType: string;
  size?: "sm" | "md";
  className?: string;
}

/** Coloured tile showing the file's type (PDF red, ZIP green, DOC blue, code purple …). */
export function FileTypeIcon({ fileType, size = "md", className }: FileTypeIconProps) {
  const { tile, Icon } = STYLES[fileKind(fileType)];
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        size === "sm" ? "h-9 w-9" : "h-10 w-10",
        tile,
        className
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}

export default FileTypeIcon;
