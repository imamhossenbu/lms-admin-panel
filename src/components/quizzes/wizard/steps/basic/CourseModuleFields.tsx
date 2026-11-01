"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { QuizCourseRef } from "@/types/quiz";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizSelectField } from "../../shell/QuizSelectField";
import { courseOptions, moduleOptions } from "../../quizWizardOptions";

/** Course * and Module * selects — the module list follows the course and resets when it changes. */
export function CourseModuleFields({ courses }: { courses: QuizCourseRef[] }) {
  const { control, setValue } = useFormContext<QuizWizardValues>();
  const courseId = useWatch({ control, name: "courseId" });
  return (
    <>
      <QuizSelectField
        name="courseId"
        label="Course"
        required
        options={courseOptions(courses)}
        placeholder="Select a course"
        helper="Select the course for this quiz."
        onAfterChange={() => setValue("moduleId", "", { shouldDirty: true })}
      />
      <QuizSelectField
        name="moduleId"
        label="Module"
        required
        options={moduleOptions(courses, courseId)}
        placeholder={courseId ? "Select a module" : "Select a course first"}
        helper="Select the module for this quiz."
        disabled={!courseId}
      />
    </>
  );
}

export default CourseModuleFields;
