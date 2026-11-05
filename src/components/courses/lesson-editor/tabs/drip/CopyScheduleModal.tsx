"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { fetchLessonEditor } from "@/lib/lessonEditorStorage";
import { LessonRow } from "../access/LessonRow";
import type { LessonOption } from "../access/lessonOptions";
import { RELEASE_TYPE_LABEL, type DripValues } from "./dripOptions";

export interface CopyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lessonOptions: LessonOption[];
  onCopy: (drip: DripValues, source: LessonOption) => void;
}

/** Pick another lesson of the course and copy its drip settings. */
export function CopyScheduleModal({ isOpen, onClose, courseId, lessonOptions, onCopy }: CopyScheduleModalProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  // Each lesson's saved schedule, read from the API when the modal opens (rows show their badge as they load).
  const [schedules, setSchedules] = useState<Map<string, DripValues>>(() => new Map());
  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    for (const o of lessonOptions) {
      void fetchLessonEditor(courseId, o.id).then(
        ({ values }) => alive && setSchedules((prev) => new Map(prev).set(o.id, values.drip)),
        () => undefined
      );
    }
    return () => {
      alive = false;
    };
  }, [isOpen, courseId, lessonOptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? lessonOptions.filter((o) => o.label.toLowerCase().includes(q) || o.moduleLabel.toLowerCase().includes(q)) : lessonOptions;
  }, [lessonOptions, query]);

  const handleClose = () => {
    setQuery("");
    setSelectedId("");
    onClose();
  };

  const handleCopy = () => {
    const source = lessonOptions.find((o) => o.id === selectedId);
    const drip = schedules.get(selectedId);
    if (!source || !drip) return;
    onCopy(drip, source);
    handleClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Copy Schedule"
      subtitle="Copy the drip schedule from another lesson of this course."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={handleClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleCopy} disabled={!selectedId || !schedules.has(selectedId)} leftIcon={<Copy className="h-4 w-4" />}>
            Copy Schedule
          </PrimaryButton>
        </>
      }
    >
      <InputField value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons..." aria-label="Search lessons" leftElement={<Search className="h-4 w-4" />} />
      <ul role="listbox" className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
        {filtered.length === 0 && <li className="py-6 text-center body-sm-regular text-primary-300">No lessons found</li>}
        {filtered.map((lesson) => {
          const selected = lesson.id === selectedId;
          const drip = schedules.get(lesson.id);
          return (
            <li key={lesson.id} role="option" aria-selected={selected}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId(lesson.id)}
                className={cn(
                  "w-full cursor-pointer rounded-xl border px-3 py-2.5 transition-colors",
                  selected ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:bg-slate-50"
                )}
              >
                <LessonRow
                  lesson={lesson}
                  trailing={drip ? <ToneBadge tone={drip.releaseType === "IMMEDIATE" ? "gray" : "blue"} size="sm">{RELEASE_TYPE_LABEL[drip.releaseType]}</ToneBadge> : undefined}
                />
              </motion.button>
            </li>
          );
        })}
      </ul>
    </ModalShell>
  );
}

export default CopyScheduleModal;
