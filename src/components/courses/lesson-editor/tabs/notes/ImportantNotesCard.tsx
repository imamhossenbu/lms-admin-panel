"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pin } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorNote } from "@/validations/lessonEditorSchema";
import { noteMeta, splitNote } from "./noteUtils";

/** Right "Important Notes (N)": orange highlighted cards. */
export function ImportantNotesCard({ notes }: { notes: LessonEditorNote[] }) {
  const important = notes.filter((n) => n.important);

  return (
    <EditorSectionCard icon={<Pin className="h-5 w-5" />} tone="orange" title={`Important Notes (${important.length})`}>
      {important.length === 0 ? (
        <p className="body-xsm-regular text-primary-300">Turn on &quot;Save as important note&quot; to pin a note here.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {important.map((note) => {
              const { title, body } = splitNote(note.html);
              return (
                <motion.li
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-start gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange-light p-4"
                >
                  <Pin className="mt-0.5 h-4 w-4 shrink-0 fill-current text-brand-orange" />
                  <div className="min-w-0">
                    <p className="body-sm-medium font-semibold! text-primary-500">{title.replace(/^Important:\s*/i, "")}</p>
                    {body && <p className="mt-1 line-clamp-3 body-xsm-regular text-primary-400">{body}</p>}
                    <p className="mt-1.5 body-xsm-regular text-primary-300">{noteMeta(note)}</p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </EditorSectionCard>
  );
}

export default ImportantNotesCard;
