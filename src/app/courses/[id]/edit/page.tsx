"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { CreateCourseView } from "@/components/courses/create/CreateCourseView";
import { CourseCreateSkeleton } from "@/components/courses/create/CourseCreateSkeleton";

/** Edit Course: the same 5-step wizard as Create Course, loaded with the existing course. */
function EditCourseContent() {
  const params = useParams<{ id: string }>();
  return <CreateCourseView key={params.id} courseId={params.id} />;
}

export default function EditCoursePage() {
  return (
    <Suspense fallback={<CourseCreateSkeleton />}>
      <EditCourseContent />
    </Suspense>
  );
}
