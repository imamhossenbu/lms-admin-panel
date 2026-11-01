"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { QuizItem, QuizStatus } from "@/types/quiz";
import { deleteQuiz, duplicateQuiz, setQuizStatus } from "@/lib/quizStorage";

const friendly = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
const plural = (n: number) => `${n} quiz${n === 1 ? "" : "zes"}`;

const STATUS_COPY: Record<QuizStatus, { loading: string; done: string; bulkDone: string; description: string }> = {
  PUBLISHED: { loading: "Publishing quiz...", done: "Quiz published", bulkDone: "Quizzes published", description: "Students can now take it." },
  DRAFT: { loading: "Moving to drafts...", done: "Quiz moved to drafts", bulkDone: "Quizzes moved to drafts", description: "It is hidden from students until published again." },
  ARCHIVED: { loading: "Archiving quiz...", done: "Quiz archived", bulkDone: "Quizzes archived", description: "It is hidden from students and kept for records." },
};

/** Row + bulk mutations with the loading → success / error toast lifecycle. */
export function useQuizListActions() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const duplicate = useCallback(async (q: QuizItem) => {
    setBusyId(q.id);
    const toastId = toast.loading("Duplicating quiz...", { description: q.title });
    try {
      const copy = await duplicateQuiz(q.id);
      toast.success("Quiz duplicated", { id: toastId, description: `"${copy.title}" was saved as a draft.` });
    } catch (error) {
      toast.error("Could not duplicate quiz", { id: toastId, description: friendly(error, "Please try again.") });
    } finally {
      setBusyId(null);
    }
  }, []);

  const setStatus = useCallback(async (q: QuizItem, status: QuizStatus) => {
    if (status === "PUBLISHED" && q.questions.length === 0) {
      toast.error("Add questions first", { description: `"${q.title}" has no questions yet, so it can't be published.` });
      return;
    }
    setBusyId(q.id);
    const copy = STATUS_COPY[status];
    const toastId = toast.loading(copy.loading, { description: q.title });
    try {
      await setQuizStatus(q.id, status);
      toast.success(copy.done, { id: toastId, description: copy.description });
    } catch (error) {
      toast.error("Could not update quiz", { id: toastId, description: friendly(error, "Please try again.") });
    } finally {
      setBusyId(null);
    }
  }, []);

  /** Throws on failure so ConfirmModal stays open. */
  const remove = useCallback(async (q: QuizItem) => {
    const toastId = toast.loading("Deleting quiz...", { description: q.title });
    try {
      await deleteQuiz(q.id);
      toast.success("Quiz deleted", { id: toastId, description: `"${q.title}" and its attempts were removed.` });
    } catch (error) {
      toast.error("Could not delete quiz", { id: toastId, description: friendly(error, "Please try again.") });
      throw error;
    }
  }, []);

  const bulkSetStatus = useCallback(async (items: QuizItem[], status: QuizStatus) => {
    const pending = items.filter((q) => q.status !== status);
    const targets = status === "PUBLISHED" ? pending.filter((q) => q.questions.length > 0) : pending;
    const skipped = pending.length - targets.length;
    if (!targets.length) {
      toast.info(skipped ? "Nothing to publish" : "No changes needed", {
        description: skipped ? "The selected quizzes have no questions yet." : `The selected quizzes are already ${status.toLowerCase()}.`,
      });
      return;
    }
    setIsBulkBusy(true);
    const copy = STATUS_COPY[status];
    const toastId = toast.loading(copy.loading.replace("quiz", "quizzes"), { description: plural(targets.length) });
    try {
      // Sequential: each mock write reads the latest stored data.
      for (const q of targets) await setQuizStatus(q.id, status);
      toast.success(copy.bulkDone, {
        id: toastId,
        description: `${plural(targets.length)} updated.${skipped ? ` ${plural(skipped)} without questions skipped.` : ""}`,
      });
    } catch (error) {
      toast.error("Could not update quizzes", { id: toastId, description: friendly(error, "Some quizzes were not updated. Please try again.") });
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  const bulkRemove = useCallback(async (items: QuizItem[]) => {
    setIsBulkBusy(true);
    const toastId = toast.loading("Deleting quizzes...", { description: plural(items.length) });
    try {
      for (const q of items) await deleteQuiz(q.id);
      toast.success("Quizzes deleted", { id: toastId, description: `${plural(items.length)} and their attempts were removed.` });
    } catch (error) {
      toast.error("Could not delete quizzes", { id: toastId, description: friendly(error, "Some quizzes were not deleted. Please try again.") });
      throw error;
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  return { busyId, isBulkBusy, duplicate, setStatus, remove, bulkSetStatus, bulkRemove };
}

export default useQuizListActions;
