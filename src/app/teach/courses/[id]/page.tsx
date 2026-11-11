"use client";

import React, { use } from "react";
import { TeacherCourseDetailView } from "@/components/teacher/courses/TeacherCourseDetailView";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TeacherCourseDetailView id={id} />;
}
