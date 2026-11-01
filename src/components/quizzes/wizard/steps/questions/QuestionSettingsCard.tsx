"use client";

import React from "react";
import { Settings } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { hasShuffle } from "./questionKinds";

export interface QuestionSettingsCardProps {
  questionIndex: number;
  revalidate: () => void;
}

/** Right column: Points, per-question Time Limit, Required + Shuffle Options toggles. */
export function QuestionSettingsCard({ questionIndex: qi, revalidate }: QuestionSettingsCardProps) {
  const { control, register, formState } = useFormContext<QuizWizardValues>();
  const kind = useWatch({ control, name: `questions.${qi}.kind` });
  const errors = formState.errors.questions?.[qi];

  return (
    <IconSectionCard icon={<Settings className="h-5 w-5" />} tone="orange" title="Question Settings" bodyClassName="mt-5 space-y-5">
      <div>
        <InputField
          id={`question-${qi}-points`}
          label="Points"
          required
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          step={1}
          error={errors?.points?.message}
          className="no-spinner"
          {...register(`questions.${qi}.points`, { valueAsNumber: true, onChange: revalidate })}
        />
        {!errors?.points && <p className="mt-1.5 body-xsm-regular text-primary-300">Set points for this question.</p>}
      </div>

      <Controller
        control={control}
        name={`questions.${qi}.timeLimitSeconds`}
        render={({ field, fieldState }) => (
          <div>
            <InputField
              id={`question-${qi}-time`}
              label={
                <>
                  Time Limit <span className="text-primary-300">(Optional)</span>
                </>
              }
              type="number"
              inputMode="numeric"
              min={5}
              max={3600}
              step={1}
              placeholder="No limit"
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value === "" ? null : Number(e.target.value));
                revalidate();
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              error={fieldState.error?.message}
              className="no-spinner pr-20!"
              rightElement={<span className="body-xsm-regular text-primary-300">seconds</span>}
            />
            {!fieldState.error && <p className="mt-1.5 body-xsm-regular text-primary-300">Leave empty for no limit on this question.</p>}
          </div>
        )}
      />

      <Controller
        control={control}
        name={`questions.${qi}.required`}
        render={({ field }) => (
          <SettingToggleRow
            title="Required Question"
            description="Students must answer this question."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {hasShuffle(kind) && (
        <Controller
          control={control}
          name={`questions.${qi}.shuffleOptions`}
          render={({ field }) => (
            <SettingToggleRow
              title="Shuffle Options"
              description="Display options in random order."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </IconSectionCard>
  );
}

export default QuestionSettingsCard;
