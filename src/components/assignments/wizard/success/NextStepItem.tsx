"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface NextStepItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  disabled?: boolean;
  onClick: () => void;
}

/** One "Next Steps" action row: icon tile, title + description, arrow. */
export function NextStepItem({ icon: Icon, title, description, index, disabled, onClick }: NextStepItemProps) {
  return (
    <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 + index * 0.04 }}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dash bg-white p-3 text-left transition-colors hover:bg-blue-14 disabled:cursor-wait disabled:opacity-60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block body-sm-medium font-semibold! text-primary-500">{title}</span>
          <span className="block body-xsm-regular text-primary-300">{description}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary-400 transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    </motion.li>
  );
}

export default NextStepItem;
