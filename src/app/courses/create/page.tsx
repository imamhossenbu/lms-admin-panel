"use client";

import React, { Suspense } from "react";
import { CreateCourseView } from "@/components/courses/create/CreateCourseView";
import { CourseCreateSkeleton } from "@/components/courses/create/CourseCreateSkeleton";

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<CourseCreateSkeleton />}>
      <CreateCourseView />
    </Suspense>
  );
}
