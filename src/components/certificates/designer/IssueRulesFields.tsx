"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { NumberUnitInput } from "./NumberUnitInput";
import { numberError } from "./designerUtils";

const DEFAULT_QUIZ = 60;
const DEFAULT_MONTHS = 12;

function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
          <div className="max-w-56 pl-14 pt-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Auto-issue, minimum completion, minimum quiz score (null when off), assignments and expiry (null = never). */
export function IssueRulesFields() {
  const { control, setValue, clearErrors } = useFormContext<TemplateFormValues>();
  const [minQuizScore, validityMonths] = useWatch({ control, name: ["rules.minQuizScore", "rules.validityMonths"] });
  const quizOn = minQuizScore !== null && minQuizScore !== undefined;
  const neverExpires = validityMonths === null || validityMonths === undefined;

  return (
    <div className="space-y-5">
      <Controller
        control={control}
        name="rules.autoIssue"
        render={({ field }) => (
          <SettingToggleRow
            id="cert-rule-auto"
            title="Issue automatically"
            description="Send the certificate as soon as a learner meets the rules. Turn off to issue manually."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="max-w-56">
        <FieldLabel htmlFor="cert-rule-completion" label="Minimum completion" required />
        <Controller
          control={control}
          name="rules.minCompletion"
          render={({ field, fieldState }) => (
            <NumberUnitInput
              id="cert-rule-completion"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              unit="%"
              min={1}
              max={100}
              placeholder="100"
              error={numberError(fieldState.error?.message, "Enter a percentage")}
            />
          )}
        />
        <p className="mt-1.5 body-xsm-regular text-primary-300">Share of lessons the learner must finish.</p>
      </div>

      <div>
        <SettingToggleRow
          id="cert-rule-quiz"
          title="Require a minimum quiz score"
          description="Average score across the course quizzes."
          checked={quizOn}
          onChange={(on) => {
            setValue("rules.minQuizScore", on ? DEFAULT_QUIZ : null, { shouldDirty: true });
            if (!on) clearErrors("rules.minQuizScore");
          }}
        />
        <Reveal show={quizOn}>
          <Controller
            control={control}
            name="rules.minQuizScore"
            render={({ field, fieldState }) => (
              <NumberUnitInput
                id="cert-rule-quiz-score"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                unit="%"
                min={1}
                max={100}
                placeholder="60"
                error={numberError(fieldState.error?.message, "Enter a percentage")}
              />
            )}
          />
        </Reveal>
      </div>

      <Controller
        control={control}
        name="rules.requireAssignments"
        render={({ field }) => (
          <SettingToggleRow
            id="cert-rule-assignments"
            title="Require all assignments"
            description="Every assignment must be graded and passed."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div>
        <SettingToggleRow
          id="cert-rule-expiry"
          title="Never expires"
          description="Turn off to set how long the certificate stays valid."
          checked={neverExpires}
          onChange={(never) => {
            setValue("rules.validityMonths", never ? null : DEFAULT_MONTHS, { shouldDirty: true });
            if (never) clearErrors("rules.validityMonths");
          }}
        />
        <Reveal show={!neverExpires}>
          <FieldLabel htmlFor="cert-rule-months" label="Valid for" required />
          <Controller
            control={control}
            name="rules.validityMonths"
            render={({ field, fieldState }) => (
              <NumberUnitInput
                id="cert-rule-months"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                unit="months"
                min={1}
                max={120}
                placeholder="12"
                error={numberError(fieldState.error?.message, "Enter the number of months")}
              />
            )}
          />
        </Reveal>
      </div>
    </div>
  );
}

export default IssueRulesFields;
