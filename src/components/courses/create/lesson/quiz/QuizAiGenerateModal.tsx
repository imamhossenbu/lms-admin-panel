"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { LESSON_DIFFICULTIES } from "@/validations/lessonFormSchema";
import { FieldError, FieldLabel } from "../../basic/FieldLabel";
import { LESSON_DIFFICULTY_LABEL } from "../lessonDisplay";
import type { QuizAiDifficulty } from "./useQuizAiGenerator";

const COUNTS = ["3", "5", "10", "15"] as const;
/** Smallest batch the AI modal offers (the builder hides the AI action below this). */
export const QUIZ_AI_MIN_BATCH = 3;

const aiQuizSchema = z.object({
  count: z.enum(COUNTS),
  difficulty: z.enum(LESSON_DIFFICULTIES),
});
type AiQuizValues = z.infer<typeof aiQuizSchema>;

export interface QuizAiGenerateModalProps {
  isOpen: boolean;
  /** Lesson difficulty used as the default. */
  defaultDifficulty: QuizAiDifficulty;
  /** How many more questions fit under the per-lesson limit. */
  remaining: number;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (count: number, difficulty: QuizAiDifficulty) => void;
}

/** Pick how many questions (and how hard) the AI should write for this lesson. */
export function QuizAiGenerateModal({
  isOpen,
  defaultDifficulty,
  remaining,
  isGenerating,
  onClose,
  onGenerate,
}: QuizAiGenerateModalProps) {
  const defaultCount: AiQuizValues["count"] = remaining >= 5 ? "5" : "3";
  const { control, handleSubmit, reset, setError, formState } = useForm<AiQuizValues>({
    resolver: zodResolver(aiQuizSchema),
    defaultValues: { count: defaultCount, difficulty: defaultDifficulty },
  });

  useEffect(() => {
    if (isOpen) reset({ count: defaultCount, difficulty: defaultDifficulty });
  }, [isOpen, defaultCount, defaultDifficulty, reset]);

  const submit = handleSubmit((values) => {
    const count = Number(values.count);
    if (count > remaining) {
      setError("count", { type: "manual", message: `Only ${remaining} more question${remaining === 1 ? "" : "s"} can be added to this quiz` });
      return;
    }
    onGenerate(count, values.difficulty);
  });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isGenerating ? () => {} : onClose}
      title="Generate Questions with AI"
      subtitle="Questions are written from this lesson's title, description and content."
      titleIcon={<Sparkles className="text-brand-orange" />}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isGenerating}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="quiz-ai-form" leftIcon={<Sparkles />} isLoading={isGenerating} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </PrimaryButton>
        </>
      }
    >
      <form
        id="quiz-ai-form"
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          // Portalled modal inside the lesson form — don't let the submit bubble to it.
          e.stopPropagation();
          void submit(e);
        }}
      >
        <div>
          <FieldLabel label="Number of Questions" required />
          <Controller
            control={control}
            name="count"
            render={({ field }) => (
              <ChoiceCardGroup
                name="quiz-ai-count"
                aria-label="Number of questions"
                variant="inline"
                value={field.value}
                onChange={field.onChange}
                options={COUNTS.map((c) => ({ value: c, title: `${c} questions`, disabled: Number(c) > remaining }))}
              />
            )}
          />
          <FieldError message={formState.errors.count?.message} />
        </div>
        <div>
          <FieldLabel label="Difficulty" required />
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <ChoiceCardGroup
                name="quiz-ai-difficulty"
                aria-label="Difficulty"
                columns={3}
                value={field.value}
                onChange={field.onChange}
                options={LESSON_DIFFICULTIES.map((d) => ({ value: d, title: LESSON_DIFFICULTY_LABEL[d] }))}
              />
            )}
          />
          <FieldError message={formState.errors.difficulty?.message} />
        </div>
        <ProTipCard>Add written lesson content first. The AI grounds every question in it for more accurate results.</ProTipCard>
      </form>
    </ModalShell>
  );
}

export default QuizAiGenerateModal;
