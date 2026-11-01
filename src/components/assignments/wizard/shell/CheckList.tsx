"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

/** Green-check bullet list ("Tips for a Good Assignment", "What happens next?"). */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.05 + i * 0.04 }}
          className="flex items-start gap-2.5 body-sm-regular text-primary-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-green text-white" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

export default CheckList;
