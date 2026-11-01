"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/** "What you'll learn" list with orange checkmarks. */
export function PreviewLearnChecklist({ items }: { items: string[] }) {
  return (
    <div className="text-left">
      <h4 className="title-sm font-semibold text-primary-500">What you&apos;ll learn</h4>
      {items.length ? (
        <ul className="mt-3 space-y-2.5">
          {items.map((item, index) => (
            <motion.li
              key={`${index}-${item}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: index * 0.04 }}
              className="flex items-start gap-2.5 body-sm-regular text-primary-400"
            >
              <Check className="w-4.5 h-4.5 shrink-0 mt-0.5 text-brand-orange" strokeWidth={2.5} />
              <span className="min-w-0 break-words">{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 body-sm-regular text-primary-300">
          Learning outcomes will appear here once you add them to the curriculum or description.
        </p>
      )}
    </div>
  );
}

export default PreviewLearnChecklist;
