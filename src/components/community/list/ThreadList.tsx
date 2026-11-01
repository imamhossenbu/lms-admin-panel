"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ThreadView } from "@/lib/communityStats";
import { ThreadCard } from "./ThreadCard";
import type { ThreadRowHandlers } from "./ThreadRowActions";

export interface ThreadListProps {
  views: ThreadView[];
  handlers: ThreadRowHandlers;
}

/** Animated stack of thread cards (stagger on entry, layout animation when pinning reorders or rows leave). */
export function ThreadList({ views, handlers }: ThreadListProps) {
  return (
    <motion.div layout className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {views.map((v, idx) => (
          <motion.div
            key={v.thread.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(idx, 8) * 0.03 }}
          >
            <ThreadCard view={v} handlers={handlers} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default ThreadList;
