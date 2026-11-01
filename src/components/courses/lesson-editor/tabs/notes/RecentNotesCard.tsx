"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorNote } from "@/validations/lessonEditorSchema";
import { noteMeta, recentNotes, splitNote } from "./noteUtils";

/** Right "Recent Notes": the 3 most recent notes by creation date. */
export function RecentNotesCard({ notes }: { notes: LessonEditorNote[] }) {
  const recent = recentNotes(notes, 3);

  return (
    <EditorSectionCard icon={<History className="h-5 w-5" />} title="Recent Notes">
      {recent.length === 0 ? (
        <p className="body-xsm-regular text-primary-300">Recently added notes will show up here.</p>
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {recent.map((note) => (
              <motion.li
                key={note.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl border border-dash bg-white px-4 py-3"
              >
                <p className="truncate body-sm-medium font-semibold! text-primary-500">{splitNote(note.html).title.replace(/^Important:\s*/i, "")}</p>
                <p className="mt-0.5 body-xsm-regular text-primary-300">{noteMeta(note)}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </EditorSectionCard>
  );
}

export default RecentNotesCard;
