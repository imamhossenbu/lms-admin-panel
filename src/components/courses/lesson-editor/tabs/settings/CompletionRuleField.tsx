"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, Hand, Percent, PlayCircle } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorFieldLabel } from "../../fields/FieldLabel";

type CompletionRule = LessonEditorValues["settings"]["completion"];

const COMPLETION_OPTIONS: ChoiceOption<CompletionRule>[] = [
  { value: "MANUAL", title: "Mark as complete manually", description: "Students click “Mark as complete” when done.", icon: <Hand className="h-5 w-5 text-blue" /> },
  { value: "AUTO_VIDEO", title: "Auto-complete after watching", description: "Completes once enough of the video is watched.", icon: <PlayCircle className="h-5 w-5 text-green" /> },
  { value: "ASSESSMENT", title: "Require assessment", description: "Students must pass the lesson quiz to complete.", icon: <ClipboardCheck className="h-5 w-5 text-purple" /> },
];

/** "Completion Rule" choice cards + "Watch threshold %" (only for auto-complete). */
export function CompletionRuleField() {
  const { control, register, formState: { errors } } = useFormContext<LessonEditorValues>();
  const completion = useWatch({ control, name: "settings.completion" });

  return (
    <div className="space-y-4">
      <div>
        <EditorFieldLabel>Completion Rule</EditorFieldLabel>
        <p className="-mt-1 mb-3 body-xsm-regular text-primary-300">Decide when this lesson counts as completed for a student.</p>
        <Controller
          control={control}
          name="settings.completion"
          render={({ field }) => (
            <ChoiceCardGroup name="lesson-completion" aria-label="Completion rule" columns={3} value={field.value} onChange={field.onChange} options={COMPLETION_OPTIONS} />
          )}
        />
      </div>

      <AnimatePresence initial={false}>
        {completion === "AUTO_VIDEO" && (
          <motion.div
            key="threshold"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
              <div className="sm:w-56">
                <EditorFieldLabel htmlFor="lesson-watch-threshold" required>Watch threshold %</EditorFieldLabel>
                <InputField
                  id="lesson-watch-threshold"
                  type="number"
                  min={10}
                  max={100}
                  inputMode="numeric"
                  rightElement={<Percent className="h-4 w-4" />}
                  error={errors.settings?.watchThreshold?.message}
                  {...register("settings.watchThreshold", { valueAsNumber: true })}
                />
              </div>
              <p className="body-xsm-regular text-primary-300 sm:pt-9">Between 10% and 100% of the video must be watched.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CompletionRuleField;
