"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { InstructorItem, InstructorNoteItem } from "@/types/instructor";
import { InstructorNoteInput } from "@/validations/instructorSchema";
import { getInstructorNotes, getStoredInstructors, saveInstructorNote } from "@/lib/instructorStorage";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { buildInstructorDetails } from "../../instructorDetailsData";
import { InstructorDetailsHeader } from "../../InstructorDetailsHeader";
import { InstructorNotFound } from "../../InstructorNotFound";
import { InstructorNoteForm } from "./InstructorNoteForm";
import { NoteFormSkeleton } from "./NoteFormSkeleton";

interface InstructorNoteFormPageProps {
  instructorId: string;
  /** Present when editing an existing note. */
  noteId?: string;
}

const CURRENT_ADMIN = {
  name: "Admin",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
};

/** Shared Add Note / Edit Note page body. */
export function InstructorNoteFormPage({ instructorId, noteId }: InstructorNoteFormPageProps) {
  const router = useRouter();
  const [instructor, setInstructor] = useState<InstructorItem | null>(null);
  const [note, setNote] = useState<InstructorNoteItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInstructor(getStoredInstructors().find((i) => i.id === instructorId) ?? null);
      if (noteId) setNote(getInstructorNotes(instructorId).find((n) => n.id === noteId) ?? null);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [instructorId, noteId]);

  const details = useMemo(() => (instructor ? buildInstructorDetails(instructor) : null), [instructor]);

  if (isLoading) return <NoteFormSkeleton />;
  if (!instructor || !details || (noteId && !note)) return <InstructorNotFound />;

  const isEdit = !!note;
  const detailsHref = `/instructors/${instructor.id}`;
  const notesHref = `${detailsHref}?tab=notes`;

  const handleSubmit = async (data: InstructorNoteInput) => {
    const toastId = toast.loading(isEdit ? "Saving note..." : "Adding note...", {
      description: data.title,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const now = new Date().toISOString();
      saveInstructorNote({
        id: note?.id ?? `${instructor.id}-note-${Date.now()}`,
        instructorId: instructor.id,
        title: data.title,
        content: sanitizeHtml(data.content),
        type: data.type,
        priority: data.priority,
        tags: data.tags,
        reminderDate: data.hasReminder ? data.reminderDate : undefined,
        author: note?.author ?? CURRENT_ADMIN,
        createdAt: note?.createdAt ?? now,
        updatedAt: isEdit ? now : undefined,
      });
      toast.success(isEdit ? "Note updated" : "Note added", {
        id: toastId,
        description: `"${data.title}" is saved to ${instructor.name}'s notes.`,
      });
      router.push(notesHref);
    } catch (error) {
      toast.error(isEdit ? "Could not update note" : "Could not add note", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 text-left pb-10"
    >
      <InstructorDetailsHeader
        details={details}
        showSummary={false}
        backHref={notesHref}
        backLabel="Back to Notes"
        breadcrumbs={[
          { label: "Instructors", href: "/instructors" },
          { label: "Instructor Details", href: notesHref },
          { label: isEdit ? "Edit Note" : "Add Note" },
        ]}
      />

      <InstructorNoteForm
        mode={isEdit ? "edit" : "create"}
        cancelHref={notesHref}
        onSubmit={handleSubmit}
        defaultValues={
          note
            ? {
                title: note.title,
                content: note.content,
                type: note.type,
                priority: note.priority,
                tags: note.tags,
                hasReminder: !!note.reminderDate,
                reminderDate: note.reminderDate,
              }
            : {}
        }
      />
    </motion.div>
  );
}

export default InstructorNoteFormPage;
