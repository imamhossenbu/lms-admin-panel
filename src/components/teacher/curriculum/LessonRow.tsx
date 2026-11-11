"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Pencil, Trash2 } from "lucide-react";
import type { TeacherCourseDetail } from "@/types/teacher";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { lessonTypeMeta } from "./lessonTypes";
import { MoveButtons } from "./MoveButtons";
import { IconAction } from "./IconAction";

type Lesson = TeacherCourseDetail["modules"][number]["lessons"][number];

/** One lesson inside a module: type icon, title, badges, length, reorder + edit / delete. */
export function LessonRow({ lesson, index, count, busy, onMove, onEdit, onDelete }: { lesson: Lesson; index: number; count: number; busy: boolean; onMove: (dir: -1 | 1) => void; onEdit: () => void; onDelete: () => void }) {
  const meta = lessonTypeMeta(lesson.type);
  const Icon = meta.icon;
  return (
    <motion.li layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-slate-50">
      <MoveButtons label={lesson.title} first={index === 0} last={index === count - 1} busy={busy} onMove={onMove} />
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate body-sm-medium text-primary-500">{lesson.title}</p>
        <p className="inline-flex items-center gap-1 body-xsm-regular text-primary-300">
          {meta.label} · <Clock className="h-3 w-3" /> {lesson.durationMinutes}m · {lesson.completions} completed
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {lesson.isPreview && <ToneBadge tone="blue" size="sm">Preview</ToneBadge>}
        <ToneBadge tone={lesson.status === "PUBLISHED" ? "green" : "gray"} size="sm" dot>
          {lesson.status === "PUBLISHED" ? "Published" : "Draft"}
        </ToneBadge>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <IconAction label={`Edit ${lesson.title}`} onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconAction>
        <IconAction label={`Delete ${lesson.title}`} onClick={onDelete} danger>
          <Trash2 className="h-4 w-4" />
        </IconAction>
      </div>
    </motion.li>
  );
}

export default LessonRow;
