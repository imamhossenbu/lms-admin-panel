"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { loadCourseContext } from "@/lib/courseCatalog";
import { SelectController } from "./SelectController";
import { courseOptions, moduleOptions } from "./basicOptions";

/**
 * Course * and Module * selects (side by side). `context` is the currently selected course; the module
 * list follows it. Switching course clears module + lesson unless the module also belongs to the new course.
 */
export function CourseModuleFields({ context }: { context: LessonEditorContext }) {
  const { getValues, setValue } = useFormContext<AssignmentWizardValues>();
  const hasCourse = !!context.course.id;

  const onCourseChange = (courseId: string) => {
    // A module id is unique to its course, so switching course always clears module + lesson.
    const moduleId = getValues("moduleId");
    setValue("moduleId", "", { shouldDirty: true });
    setValue("lessonId", "", { shouldDirty: true });
    void loadCourseContext(courseId).then((next) => {
      if (moduleId && next?.modules.some((m) => m.id === moduleId)) setValue("moduleId", moduleId, { shouldDirty: true });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <SelectController
        name="courseId"
        label="Course"
        required
        options={courseOptions(context)}
        placeholder="Select a course"
        onValueChange={onCourseChange}
      />
      <SelectController
        name="moduleId"
        label="Module"
        required
        options={moduleOptions(context)}
        placeholder={hasCourse ? "Select a module" : "Select a course first"}
        disabled={!hasCourse}
      />
    </div>
  );
}

export default CourseModuleFields;
