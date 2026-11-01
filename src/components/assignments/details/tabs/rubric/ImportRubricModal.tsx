"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchAssignments } from "@/lib/assignmentStorage";
import type { AssignmentItem } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { errorMessage } from "./rubricUtils";

export interface ImportRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssignment: AssignmentItem;
  onImport: (source: AssignmentItem) => void;
}

function ImportListSkeleton() {
  return (
    <ul className="space-y-2.5" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3.5">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Lists other assignments' rubrics in the course; the picked one is copied into the form.
 * Mount it only while open (fresh state per session).
 */
export function ImportRubricModal({ isOpen, onClose, currentAssignment, onImport }: ImportRubricModalProps) {
  const [items, setItems] = useState<AssignmentItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetchAssignments(currentAssignment.courseId)
      .then((list) => {
        if (!cancelled) setItems(list.filter((a) => a.id !== currentAssignment.id && a.rubric.criteria.length > 0));
      })
      .catch((e) => !cancelled && setError(errorMessage(e, "We couldn't load other rubrics.")));
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentAssignment.courseId, currentAssignment.id]);

  const source = items?.find((a) => a.id === selected) ?? null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Import Rubric"
      subtitle="Copy the rubric from another assignment in this course. You can edit it before saving."
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton disabled={!source} onClick={() => source && onImport(source)}>
            Import Rubric
          </PrimaryButton>
        </>
      }
    >
      {error ? (
        <p className="rounded-xl bg-red-14 p-3.5 body-sm-regular text-red-dark">{error}</p>
      ) : items === null ? (
        <ImportListSkeleton />
      ) : items.length === 0 ? (
        <p className="py-6 text-center body-sm-regular text-primary-300">No other assignments in this course have a rubric yet.</p>
      ) : (
        <ul className="space-y-2.5" role="listbox" aria-label="Rubrics">
          {items.map((a, i) => {
            const active = a.id === selected;
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 10) * 0.03 }}
              >
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={active}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(a.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    active ? "border-brand-orange bg-brand-orange-light" : "border-dash hover:bg-gray-bg"
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate body-sm-medium font-semibold! text-primary-500">{a.rubric.title}</span>
                    <span className="block truncate body-xsm-regular text-primary-300">{a.title}</span>
                  </span>
                  <ToneBadge tone="gray" size="sm">
                    {a.rubric.criteria.length} criteria · {a.rubric.totalPoints} pts
                  </ToneBadge>
                  {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-orange" />}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      )}
    </ModalShell>
  );
}

export default ImportRubricModal;
