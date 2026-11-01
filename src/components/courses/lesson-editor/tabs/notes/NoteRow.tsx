"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Pin, Trash2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { LessonEditorNote } from "@/validations/lessonEditorSchema";
import { EditorIconButton } from "../quiz/EditorIconButton";
import { noteMeta, splitNote } from "./noteUtils";

export interface NoteRowProps {
  note: LessonEditorNote;
  index: number;
  total: number;
  isEditing?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (from: number, to: number) => void;
}

/** One draggable note in "All Notes" (important ones highlighted orange with a pin). */
export function NoteRow({ note, index, total, isEditing, onEdit, onDelete, onMove }: NoteRowProps) {
  const controls = useDragControls();
  const { title, body } = splitNote(note.html);

  return (
    <Reorder.Item
      as="li"
      value={note}
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileDrag={{ scale: 1.01 }}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-3 py-3",
        note.important ? "border-brand-orange/30 bg-brand-orange-light" : "border-dash bg-white",
        isEditing && "ring-2 ring-blue/30"
      )}
    >
      <button
        type="button"
        aria-label={`Reorder note "${title}". Drag, or use the arrow keys to move.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" && index > 0) {
            e.preventDefault();
            onMove(index, index - 1);
          } else if (e.key === "ArrowDown" && index < total - 1) {
            e.preventDefault();
            onMove(index, index + 1);
          }
        }}
        className="mt-2 flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-primary-300 hover:bg-gray-bg active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="mt-0.5 flex w-5 shrink-0 justify-center pt-0.5">
        {note.important && <Pin className="h-4 w-4 fill-current text-brand-orange" aria-label="Important" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium font-semibold! text-primary-500">{title || "Untitled note"}</p>
        {body && <p className="mt-0.5 line-clamp-2 body-xsm-regular text-primary-400">{body}</p>}
        <p className="mt-1 body-xsm-regular text-primary-300">{noteMeta(note)}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {note.important && (
          <ToneBadge tone="orange" size="sm" icon={<Pin className="h-3 w-3" />}>
            Important
          </ToneBadge>
        )}
        <EditorIconButton label={`Edit note "${title}"`} icon={<Pencil className="h-4 w-4" />} onClick={onEdit} />
        <EditorIconButton label={`Delete note "${title}"`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={onDelete} />
      </div>
    </Reorder.Item>
  );
}

export default NoteRow;
