"use client";

import React from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { NotebookTabs } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorNote } from "@/validations/lessonEditorSchema";
import { NoteRow } from "./NoteRow";

export interface NotesListCardProps {
  notes: LessonEditorNote[];
  editingId: string | null;
  onReorder: (next: LessonEditorNote[]) => void;
  onEdit: (note: LessonEditorNote) => void;
  onDelete: (note: LessonEditorNote) => void;
}

/** "All Notes (N)": draggable list of notes. */
export function NotesListCard({ notes, editingId, onReorder, onEdit, onDelete }: NotesListCardProps) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= notes.length) return;
    const next = [...notes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };

  return (
    <EditorSectionCard icon={<NotebookTabs className="h-5 w-5" />} title={`All Notes (${notes.length})`} description="View and manage lesson notes.">
      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-8 text-center body-sm-regular text-primary-300">
          No notes yet. Write your first note above.
        </p>
      ) : (
        <Reorder.Group as="ul" axis="y" values={notes} onReorder={onReorder} className="space-y-2.5">
          <AnimatePresence initial={false}>
            {notes.map((note, index) => (
              <NoteRow
                key={note.id}
                note={note}
                index={index}
                total={notes.length}
                isEditing={note.id === editingId}
                onEdit={() => onEdit(note)}
                onDelete={() => onDelete(note)}
                onMove={move}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </EditorSectionCard>
  );
}

export default NotesListCard;
