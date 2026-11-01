"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import { FieldError, FieldLabel } from "../../basic/FieldLabel";
import { ResourceRowActionButton } from "../resources/ResourceRowActionButton";
import { QUIZ_OPTIONS_MAX, QUIZ_OPTIONS_MIN, optionLetter } from "./quizUtils";

export interface QuizOptionRow {
  /** Stable React key (options are plain strings). */
  key: string;
  value: string;
}

export interface QuizOptionsEditorProps {
  rows: QuizOptionRow[];
  correctIndex: number | null;
  /** True / False questions: fixed option text, only the correct answer can change. */
  locked: boolean;
  optionErrors?: (string | undefined)[];
  listError?: string;
  correctError?: string;
  onTextChange: (index: number, value: string) => void;
  onSelectCorrect: (index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function CorrectRadio({ checked, label, onSelect }: { checked: boolean; label: string; onSelect: () => void }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      title={checked ? "Correct answer" : "Mark as correct answer"}
      whileTap={{ scale: 0.92 }}
      onClick={onSelect}
      className={cn(
        "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors",
        checked ? "border-green" : "border-dash hover:border-primary-300"
      )}
    >
      {checked && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-2.5 w-2.5 rounded-full bg-green"
        />
      )}
    </motion.button>
  );
}

/** Answer options with a radio to mark the correct one, plus add / remove (MCQ only). */
export function QuizOptionsEditor({
  rows,
  correctIndex,
  locked,
  optionErrors,
  listError,
  correctError,
  onTextChange,
  onSelectCorrect,
  onAdd,
  onRemove,
}: QuizOptionsEditorProps) {
  return (
    <div>
      <FieldLabel label="Answer Options" required />
      <p className="body-xsm-regular text-primary-300 -mt-1 mb-3">Select the radio button next to the correct answer.</p>
      <ul role="radiogroup" aria-label="Correct answer" className="space-y-2.5">
        <AnimatePresence initial={false}>
          {rows.map((row, i) => (
            <motion.li
              key={row.key}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <span className="mt-2.5">
                <CorrectRadio
                  checked={correctIndex === i}
                  label={`Mark option ${optionLetter(i)} as correct`}
                  onSelect={() => onSelectCorrect(i)}
                />
              </span>
              <InputField
                id={`quiz-option-${i}`}
                aria-label={`Option ${optionLetter(i)}`}
                placeholder={`Option ${optionLetter(i)}`}
                value={row.value}
                readOnly={locked}
                maxLength={200}
                leftElement={<span className="body-xsm-medium">{optionLetter(i)}</span>}
                containerClassName="min-w-0 flex-1"
                error={optionErrors?.[i]}
                onChange={(e) => onTextChange(i, e.target.value)}
              />
              {!locked && (
                <ResourceRowActionButton
                  label={`Remove option ${optionLetter(i)}`}
                  tone="danger"
                  className="mt-1"
                  disabled={rows.length <= QUIZ_OPTIONS_MIN}
                  onClick={() => onRemove(i)}
                >
                  <Trash2 />
                </ResourceRowActionButton>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <FieldError message={correctError ?? listError} />
      {!locked && (
        <SecondaryButton
          size="sm"
          leftIcon={<Plus />}
          className="mt-3 text-blue"
          disabled={rows.length >= QUIZ_OPTIONS_MAX}
          onClick={onAdd}
        >
          Add Option
        </SecondaryButton>
      )}
    </div>
  );
}

export default QuizOptionsEditor;
