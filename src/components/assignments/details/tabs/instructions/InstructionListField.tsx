"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { EditorIconButton } from "@/components/courses/lesson-editor/tabs/quiz/EditorIconButton";
import type { AssignmentInstructionsFormValues } from "@/validations/assignmentSchema";
import type { InstructionListName } from "./instructionsForm";

export interface InstructionListFieldProps {
  name: InstructionListName;
  label: string;
  placeholder: string;
  max: number;
  /** Show "1. 2. 3." numbers instead of bullets. */
  numbered?: boolean;
  hint?: string;
}

/** Editable list of short lines (objectives, task steps …) with add / remove / move up & down. */
export function InstructionListField({ name, label, placeholder, max, numbered, hint }: InstructionListFieldProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentInstructionsFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const listErrors = errors[name];
  const listMessage = listErrors?.message ?? listErrors?.root?.message;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="body-sm-medium text-primary-500">{label}</p>
          {hint && <p className="body-xsm-regular text-primary-300">{hint}</p>}
        </div>
        <span className="body-xsm-regular text-primary-300 tabular-nums">
          {fields.length}/{max}
        </span>
      </div>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {fields.map((field, i) => (
            <motion.li
              key={field.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-start gap-2"
            >
              <span className="flex h-10 w-7 shrink-0 items-center justify-center body-sm-medium text-primary-300">{numbered ? `${i + 1}.` : "•"}</span>
              <InputField
                aria-label={`${label} ${i + 1}`}
                placeholder={placeholder}
                error={listErrors?.[i]?.value?.message}
                {...register(`${name}.${i}.value` as const)}
              />
              <EditorIconButton label="Move up" tone="neutral" icon={<ArrowUp className="h-4 w-4" />} onClick={() => move(i, i - 1)} disabled={i === 0} />
              <EditorIconButton label="Move down" tone="neutral" icon={<ArrowDown className="h-4 w-4" />} onClick={() => move(i, i + 1)} disabled={i === fields.length - 1} />
              <EditorIconButton label={`Remove ${label.toLowerCase()} ${i + 1}`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={() => remove(i)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {listMessage && <p className="mt-1.5 body-xsm-regular text-red">{listMessage}</p>}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={fields.length >= max}
        onClick={() => append({ value: "" }, { shouldFocus: true })}
        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add {numbered ? "step" : "item"}
      </motion.button>
    </div>
  );
}

export default InstructionListField;
