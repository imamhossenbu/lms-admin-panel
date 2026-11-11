"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import type { TeacherCourseDetail } from "@/types/teacher";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MoveButtons } from "./MoveButtons";
import { IconAction } from "./IconAction";
import { LessonRow } from "./LessonRow";

type Module = TeacherCourseDetail["modules"][number];
type Lesson = Module["lessons"][number];

export interface ModuleCardProps {
  mod: Module;
  index: number;
  count: number;
  busy: boolean;
  onMove: (dir: -1 | 1) => void;
  onRename: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onMoveLesson: (lessonIndex: number, dir: -1 | 1) => void;
  onEditLesson: (l: Lesson) => void;
  onDeleteLesson: (l: Lesson) => void;
}

/** A module: header (number, title, lesson count, reorder, rename, delete) and its lessons. */
export function ModuleCard({ mod, index, count, busy, onMove, onRename, onDelete, onAddLesson, onMoveLesson, onEditLesson, onDeleteLesson }: ModuleCardProps) {
  const minutes = mod.lessons.reduce((s, l) => s + l.durationMinutes, 0);
  return (
    <motion.section layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="dashboard-card shadow-2xs overflow-hidden">
      <header className="flex flex-wrap items-center gap-3 border-b border-dash bg-slate-50 px-4 py-3">
        <MoveButtons label={mod.title} first={index === 0} last={index === count - 1} busy={busy} onMove={onMove} />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
          <FolderOpen className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-xsm-medium text-primary-300">Module {index + 1}</p>
          <h3 className="truncate body-medium font-semibold text-primary-500">{mod.title}</h3>
        </div>
        <ToneBadge tone="gray" size="sm">
          {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"} · {minutes}m
        </ToneBadge>
        <IconAction label={`Rename ${mod.title}`} onClick={onRename}>
          <Pencil className="h-4 w-4" />
        </IconAction>
        <IconAction label={`Delete ${mod.title}`} onClick={onDelete} danger>
          <Trash2 className="h-4 w-4" />
        </IconAction>
      </header>
      {mod.lessons.length ? (
        <ul className="divide-y divide-dash">
          {mod.lessons.map((l, i) => (
            <LessonRow key={l.id} lesson={l} index={i} count={mod.lessons.length} busy={busy} onMove={(d) => onMoveLesson(i, d)} onEdit={() => onEditLesson(l)} onDelete={() => onDeleteLesson(l)} />
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center body-sm-regular text-primary-300">No lessons in this module yet.</p>
      )}
      <div className="border-t border-dash px-4 py-3">
        <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onAddLesson} className="inline-flex items-center gap-1.5 body-sm-medium text-brand-orange hover:text-brand-orange-hover">
          <Plus className="h-4 w-4" />
          Add lesson
        </motion.button>
      </div>
    </motion.section>
  );
}

export default ModuleCard;
