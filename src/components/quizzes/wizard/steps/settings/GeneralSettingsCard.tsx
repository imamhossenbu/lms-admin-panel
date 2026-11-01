"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileText, Lock } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { quizTotalMarks, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { passPercent } from "../../quizWizardFormat";
import { difficultyOptions } from "../../quizWizardOptions";
import { QuizField } from "../../shell/QuizField";
import { QuizSelectField } from "../../shell/QuizSelectField";
import { SettingsSubCard } from "./SettingsSubCard";

const errorInput = (error?: string) => (error ? "h-11 border-red! bg-red-14!" : "h-11");

/** Total Marks (read-only, sum of question points), Difficulty, Passing Marks *, Time Limit. */
export function GeneralSettingsCard() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QuizWizardValues>();
  const [questions, passingMarks] = useWatch({ control, name: ["questions", "passingMarks"] });
  const total = quizTotalMarks(questions ?? []);
  const passingError = errors.passingMarks?.message;
  const passingHelper =
    total > 0 && Number.isFinite(passingMarks) && passingMarks > 0
      ? `${passPercent(passingMarks, total)}% (${passingMarks} out of ${total})`
      : "Minimum marks a student needs to pass.";

  return (
    <SettingsSubCard icon={<FileText className="h-4 w-4" />} title="General Settings" index={0}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <QuizField label="Total Marks" htmlFor="quiz-total-marks" helper={total > 0 ? "Sum of all question points." : "Add questions to calculate the total."}>
          <InputField
            id="quiz-total-marks"
            value={total}
            readOnly
            aria-readonly
            tabIndex={-1}
            className="h-11 cursor-not-allowed bg-gray-bg! text-primary-400!"
            rightElement={<Lock className="h-4 w-4" />}
          />
        </QuizField>
        <QuizSelectField name="difficulty" label="Difficulty Level" options={difficultyOptions} helper="Set the difficulty level." />

        <QuizField label="Passing Marks" htmlFor="quiz-passing-marks" required error={passingError} helper={passingHelper}>
          <InputField
            id="quiz-passing-marks"
            type="number"
            min={1}
            max={total || undefined}
            inputMode="numeric"
            aria-invalid={!!passingError}
            className={errorInput(passingError)}
            {...register("passingMarks", { valueAsNumber: true })}
          />
        </QuizField>

        <Controller
          control={control}
          name="timeLimitMinutes"
          render={({ field, fieldState }) => (
            <QuizField
              label="Time Limit"
              htmlFor="quiz-time-limit"
              optional
              error={fieldState.error?.message}
              helper={field.value ? `Students will have ${field.value} minutes to complete this quiz.` : "Leave empty for no time limit."}
            >
              <InputField
                id="quiz-time-limit"
                type="number"
                min={1}
                max={600}
                inputMode="numeric"
                placeholder="No limit"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                onBlur={field.onBlur}
                aria-invalid={!!fieldState.error}
                className={`${errorInput(fieldState.error?.message)} pr-20!`}
                rightElement={<span className="body-sm-regular text-primary-300">minutes</span>}
              />
            </QuizField>
          )}
        />
      </div>
    </SettingsSubCard>
  );
}

export default GeneralSettingsCard;
