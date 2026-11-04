"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { InstructorNoteInput } from "@/validations/instructorSchema";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage } from "@/lib/apiError";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { useInstructorProfile } from "@/lib/instructors/useInstructorProfile";
import { InstructorDetailsHeader } from "../../InstructorDetailsHeader";
import { InstructorNotFound } from "../../InstructorNotFound";
import { InstructorNoteForm } from "./InstructorNoteForm";
import { NoteFormSkeleton } from "./NoteFormSkeleton";

interface InstructorNoteFormPageProps {
  instructorId: string;
  /** Present when editing an existing note. */
  noteId?: string;
}

/** Shared Add Note / Edit Note page body (saves through the Instructors API). */
export function InstructorNoteFormPage({ instructorId, noteId }: InstructorNoteFormPageProps) {
  const router = useRouter();
  const { state } = useInstructorProfile(instructorId);

  if (state.kind === "loading") return <NoteFormSkeleton />;
  if (state.kind === "error") return <InstructorNotFound message={state.status === 404 ? undefined : state.message} />;
  const note = noteId ? state.notes.find((n) => n.id === noteId) ?? null : null;
  if (noteId && !note) return <InstructorNotFound />;

  const { details } = state;
  const instructor = details.instructor;
  const isEdit = !!note;
  const detailsHref = `/instructors/${instructor.id}`;
  const notesHref = `${detailsHref}?tab=notes`;

  const handleSubmit = async (data: InstructorNoteInput) => {
    const toastId = toast.loading(isEdit ? "Saving note..." : "Adding note...", { description: data.title });
    const payload = {
      title: data.title.trim(),
      content: sanitizeHtml(data.content),
      type: data.type,
      priority: data.priority,
      tags: data.tags,
      hasReminder: data.hasReminder,
      reminderDate: data.hasReminder ? data.reminderDate : undefined,
    };
    try {
      if (note) await instructorsApi.updateNote(instructor.id, note.id, payload);
      else await instructorsApi.addNote(instructor.id, payload);
      toast.success(isEdit ? "Note updated" : "Note added", { id: toastId, description: `"${data.title}" is saved to ${instructor.name}'s notes.` });
      router.push(notesHref);
    } catch (err) {
      toast.error(isEdit ? "Couldn't update the note" : "Couldn't add the note", { id: toastId, description: apiErrorMessage(err) });
      throw err;
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
