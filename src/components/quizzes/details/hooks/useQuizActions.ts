"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { QuizItem, QuizStatus } from "@/types/quiz";
import { deleteQuiz, duplicateQuiz, setQuizStatus } from "@/lib/quizStorage";

const message = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

export type QuizBusyAction = "duplicate" | "status" | null;

const STATUS_COPY: Record<QuizStatus, { loading: string; success: string; description: string }> = {
  PUBLISHED: { loading: "Publishing quiz...", success: "Quiz published", description: "Students can now take this quiz." },
  DRAFT: { loading: "Unpublishing quiz...", success: "Quiz moved to drafts", description: "Students can no longer see this quiz." },
  ARCHIVED: { loading: "Archiving quiz...", success: "Quiz archived", description: "It's hidden from students; results are kept." },
};

/** Quiz-level actions shared by the header menu and the Overview "Quick Actions" card. */
export function useQuizActions(quiz: QuizItem, onQuizChange: (next: QuizItem) => void) {
  const router = useRouter();
  const [busy, setBusy] = useState<QuizBusyAction>(null);
  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);

  const editQuiz = useCallback(() => router.push(`/quizzes/${quiz.id}/edit`), [router, quiz.id]);

  const duplicate = useCallback(async () => {
    setBusy("duplicate");
    const toastId = toast.loading("Duplicating quiz...", { description: `Creating a copy of "${quiz.title}".` });
    try {
      const copy = await duplicateQuiz(quiz.id);
      toast.success("Quiz duplicated", { id: toastId, description: `"${copy.title}" was created as a draft.` });
      router.push(`/quizzes/${copy.id}`);
    } catch (error) {
      toast.error("Couldn't duplicate quiz", { id: toastId, description: message(error, "Please try again.") });
    } finally {
      setBusy(null);
    }
  }, [quiz.id, quiz.title, router]);

  const changeStatus = useCallback(
    async (status: QuizStatus) => {
      setBusy("status");
      const copy = STATUS_COPY[status];
      const toastId = toast.loading(copy.loading);
      try {
        const updated = await setQuizStatus(quiz.id, status);
        onQuizChange(updated);
        toast.success(copy.success, { id: toastId, description: copy.description });
      } catch (error) {
        toast.error("Couldn't update the quiz status", { id: toastId, description: message(error, "Please try again.") });
        throw error;
      } finally {
        setBusy(null);
      }
    },
    [quiz.id, onQuizChange]
  );

  /** Publish ⇄ Unpublish (drafts and archived quizzes get published). */
  const togglePublish = useCallback(
    () => changeStatus(quiz.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED").catch(() => undefined),
    [changeStatus, quiz.status]
  );
  const confirmArchive = useCallback(() => changeStatus("ARCHIVED"), [changeStatus]);

  const confirmDelete = useCallback(async () => {
    const toastId = toast.loading("Deleting quiz...", { description: "Removing the quiz, its attempts and activity." });
    try {
      await deleteQuiz(quiz.id);
      toast.success("Quiz deleted", { id: toastId, description: `"${quiz.title}" has been removed.` });
      router.push("/quizzes");
    } catch (error) {
      toast.error("Couldn't delete quiz", { id: toastId, description: message(error, "Please try again.") });
      throw error;
    }
  }, [quiz.id, quiz.title, router]);

  return {
    busy,
    editQuiz,
    duplicate,
    togglePublish,
    confirm,
    requestArchive: () => setConfirm("archive"),
    requestDelete: () => setConfirm("delete"),
    closeConfirm: () => setConfirm(null),
    confirmArchive,
    confirmDelete,
  };
}

export type QuizActions = ReturnType<typeof useQuizActions> & { openPreview: () => void };
