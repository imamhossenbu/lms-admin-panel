"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { ClipboardList, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { RubricCriterion } from "@/types/assignment";
import type { RubricFormValues } from "@/validations/assignmentSchema";
import { CriterionModal } from "./CriterionModal";
import { CriterionRow, type CriterionField } from "./CriterionRow";
import { cloneCriterion } from "./rubricUtils";

const MAX_CRITERIA = 12;

/** Same-item move detection for Reorder → useFieldArray.move. */
const findMove = (prev: CriterionField[], next: CriterionField[]): [number, number] | null => {
  let a = -1;
  let b = -1;
  for (let i = 0; i < prev.length; i++) {
    if (prev[i].fieldKey !== next[i]?.fieldKey) {
      if (a === -1) a = i;
      b = i;
    }
  }
  if (a === -1) return null;
  return next[a].fieldKey === prev[b].fieldKey ? [b, a] : [a, b];
};

/** "Rubric Criteria" card bound to `criteria`: add, edit, duplicate, reorder, delete. */
export function RubricCriteriaCard({ disabled }: { disabled?: boolean }) {
  const {
    control,
    trigger,
    formState: { errors, isSubmitted },
  } = useFormContext<RubricFormValues>();
  const { fields, append, insert, update, remove, move } = useFieldArray({ control, name: "criteria", keyName: "fieldKey" });
  const [editor, setEditor] = useState<{ open: boolean; index: number | null }>({ open: false, index: null });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const listError = errors.criteria?.message ?? errors.criteria?.root?.message;
  const full = fields.length >= MAX_CRITERIA;

  const revalidate = () => {
    if (isSubmitted) void trigger(["criteria", "totalPoints"]);
  };

  const safeMove = (from: number, to: number) => {
    if (to < 0 || to >= fields.length) return;
    move(from, to);
  };

  const save = (criterion: RubricCriterion) => {
    if (editor.index !== null) {
      update(editor.index, criterion);
      toast.success("Criterion updated", { description: `"${criterion.title}" was updated. Save the rubric to keep it.` });
    } else {
      append(criterion);
      toast.success("Criterion added", { description: `"${criterion.title}" was added. Save the rubric to keep it.` });
    }
    setEditor({ open: false, index: null });
    revalidate();
  };

  const duplicate = (index: number) => {
    if (full) {
      toast.error("Criteria limit reached", { description: `A rubric can have up to ${MAX_CRITERIA} criteria.` });
      return;
    }
    insert(index + 1, cloneCriterion(fields[index], " (Copy)"));
    toast.success("Criterion duplicated", { description: "Adjust points so the total still matches." });
    revalidate();
  };

  const addButton = (
    <SecondaryButton size="sm" leftIcon={<Plus />} onClick={() => setEditor({ open: true, index: null })} disabled={disabled || full}>
      Add Criterion
    </SecondaryButton>
  );

  return (
    <IconSectionCard
      icon={<ClipboardList className="h-5 w-5" />}
      title="Rubric Criteria"
      description="Add criteria and performance levels to define how students will be graded."
      action={addButton}
    >
      {fields.length === 0 ? (
        <div className="rounded-xl border border-dash bg-gray-bg px-4 py-8 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-primary-300" />
          <p className="mt-2 body-sm-medium text-primary-500">No criteria yet</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">Add the first criterion to start building this rubric.</p>
        </div>
      ) : (
        <Reorder.Group
          as="ol"
          axis="y"
          values={fields}
          onReorder={(next) => {
            const step = findMove(fields, next);
            if (step) move(step[0], step[1]);
          }}
          className="space-y-3"
        >
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <CriterionRow
                key={field.fieldKey}
                field={field}
                index={index}
                total={fields.length}
                disabled={disabled}
                invalid={!!errors.criteria?.[index]}
                onEdit={() => setEditor({ open: true, index })}
                onDelete={() => setDeleteIndex(index)}
                onDuplicate={() => duplicate(index)}
                onMove={safeMove}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
      {listError && (
        <p role="alert" className="mt-2 body-xsm-regular text-red">
          {listError}
        </p>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={disabled || full}
        onClick={() => setEditor({ open: true, index: null })}
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue/40 py-3 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {full ? `Maximum ${MAX_CRITERIA} criteria` : "Add Criterion"}
      </motion.button>

      <CriterionModal
        isOpen={editor.open}
        criterion={editor.index !== null ? (fields[editor.index] ?? null) : null}
        number={editor.index !== null ? editor.index + 1 : fields.length + 1}
        onClose={() => setEditor({ open: false, index: null })}
        onSave={save}
      />

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Criterion"
        message={deleteIndex !== null && <>Delete &quot;{fields[deleteIndex]?.title || `Criterion ${deleteIndex + 1}`}&quot; and all of its performance levels?</>}
        confirmLabel="Delete Criterion"
        onClose={() => setDeleteIndex(null)}
        onConfirm={async () => {
          if (deleteIndex === null) return;
          const title = fields[deleteIndex]?.title;
          remove(deleteIndex);
          toast.success("Criterion deleted", { description: `"${title || "Criterion"}" was removed. Save the rubric to keep the change.` });
          revalidate();
        }}
      />
    </IconSectionCard>
  );
}

export default RubricCriteriaCard;
