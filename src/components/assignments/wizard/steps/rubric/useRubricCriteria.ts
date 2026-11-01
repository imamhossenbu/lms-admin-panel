"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { AssignmentItem } from "@/types/assignment";
import type { AssignmentWizardValues, WizardCriterion } from "@/validations/assignmentWizardSchema";
import { criteriaFromWeights, type RubricTemplate } from "./rubricTemplates";
import type { CriterionField } from "./rubricTypes";

/** Pending rubric replacement waiting for confirmation. */
export interface PendingRubric {
  label: string;
  title: string;
  description: string;
  criteria: WizardCriterion[];
}

/** Single owner of the `criteria` field array + template / copy / modal state for the Rubric step. */
export function useRubricCriteria() {
  const { control, getValues, setValue, trigger, formState } = useFormContext<AssignmentWizardValues>();
  const { fields, append, update, remove, move, replace } = useFieldArray({ control, name: "criteria", keyName: "fieldKey" });
  // Snapshot taken when the modal opens (stable while it is open).
  const [modal, setModal] = useState<{ open: boolean; index: number | null; criterion: WizardCriterion | null; suggested: number }>({
    open: false,
    index: null,
    criterion: null,
    suggested: 1,
  });
  const editIndex = modal.index;
  const [copyOpen, setCopyOpen] = useState(false);
  const [pending, setPending] = useState<PendingRubric | null>(null);

  const revalidate = () => {
    if (formState.submitCount > 0 || formState.errors.criteria) void trigger("criteria");
  };

  const apply = (r: PendingRubric) => {
    replace(r.criteria);
    if (r.title) setValue("rubricTitle", r.title, { shouldDirty: true, shouldValidate: !!formState.errors.rubricTitle });
    if (r.description) setValue("rubricDescription", r.description, { shouldDirty: true });
    toast.success("Rubric applied", { description: `${r.label} — ${r.criteria.length} criteria, points distributed to ${getValues("totalPoints")}.` });
    revalidate();
  };

  const request = (r: PendingRubric) => (fields.length ? setPending(r) : apply(r));

  const total = () => {
    const t = getValues("totalPoints");
    return Number.isFinite(t) && t > 0 ? t : 32;
  };

  const pickTemplate = (t: RubricTemplate) =>
    request({ label: t.name, title: t.rubricTitle, description: t.rubricDescription, criteria: criteriaFromWeights(t.criteria, total()) });

  const pickAssignment = (a: AssignmentItem) => {
    setCopyOpen(false);
    request({
      label: `Copied from “${a.title}”`,
      title: a.rubric.title,
      description: a.rubric.description,
      criteria: criteriaFromWeights(a.rubric.criteria.map((c) => ({ title: c.title, description: c.description, weight: c.points })), total()),
    });
  };

  const criteriaSum = () => (getValues("criteria") ?? []).reduce((s, c) => s + (Number.isFinite(c.points) ? c.points : 0), 0);
  const openAdd = () => setModal({ open: true, index: null, criterion: null, suggested: Math.max(1, total() - criteriaSum()) });
  const openEdit = (i: number) => setModal({ open: true, index: i, criterion: { ...getValues(`criteria.${i}`) }, suggested: 1 });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const save = (c: WizardCriterion) => {
    if (editIndex === null) {
      if (fields.length >= 12) {
        toast.error("Criteria limit reached", { description: "A rubric can have up to 12 criteria." });
        return;
      }
      append(c);
      toast.success("Criterion added", { description: c.title });
    } else {
      update(editIndex, c);
      toast.success("Criterion updated", { description: c.title });
    }
    closeModal();
    revalidate();
  };

  const removeAt = (i: number) => {
    const title = getValues(`criteria.${i}.title`);
    remove(i);
    toast.success("Criterion removed", { description: title });
    revalidate();
  };

  return {
    fields: fields as CriterionField[],
    move,
    editing: modal.criterion,
    editIndex,
    modalOpen: modal.open,
    closeModal,
    openAdd,
    openEdit,
    save,
    removeAt,
    copyOpen,
    setCopyOpen,
    pickTemplate,
    pickAssignment,
    pending,
    clearPending: () => setPending(null),
    confirmPending: async () => {
      if (pending) apply(pending);
    },
    suggestedPoints: modal.suggested,
    revalidate,
  };
}
