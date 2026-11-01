"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { LessonRichContent } from "./LessonRichContent";
import { LessonVideoSection } from "./LessonVideoSection";
import { LessonQuizBuilder } from "../quiz/LessonQuizBuilder";

export interface LessonContentTabProps {
  /** Reports a video upload in progress so the modal can block saving / closing meanwhile. */
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Add Lesson → Content tab: video (upload / YouTube / Vimeo / external link) + rich-text lesson content.
 * QUIZ lessons show the quiz builder instead of the video section.
 */
export function LessonContentTab({ onUploadingChange }: LessonContentTabProps) {
  const { control } = useFormContext<LessonFormValues>();
  const type = useWatch({ control, name: "type" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-7"
    >
      {type === "QUIZ" ? (
        <LessonQuizBuilder />
      ) : (
        <LessonVideoSection optional={type !== "VIDEO"} onUploadingChange={onUploadingChange} />
      )}
      <LessonRichContent required={type === "TEXT" || type === "CODING"} />
    </motion.div>
  );
}

export default LessonContentTab;
