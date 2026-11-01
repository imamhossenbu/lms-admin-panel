import React from "react";
import { Link2 } from "lucide-react";
import { FileTypeIcon } from "@/components/courses/create/lesson/resources/FileTypeIcon";
import { cn } from "@/lib/cn";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";

/** File-type tile for files, purple link tile for external links. */
export function ResourceIcon({ resource, size = "md" }: { resource: Pick<LessonEditorResource, "kind" | "format">; size?: "sm" | "md" }) {
  if (resource.kind === "FILE") return <FileTypeIcon fileType={resource.format} size={size} />;
  return (
    <span aria-hidden className={cn("flex shrink-0 items-center justify-center rounded-lg bg-purple-14 text-purple", size === "sm" ? "h-9 w-9" : "h-10 w-10")}>
      <Link2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}

export default ResourceIcon;
