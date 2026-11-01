"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import type { LessonEditorNote, LessonEditorValues } from "@/validations/lessonEditorSchema";
import { NoteComposerCard, type NoteComposerValues } from "./NoteComposerCard";
import { NotesListCard } from "./NotesListCard";
import { NoteSettingsCard } from "./NoteSettingsCard";
import { ImportantNotesCard } from "./ImportantNotesCard";
import { RecentNotesCard } from "./RecentNotesCard";
import { newNoteId, splitNote } from "./noteUtils";

const EMPTY: LessonEditorNote[] = [];

/** Edit Lesson → Notes tab (form section "notes"). */
export function NotesTab({ context }: LessonEditorTabProps) {
  const {
    control,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<LessonEditorValues>();
  const notes = useWatch({ control, name: "notes.items" }) ?? EMPTY;
  const enabled = useWatch({ control, name: "notes.enabled" });

  /** Snapshot of the note loaded into the composer. */
  const [editing, setEditing] = useState<LessonEditorNote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LessonEditorNote | null>(null);

  const setNotes = (next: LessonEditorNote[]) => setValue("notes.items", next, { shouldDirty: true, shouldValidate: isSubmitted });
  const listError = errors.notes?.items?.message ?? errors.notes?.items?.root?.message;

  const saveNote = (values: NoteComposerValues) => {
    if (editing) {
      setNotes(notes.map((n) => (n.id === editing.id ? { ...n, ...values } : n)));
      setEditing(null);
      return;
    }
    const note: LessonEditorNote = {
      id: newNoteId(),
      ...values,
      createdAt: new Date().toISOString(),
      author: context.currentUser,
    };
    setNotes([note, ...notes]);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setNotes(notes.filter((n) => n.id !== deleteTarget.id));
    if (editing?.id === deleteTarget.id) setEditing(null);
    toast.success("Note deleted", { description: `"${splitNote(deleteTarget.html).title}" was removed.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <NoteComposerCard editing={editing} disabled={!enabled} onSubmit={saveNote} onCancelEdit={() => setEditing(null)} />
        <NotesListCard notes={notes} editingId={editing?.id ?? null} onReorder={setNotes} onEdit={setEditing} onDelete={setDeleteTarget} />
        {listError && (
          <p role="alert" className="body-xsm-regular text-red">
            {listError}
          </p>
        )}
      </div>

      <div className="min-w-0 space-y-5">
        <NoteSettingsCard />
        <ImportantNotesCard notes={notes} />
        <RecentNotesCard notes={notes} />
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Note"
        message={<>Delete the note &quot;{deleteTarget ? splitNote(deleteTarget.html).title : ""}&quot;?</>}
        confirmLabel="Delete Note"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}

export default NotesTab;
