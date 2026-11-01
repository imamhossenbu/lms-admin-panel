"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { deleteAssignment, duplicateAssignment, sendPendingReminders, updateAssignment } from "@/lib/assignmentStorage";
import { downloadSubmissionsCsv } from "../submissionsCsv";

const message = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

/** Assignment-level actions shared by the header "More" menu and the Quick Actions card. */
export function useAssignmentActions(assignment: AssignmentItem, submissions: AssignmentSubmission[]) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [busy, setBusy] = useState<"duplicate" | "remind" | "publish" | null>(null);

  const duplicate = useCallback(async () => {
    setBusy("duplicate");
    const toastId = toast.loading("Duplicating assignment...", { description: `Creating a copy of "${assignment.title}".` });
    try {
      const copy = await duplicateAssignment(assignment.id);
      toast.success("Assignment duplicated", { id: toastId, description: `"${copy.title}" was created as a draft.` });
      router.push(`/assignments/${copy.id}`);
    } catch (error) {
      toast.error("Couldn't duplicate assignment", { id: toastId, description: message(error, "Please try again.") });
    } finally {
      setBusy(null);
    }
  }, [assignment.id, assignment.title, router]);

  const remind = useCallback(async () => {
    setBusy("remind");
    const toastId = toast.loading("Sending reminders...", { description: "Notifying students who haven't submitted yet." });
    try {
      const count = await sendPendingReminders(assignment.id);
      if (count === 0) toast.success("Everyone has submitted", { id: toastId, description: "No students are waiting on this assignment." });
      else toast.success(`Reminder sent to ${count} student${count === 1 ? "" : "s"}`, { id: toastId, description: `They were reminded about "${assignment.title}".` });
    } catch (error) {
      toast.error("Couldn't send reminders", { id: toastId, description: message(error, "Please try again.") });
    } finally {
      setBusy(null);
    }
  }, [assignment.id, assignment.title]);

  const exportCsv = useCallback(
    (suffix = "submissions", rows: AssignmentSubmission[] = submissions) => {
      if (rows.length === 0) {
        toast.error("Nothing to export", { description: "There are no submissions to download yet." });
        return;
      }
      try {
        const fileName = downloadSubmissionsCsv(assignment, rows, suffix);
        toast.success("Download started", { description: `${rows.length} submission${rows.length === 1 ? "" : "s"} saved to ${fileName}.` });
      } catch {
        toast.error("Download failed", { description: "Your browser blocked the file. Please try again." });
      }
    },
    [assignment, submissions]
  );

  const confirmDelete = useCallback(async () => {
    const toastId = toast.loading("Deleting assignment...", { description: "Removing the assignment and its submissions." });
    try {
      await deleteAssignment(assignment.id);
      toast.success("Assignment deleted", { id: toastId, description: `"${assignment.title}" has been removed.` });
      router.push("/assignments");
    } catch (error) {
      toast.error("Couldn't delete assignment", { id: toastId, description: message(error, "Please try again.") });
      throw error;
    }
  }, [assignment.id, assignment.title, router]);

  /** Publish ⇄ Unpublish. Resolves with the updated assignment (null on failure). */
  const togglePublish = useCallback(async (): Promise<AssignmentItem | null> => {
    const next = assignment.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setBusy("publish");
    const toastId = toast.loading(next === "PUBLISHED" ? "Publishing assignment..." : "Unpublishing assignment...");
    try {
      const updated = await updateAssignment(assignment.id, { status: next });
      toast.success(next === "PUBLISHED" ? "Assignment published" : "Assignment moved to draft", {
        id: toastId,
        description: next === "PUBLISHED" ? "Students can now see and submit it." : "Students can no longer see it.",
      });
      return updated;
    } catch (error) {
      toast.error("Couldn't update status", { id: toastId, description: message(error, "Please try again.") });
      return null;
    } finally {
      setBusy(null);
    }
  }, [assignment.id, assignment.status]);

  return {
    busy,
    duplicate,
    remind,
    exportCsv,
    togglePublish,
    isDeleteOpen,
    openDelete: () => setIsDeleteOpen(true),
    closeDelete: () => setIsDeleteOpen(false),
    confirmDelete,
  };
}
