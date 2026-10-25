"use client";

import React from "react";
import { InstructorNoteFormPage } from "@/components/instructors/details/notes/form/InstructorNoteFormPage";

interface PageProps {
  params: Promise<{ id: string; noteId: string }>;
}

export default function EditInstructorNotePage({ params }: PageProps) {
  const { id, noteId } = React.use(params);
  return <InstructorNoteFormPage instructorId={id} noteId={noteId} />;
}
