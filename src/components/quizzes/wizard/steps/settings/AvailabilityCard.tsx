"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CalendarDays } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizField } from "../../shell/QuizField";
import { SettingsSubCard } from "./SettingsSubCard";

/** Start Date / End Date (both optional; end must not be before start). */
export function AvailabilityCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuizWizardValues>();
  const fields = [
    { name: "startDate" as const, label: "Start Date", helper: "When the quiz will be available." },
    { name: "endDate" as const, label: "End Date", helper: "When the quiz will be closed." },
  ];
  return (
    <SettingsSubCard icon={<CalendarDays className="h-4 w-4" />} title="Availability" index={2}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const error = errors[f.name]?.message;
          return (
            <QuizField key={f.name} label={f.label} htmlFor={`quiz-${f.name}`} optional error={error} helper={f.helper}>
              <InputField
                id={`quiz-${f.name}`}
                type="date"
                aria-invalid={!!error}
                className={error ? "h-11 border-red! bg-red-14!" : "h-11"}
                leftElement={<CalendarDays className="h-4 w-4" />}
                {...register(f.name, { deps: f.name === "startDate" ? ["endDate"] : undefined })}
              />
            </QuizField>
          );
        })}
      </div>
    </SettingsSubCard>
  );
}

export default AvailabilityCard;
