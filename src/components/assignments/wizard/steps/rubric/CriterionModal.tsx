"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { wizardCriterionSchema, type WizardCriterion } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";
import { newCriterionId } from "./rubricTemplates";

export interface CriterionModalProps {
  isOpen: boolean;
  /** null = add a new criterion. */
  criterion: WizardCriterion | null;
  /** 1-based number shown in the title when editing. */
  number: number;
  /** Suggested points for a new criterion (remaining to reach the total). */
  suggestedPoints: number;
  onClose: () => void;
  onSave: (criterion: WizardCriterion) => void;
}

const blank = (points: number): WizardCriterion => ({ id: newCriterionId(), title: "", description: "", points: Math.max(1, points) });

/** Add / edit one rubric criterion (own form validated with wizardCriterionSchema). */
export function CriterionModal({ isOpen, criterion, number, suggestedPoints, onClose, onSave }: CriterionModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WizardCriterion>({
    resolver: zodResolver(wizardCriterionSchema),
    defaultValues: criterion ?? blank(suggestedPoints),
    mode: "onTouched",
  });
  const [title, description] = useWatch({ control, name: ["title", "description"] });

  useEffect(() => {
    if (isOpen) reset(criterion ? { ...criterion } : blank(suggestedPoints));
  }, [isOpen, criterion, suggestedPoints, reset]);

  const submit = handleSubmit((values) => onSave({ ...values, title: values.title.trim(), description: values.description.trim() }));

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={criterion ? `Edit Criterion ${number}` : "Add Criterion"}
      subtitle="Name the criterion, describe what it checks and set its maximum points."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="wizard-criterion-form" isLoading={isSubmitting}>
            {criterion ? "Save Criterion" : "Add Criterion"}
          </PrimaryButton>
        </>
      }
    >
      <form id="wizard-criterion-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <InputField id="wizard-criterion-title" label="Criterion Name" required placeholder="e.g. HTML Structure" error={errors.title?.message} {...register("title")} />
            <CharCounter count={(title ?? "").length} max={80} className="mt-1" />
          </div>
          <InputField
            id="wizard-criterion-points"
            label="Points"
            required
            type="number"
            min={1}
            max={1000}
            error={errors.points?.message}
            {...register("points", { valueAsNumber: true })}
          />
        </div>
        <WizardField label="Description" htmlFor="wizard-criterion-description" required>
          <TextAreaField
            id="wizard-criterion-description"
            rows={3}
            placeholder="What does a full-marks submission include?"
            error={errors.description?.message}
            {...register("description")}
          />
          <CharCounter count={(description ?? "").length} max={200} className="mt-1" />
        </WizardField>
      </form>
    </ModalShell>
  );
}

export default CriterionModal;
