"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { mapAiQuizQuestions, pluralize } from "@/components/courses/create/lesson/quiz/quizUtils";
import type { QuizAiDifficulty } from "@/components/courses/create/lesson/quiz/useQuizAiGenerator";

const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/**
 * Edit Lesson version of `useQuizAiGenerator` (that one reads the old lesson-modal form paths).
 * Reads "content.title" / "content.shortDescription" / "content.body" and calls the AI service.
 */
export function useEditorQuizAi(onGenerated: (questions: LessonQuizQuestion[]) => void) {
  const { getValues } = useFormContext<LessonEditorValues>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (count: number, difficulty: QuizAiDifficulty): Promise<boolean> => {
    const title = getValues("content.title")?.trim() ?? "";
    const summary = getValues("content.shortDescription")?.trim() ?? "";
    const content = plainText(getValues("content.body") ?? "");
    if (!title) {
      toast.error("Add a lesson title first", { description: "The AI uses the lesson title to write relevant questions." });
      return false;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating quiz questions...", {
      description: content ? "Reading your lesson content to write relevant questions." : `Writing questions about "${title}".`,
    });
    try {
      const res = await aiApi.generateQuiz({
        topic: title,
        lessonTitle: title,
        lessonContent: [summary, content].filter(Boolean).join("\n\n") || undefined,
        numQuestions: count,
        difficulty,
      });
      const questions = mapAiQuizQuestions(res).slice(0, count);
      if (questions.length === 0) {
        toast.error("No questions were generated", { id: toastId, description: "Try again, or add more lesson content for better results." });
        return false;
      }
      onGenerated(questions);
      toast.success(`${pluralize(questions.length, "question")} added`, {
        id: toastId,
        description: "Review each question and its correct answer before publishing.",
      });
      return true;
    } catch (error) {
      toast.error("Couldn't generate questions", {
        id: toastId,
        description: apiErrorMessage(error, "The AI service is unavailable right now. Please try again."),
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
}
