"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { rubricSchema, type RubricFormValues } from "@/validations/assignmentSchema";
import { updateAssignment } from "@/lib/assignmentStorage";
import type { AssignmentItem } from "@/types/assignment";
import type { AssignmentTabProps } from "../../tabTypes";
import { RubricInfoCard } from "./RubricInfoCard";
import { RubricCriteriaCard } from "./RubricCriteriaCard";
import { RubricSaveBar } from "./RubricSaveBar";
import { RubricSummaryCard } from "./RubricSummaryCard";
import { RubricQuickActions, type RubricActionKey } from "./RubricQuickActions";
import { RubricTipsCard } from "./RubricTipsCard";
import { RubricPreviewModal } from "./RubricPreviewModal";
import { ImportRubricModal } from "./ImportRubricModal";
import { cloneCriteria, downloadJson, errorMessage, slugify, toRubricForm } from "./rubricUtils";

const FORM_ID = "assignment-rubric-form";
type RubricInput = z.input<typeof rubricSchema>;

/** Assignment Details → Rubric tab: one form for rubric info + criteria, sidebar summary & actions. */
export function RubricTab({ assignment, onAssignmentChange }: AssignmentTabProps) {
  const methods = useForm<RubricInput, unknown, RubricFormValues>({
    resolver: zodResolver(rubricSchema),
    defaultValues: toRubricForm(assignment.rubric),
    mode: "onTouched",
  });
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty, isSubmitting },
  } = methods;
  const criteriaCount = useWatch({ control, name: "criteria" })?.length ?? 0;
  const enabled = useWatch({ control, name: "enabled" });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const persist = async (rubric: RubricFormValues, loading: string, success: string, description: string) => {
    const toastId = toast.loading(loading, { description: "Updating the assignment rubric." });
    try {
      const next: AssignmentItem = await updateAssignment(assignment.id, { rubric, showRubric: rubric.enabled && rubric.visibleToStudents });
      reset(toRubricForm(next.rubric));
      onAssignmentChange(next);
      toast.success(success, { id: toastId, description });
    } catch (e) {
      toast.error("Couldn't save the rubric", { id: toastId, description: errorMessage(e) });
      throw e;
    }
  };

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        await persist(values, "Saving rubric...", "Rubric saved", `"${values.title}" now has ${values.criteria.length} criteria worth ${values.totalPoints} points.`);
      } catch {
        /* toast already shown */
      }
    },
    () => toast.error("Rubric not saved", { description: "Fix the highlighted fields and try again." })
  );

  const markDirty = { shouldDirty: true, shouldValidate: methods.formState.isSubmitted } as const;

  const handleAction = (key: RubricActionKey) => {
    const current = getValues() as RubricFormValues;
    switch (key) {
      case "preview":
        setPreviewOpen(true);
        break;
      case "duplicate":
        setValue("criteria", cloneCriteria(current.criteria), markDirty);
        setValue("title", `${current.title} (Copy)`.slice(0, 100), markDirty);
        toast.success("Rubric duplicated", { description: `${current.criteria.length} criteria were copied with new IDs. Save the rubric to keep the copy.` });
        break;
      case "import":
        setImportOpen(true);
        break;
      case "export":
        downloadJson(`${slugify(current.title)}.json`, current);
        toast.success("Rubric exported", { description: `${slugify(current.title)}.json was downloaded.` });
        break;
      case "delete":
        setDeleteOpen(true);
        break;
    }
  };

  const importFrom = (source: AssignmentItem) => {
    setValue("title", source.rubric.title, markDirty);
    setValue("description", source.rubric.description, markDirty);
    setValue("totalPoints", source.rubric.totalPoints, markDirty);
    setValue("criteria", cloneCriteria(source.rubric.criteria), markDirty);
    setValue("enabled", true, markDirty);
    setImportOpen(false);
    toast.success("Rubric imported", { description: `Copied ${source.rubric.criteria.length} criteria from "${source.title}". Save to apply.` });
  };

  return (
    <FormProvider {...methods}>
      <motion.form
        id={FORM_ID}
        onSubmit={onSubmit}
        noValidate
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <RubricInfoCard />
          <div className={enabled ? undefined : "opacity-60"} aria-disabled={!enabled}>
            <RubricCriteriaCard disabled={!enabled} />
          </div>
          <RubricSaveBar visible={isDirty} isSaving={isSubmitting} formId={FORM_ID} onDiscard={() => reset(toRubricForm(assignment.rubric))} />
        </div>
        <div className="min-w-0 space-y-5">
          <RubricSummaryCard />
          <RubricQuickActions onAction={handleAction} disabled={{ export: criteriaCount === 0, duplicate: criteriaCount === 0, delete: assignment.rubric.criteria.length === 0 }} />
          <RubricTipsCard />
        </div>
      </motion.form>

      <RubricPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} rubric={getValues() as RubricFormValues} />
      {importOpen && <ImportRubricModal isOpen onClose={() => setImportOpen(false)} currentAssignment={assignment} onImport={importFrom} />}
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Rubric"
        message={<>Delete all {assignment.rubric.criteria.length} criteria of &quot;{assignment.rubric.title}&quot; and turn the rubric off? Existing grades are kept.</>}
        confirmLabel="Delete Rubric"
        pendingLabel="Deleting..."
        onClose={() => setDeleteOpen(false)}
        onConfirm={() =>
          persist(
            { ...(getValues() as RubricFormValues), enabled: false, criteria: [] },
            "Deleting rubric...",
            "Rubric deleted",
            "All criteria were removed and the rubric is turned off."
          )
        }
      />
    </FormProvider>
  );
}

export default RubricTab;
