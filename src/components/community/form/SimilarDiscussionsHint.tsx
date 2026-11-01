"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Info, MessageSquare } from "lucide-react";
import { useSimilarThreads } from "./useSimilarThreads";

export interface SimilarDiscussionsHintProps {
  title: string;
  courseId: string;
  /** Thread being edited — never listed as its own duplicate. */
  excludeId?: string;
}

/** "Similar discussions" hint under the title: up to 3 threads in the same course with overlapping title words. */
export function SimilarDiscussionsHint({ title, courseId, excludeId }: SimilarDiscussionsHintProps) {
  const matches = useSimilarThreads(title, courseId, excludeId);

  return (
    <AnimatePresence initial={false}>
      {matches.length > 0 && (
        <motion.div
          key="similar"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="mt-3 rounded-xl border border-blue/30 bg-blue-14 p-3.5" role="status" aria-live="polite">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
              <div className="min-w-0 flex-1">
                <p className="body-sm-medium font-semibold! text-primary-500">Similar discussions</p>
                <p className="mt-0.5 body-xsm-regular text-primary-300">These may already cover your topic. Check them before posting.</p>
                <ul className="mt-2.5 space-y-1.5">
                  {matches.map((t, i) => (
                    <motion.li key={t.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
                      <a
                        href={`/community/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-dash hover:border-blue/40 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0 text-primary-300" />
                        <span className="min-w-0 flex-1 truncate body-sm-regular text-primary-500 group-hover:text-blue">{t.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary-300 group-hover:text-blue" aria-label="Opens in a new tab" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SimilarDiscussionsHint;
