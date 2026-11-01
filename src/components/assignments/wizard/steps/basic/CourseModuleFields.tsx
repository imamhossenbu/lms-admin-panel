"use client";

import React from "react";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { SelectController } from "./SelectController";
import { courseOptions, moduleOptions } from "./basicOptions";

/** Course * and Module * selects (side by side). */
export function CourseModuleFields({ context }: { context: LessonEditorContext }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <SelectController name="courseId" label="Course" required options={courseOptions(context)} placeholder="Select a course" />
      <SelectController name="moduleId" label="Module" required options={moduleOptions(context)} placeholder="Select a module" />
    </div>
  );
}

export default CourseModuleFields;
