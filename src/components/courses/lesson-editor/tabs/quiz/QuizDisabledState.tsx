"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardX } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Shown inside "Quiz Settings" while "Enable Quiz" is off. */
export function QuizDisabledState({ onEnable }: { onEnable: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-dash bg-gray-bg px-6 py-8 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-300 shadow-2xs">
        <ClipboardX className="h-6 w-6" />
      </span>
      <div>
        <p className="body-sm-medium text-primary-500">No quiz for this lesson</p>
        <p className="mt-1 body-xsm-regular text-primary-300">
          Turn on &quot;Enable Quiz&quot; to add questions, a passing score and attempt rules.
        </p>
      </div>
      <PrimaryButton size="sm" onClick={onEnable}>
        Enable Quiz
      </PrimaryButton>
    </motion.div>
  );
}

export default QuizDisabledState;
