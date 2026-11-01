"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import type { ThreadFormValues } from "@/validations/communitySchema";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { TYPE_TIPS } from "./threadFormUtils";

/** "Writing a good discussion" tips that change with the selected type. */
export function WritingTipsCard() {
  const { control } = useFormContext<ThreadFormValues>();
  const category = useWatch({ control, name: "category" }) ?? "QUESTION";
  return (
    <ProTipCard title="Writing a good discussion">
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={category}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-1 list-disc space-y-1 pl-4"
        >
          {TYPE_TIPS[category].map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </ProTipCard>
  );
}

export default WritingTipsCard;
