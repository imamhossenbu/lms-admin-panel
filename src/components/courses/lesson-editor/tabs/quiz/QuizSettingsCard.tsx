"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { QuizDetailsFields } from "./QuizDetailsFields";
import { QuizDisabledState } from "./QuizDisabledState";

/** Left "Quiz Settings" card: "Enable Quiz" toggle in the header, details or an empty state below. */
export function QuizSettingsCard() {
  const { control, clearErrors } = useFormContext<LessonEditorValues>();
  const { field } = useController({ control, name: "quiz.enabled" });
  const enabled = Boolean(field.value);

  const setEnabled = (next: boolean) => {
    field.onChange(next);
    if (!next) clearErrors("quiz");
  };

  return (
    <IconSectionCard
      icon={<ClipboardCheck className="h-5 w-5" />}
      title="Quiz Settings"
      description="Add a quiz to this lesson to test student knowledge."
      action={
        <SettingToggleRow
          id="quiz-enabled"
          title="Enable Quiz"
          description="Turn on to add quiz for this lesson."
          checked={enabled}
          onChange={setEnabled}
          className="max-w-56"
        />
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <QuizDetailsFields />
          </motion.div>
        ) : (
          <QuizDisabledState key="disabled" onEnable={() => setEnabled(true)} />
        )}
      </AnimatePresence>
    </IconSectionCard>
  );
}

export default QuizSettingsCard;
