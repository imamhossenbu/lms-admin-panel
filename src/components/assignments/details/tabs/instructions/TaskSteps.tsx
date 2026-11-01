import React from "react";
import { motion } from "framer-motion";
import { InlineCodeText } from "../../sidebar/preview/InlineCodeText";

/** Numbered task steps (number chip + text with inline code). */
export function TaskSteps({ steps }: { steps: string[] }) {
  if (!steps.length) return <p className="body-sm-regular text-primary-300">No task steps added yet.</p>;
  return (
    <ol className="space-y-2.5">
      {steps.map((step, i) => (
        <motion.li
          key={`${i}-${step}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: Math.min(i, 10) * 0.03 }}
          className="flex items-start gap-3"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-14 body-xsm-medium font-semibold! text-blue">{i + 1}</span>
          <span className="pt-0.5 body-sm-regular text-primary-400">
            <InlineCodeText text={step} />
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

export default TaskSteps;
