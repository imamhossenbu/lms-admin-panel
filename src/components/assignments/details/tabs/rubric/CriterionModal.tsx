"use client";

import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { rubricCriterionSchema } from "@/validations/assignmentSchema";
import type { RubricCriterion } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { LEVEL_STYLE, newCriterion } from "./rubricUtils";

type CriterionInput = z.input<typeof rubricCriterionSchema>;

export interface CriterionModalProps {
  isOpen: boolean;
  /** null = adding a new criterion. */
  criterion: RubricCriterion | null;
  number: number;
  onClose: () => void;
  onSave: (criterion: RubricCriterion) => void;
}

/** Add / edit one rubric criterion (title, description, max points and every performance level). */
export function CriterionModal({ isOpen, criterion, number, onClose, onSave }: CriterionModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CriterionInput, unknown, RubricCriterion>({
    resolver: zodResolver(rubricCriterionSchema),
    defaultValues: criterion ?? newCriterion(),
    mode: "onTouched",
  });
  const { fields } = useFieldArray({ control, name: "levels", keyName: "fieldKey" });

  useEffect(() => {
    if (isOpen) reset(structuredClone(criterion ?? newCriterion()));
  }, [isOpen, criterion, reset]);

  const submit = handleSubmit((values) => onSave(values));

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={criterion ? `Edit Criterion ${number}` : "Add Criterion"}
      subtitle="Name the criterion and describe what each performance level looks like."
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="criterion-form" isLoading={isSubmitting}>
            {criterion ? "Save Criterion" : "Add Criterion"}
          </PrimaryButton>
        </>
      }
    >
      <form id="criterion-form" onSubmit={submit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputField
            id="criterion-title"
            label="Criterion Name"
            required
            placeholder="e.g. HTML Structure"
            containerClassName="sm:col-span-2"
            error={errors.title?.message}
            {...register("title")}
          />
          <InputField
            id="criterion-points"
            label="Points"
            required
            type="number"
            min={1}
            className="no-spinner"
            error={errors.points?.message}
            {...register("points", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label htmlFor="criterion-description" className="block body-sm-regular text-primary-400 mb-2 select-none">
            Description
          </label>
          <TextAreaField
            id="criterion-description"
            rows={2}
            placeholder="What does this criterion check? e.g. Uses semantic HTML elements correctly"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        <div className="space-y-3">
          <p className="body-sm-medium text-primary-500">Performance Levels</p>
          {fields.map((field, i) => {
            const style = LEVEL_STYLE[field.tone];
            const levelErrors = errors.levels?.[i];
            return (
              <div key={field.fieldKey} className={cn("rounded-xl border p-3.5 space-y-3", style.border)}>
                <ToneBadge tone={style.badge} size="sm">
                  Level {i + 1}
                </ToneBadge>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField
                    id={`level-${i}-label`}
                    label="Label"
                    containerClassName="sm:col-span-2"
                    error={levelErrors?.label?.message}
                    {...register(`levels.${i}.label`)}
                  />
                  <InputField
                    id={`level-${i}-points`}
                    label="Points"
                    type="number"
                    min={0}
                    className="no-spinner"
                    error={levelErrors?.points?.message}
                    {...register(`levels.${i}.points`, { valueAsNumber: true })}
                  />
                </div>
                <TextAreaField
                  rows={2}
                  aria-label={`Level ${i + 1} description`}
                  placeholder="What does this level look like?"
                  error={levelErrors?.description?.message}
                  {...register(`levels.${i}.description`)}
                />
              </div>
            );
          })}
          {errors.levels?.message && <p className="body-xsm-regular text-red">{errors.levels.message}</p>}
        </div>
      </form>
    </ModalShell>
  );
}

export default CriterionModal;
