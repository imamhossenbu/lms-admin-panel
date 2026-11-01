"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import { QuizSettingsCard } from "./QuizSettingsCard";
import { QuizQuestionsCard } from "./QuizQuestionsCard";
import { QuestionSettingsCard } from "./QuestionSettingsCard";
import { TimeAttemptsCard } from "./TimeAttemptsCard";
import { CompletionSettingsCard } from "./CompletionSettingsCard";

/** Edit Lesson → Quiz tab (form section "quiz"). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QuizTab(_props: LessonEditorTabProps) {
  const { control } = useFormContext<LessonEditorValues>();
  const enabled = useWatch({ control, name: "quiz.enabled" });
  const off = !enabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <QuizSettingsCard />
        <AnimatePresence initial={false}>
          {enabled && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <QuizQuestionsCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div aria-disabled={off} className={off ? "min-w-0 space-y-5 opacity-60" : "min-w-0 space-y-5"}>
        <QuestionSettingsCard disabled={off} />
        <TimeAttemptsCard disabled={off} />
        <CompletionSettingsCard disabled={off} />
      </div>
    </motion.div>
  );
}

export default QuizTab;
