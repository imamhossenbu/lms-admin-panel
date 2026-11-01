"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { LessonEditorView } from "@/components/courses/lesson-editor/LessonEditorView";
import { LessonEditorSkeleton } from "@/components/courses/lesson-editor/LessonEditorSkeleton";

/** Edit Lesson: full-page lesson editor (Content, Media, Settings, Access, Drip, SEO, Quiz, Resources, Notes). */
function EditLessonContent() {
  const params = useParams<{ id: string; lessonId: string }>();
  return <LessonEditorView key={`${params.id}:${params.lessonId}`} courseId={params.id} lessonId={params.lessonId} />;
}

export default function EditLessonPage() {
  return (
    <Suspense fallback={<LessonEditorSkeleton />}>
      <EditLessonContent />
    </Suspense>
  );
}
