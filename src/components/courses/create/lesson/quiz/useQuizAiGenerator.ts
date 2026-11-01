"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { LessonFormValues, LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { mapAiQuizQuestions, pluralize } from "./quizUtils";

export type QuizAiDifficulty = LessonFormValues["difficulty"];

/** Strip HTML from the rich-text lesson content so the AI gets plain text. */
const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/**
 * Generates quiz questions from the lesson title + written content via `aiApi.generateQuiz`
 * and hands them to `onGenerated` (ids are "" so they are created on save).
 */
export function useQuizAiGenerator(onGenerated: (questions: LessonQuizQuestion[]) => void) {
  const { getValues } = useFormContext<LessonFormValues>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (count: number, difficulty: QuizAiDifficulty): Promise<boolean> => {
    const title = getValues("title")?.trim() ?? "";
    const summary = getValues("summary")?.trim() ?? "";
    const content = plainText(getValues("content") ?? "");
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
        toast.error("No questions were generated", {
          id: toastId,
          description: "Try again, or add more lesson content for better results.",
        });
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
