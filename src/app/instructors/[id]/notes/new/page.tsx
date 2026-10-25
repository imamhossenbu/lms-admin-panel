"use client";

import React from "react";
import { InstructorNoteFormPage } from "@/components/instructors/details/notes/form/InstructorNoteFormPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AddInstructorNotePage({ params }: PageProps) {
  const { id } = React.use(params);
  return <InstructorNoteFormPage instructorId={id} />;
}
