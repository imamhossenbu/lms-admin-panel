"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InstructorNoteItem } from "@/types/instructor";
import { deleteInstructorNote, saveInstructorNote } from "@/lib/instructorStorage";
import { InstructorDetailCard } from "./InstructorDetailCard";
import { InstructorNoteCard } from "./notes/InstructorNoteCard";

interface InstructorNotesTabProps {
  instructorId: string;
  notes: InstructorNoteItem[];
}

export function InstructorNotesTab({ instructorId, notes }: InstructorNotesTabProps) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<InstructorNoteItem | null>(null);
  const notesHref = `/instructors/${instructorId}/notes`;

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const note = pendingDelete;
    const toastId = toast.loading("Deleting note...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      deleteInstructorNote(instructorId, note.id);
      toast.success("Note deleted", {
        id: toastId,
        description: `"${note.title}" was removed.`,
        action: { label: "Undo", onClick: () => saveInstructorNote(note) },
      });
    } catch (error) {
      toast.error("Could not delete note", { id: toastId, description: "Something went wrong. Please try again." });
      throw error;
    }
  };

  return (
    <InstructorDetailCard
      title={`Notes (${notes.length})`}
      description="Keep internal notes about this instructor. These notes are only visible to admins."
      action={
        <PrimaryButton type="button" onClick={() => router.push(`${notesHref}/new`)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Note
        </PrimaryButton>
      }
    >
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note, idx) => (
            <InstructorNoteCard
              key={note.id}
              note={note}
              highlighted={idx === 0}
              onEdit={(n) => router.push(`${notesHref}/${n.id}/edit`)}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-dash p-10 flex flex-col items-center text-center gap-3">
          <span className="w-12 h-12 rounded-full bg-blue-14 text-blue flex items-center justify-center">
            <StickyNote className="w-6 h-6" />
          </span>
          <p className="body-medium font-semibold text-primary-500">No notes yet</p>
          <p className="body-sm-regular text-primary-300 max-w-sm">
            Add an internal note to keep track of feedback, agreements, or follow-ups for this instructor.
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete Note"
        message={
          <>
            Delete <span className="font-semibold">&quot;{pendingDelete?.title}&quot;</span>? Other admins will no longer see it.
          </>
        }
        confirmLabel="Delete Note"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </InstructorDetailCard>
  );
}

export default InstructorNotesTab;
