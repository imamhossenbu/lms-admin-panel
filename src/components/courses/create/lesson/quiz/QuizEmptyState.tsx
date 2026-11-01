"use client";

import React from "react";
import { motion } from "framer-motion";
import { ListChecks, Plus, Sparkles } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";

export interface QuizEmptyStateProps {
  invalid?: boolean;
  aiDisabled?: boolean;
  onAdd: () => void;
  onGenerate: () => void;
}

/** Dashed placeholder shown before the first question is added. */
export function QuizEmptyState({ invalid, aiDisabled, onAdd, onGenerate }: QuizEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed px-6 py-8 text-center",
        invalid ? "border-red bg-red-14" : "border-dash bg-slate-50"
      )}
    >
      <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange">
        <ListChecks className="h-6 w-6" />
      </span>
      <p className="title-sm text-primary-500 mt-3">No questions yet</p>
      <p className="body-sm-regular text-primary-300 mt-1 max-w-sm">
        Add multiple choice or true / false questions, or let AI draft them from your lesson content.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton leftIcon={<Plus />} onClick={onAdd}>
          Add Question
        </PrimaryButton>
        <SecondaryButton leftIcon={<Sparkles />} onClick={onGenerate} disabled={aiDisabled}>
          Generate with AI
        </SecondaryButton>
      </div>
    </motion.div>
  );
}

export default QuizEmptyState;
