"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { AssignmentItem, AssignmentStatus } from "@/types/assignment";
import { deleteAssignment, duplicateAssignment, updateAssignment } from "@/lib/assignmentStorage";

const friendly = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
const plural = (n: number) => `${n} assignment${n === 1 ? "" : "s"}`;

/** Row + bulk mutations with the standard loading → success / error toast lifecycle. */
export function useAssignmentListActions() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const duplicate = useCallback(async (a: AssignmentItem) => {
    setBusyId(a.id);
    const toastId = toast.loading("Duplicating assignment...", { description: a.title });
    try {
      const copy = await duplicateAssignment(a.id);
      toast.success("Assignment duplicated", { id: toastId, description: `"${copy.title}" was saved as a draft.` });
    } catch (error) {
      toast.error("Could not duplicate assignment", { id: toastId, description: friendly(error, "Please try again.") });
    } finally {
      setBusyId(null);
    }
  }, []);

  const setStatus = useCallback(async (a: AssignmentItem, status: AssignmentStatus) => {
    setBusyId(a.id);
    const publishing = status === "PUBLISHED";
    const toastId = toast.loading(publishing ? "Publishing assignment..." : "Moving to drafts...", { description: a.title });
    try {
      await updateAssignment(a.id, { status });
      toast.success(publishing ? "Assignment published" : "Assignment unpublished", {
        id: toastId,
        description: publishing ? "Students can now see and submit it." : "It is hidden from students until published again.",
      });
    } catch (error) {
      toast.error("Could not update assignment", { id: toastId, description: friendly(error, "Please try again.") });
    } finally {
      setBusyId(null);
    }
  }, []);

  /** Throws on failure so ConfirmModal stays open. */
  const remove = useCallback(async (a: AssignmentItem) => {
    const toastId = toast.loading("Deleting assignment...", { description: a.title });
    try {
      await deleteAssignment(a.id);
      toast.success("Assignment deleted", { id: toastId, description: `"${a.title}" and its submissions were removed.` });
    } catch (error) {
      toast.error("Could not delete assignment", { id: toastId, description: friendly(error, "Please try again.") });
      throw error;
    }
  }, []);

  const bulkSetStatus = useCallback(async (items: AssignmentItem[], status: AssignmentStatus) => {
    const targets = items.filter((a) => a.status !== status);
    const publishing = status === "PUBLISHED";
    if (!targets.length) {
      toast.info(publishing ? "Already published" : "Already drafts", { description: `The selected assignments are already ${publishing ? "published" : "drafts"}.` });
      return;
    }
    setIsBulkBusy(true);
    const toastId = toast.loading(publishing ? "Publishing assignments..." : "Moving to drafts...", { description: plural(targets.length) });
    try {
      // Sequential: each mock write reads the latest stored data.
      for (const a of targets) await updateAssignment(a.id, { status });
      toast.success(publishing ? "Assignments published" : "Assignments moved to drafts", { id: toastId, description: `${plural(targets.length)} updated.` });
    } catch (error) {
      toast.error("Could not update assignments", { id: toastId, description: friendly(error, "Some assignments were not updated. Please try again.") });
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  const bulkRemove = useCallback(async (items: AssignmentItem[]) => {
    setIsBulkBusy(true);
    const toastId = toast.loading("Deleting assignments...", { description: plural(items.length) });
    try {
      for (const a of items) await deleteAssignment(a.id);
      toast.success("Assignments deleted", { id: toastId, description: `${plural(items.length)} and their submissions were removed.` });
    } catch (error) {
      toast.error("Could not delete assignments", { id: toastId, description: friendly(error, "Some assignments were not deleted. Please try again.") });
      throw error;
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  return { busyId, isBulkBusy, duplicate, setStatus, remove, bulkSetStatus, bulkRemove };
}

export default useAssignmentListActions;
