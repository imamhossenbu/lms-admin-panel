"use client";

import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";

const keyOf = (draftKey: string) => `edupro_assignment_draft_${draftKey}`;

export function readAssignmentDraft(draftKey: string): AssignmentFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(keyOf(draftKey));
    return raw ? (JSON.parse(raw) as AssignmentFormValues) : null;
  } catch {
    return null;
  }
}

export function clearAssignmentDraft(draftKey: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(keyOf(draftKey));
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/**
 * Keeps unsaved form values in sessionStorage so a reload restores the draft.
 * Restores once on mount (keeping the original defaults, so `isDirty` stays meaningful),
 * then writes on every change while the values differ from the defaults.
 */
export function useAssignmentDraft(form: UseFormReturn<AssignmentFormValues>, draftKey: string) {
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = readAssignmentDraft(draftKey);
    if (!draft) return;
    form.reset({ ...form.getValues(), ...draft }, { keepDefaultValues: true });
    toast.info("Unsaved draft restored", { description: "We kept the changes you made before the page reloaded." });
  }, [form, draftKey]);

  useEffect(() => {
    const sub = form.watch((values) => {
      try {
        const changed = JSON.stringify(values) !== JSON.stringify(form.formState.defaultValues);
        if (changed) sessionStorage.setItem(keyOf(draftKey), JSON.stringify(values));
        else sessionStorage.removeItem(keyOf(draftKey));
      } catch {
        /* storage full or blocked — the form still works without a draft */
      }
    });
    return () => sub.unsubscribe();
  }, [form, draftKey]);

  return useCallback(() => clearAssignmentDraft(draftKey), [draftKey]);
}

export default useAssignmentDraft;
