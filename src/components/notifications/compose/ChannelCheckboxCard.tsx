"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ChannelCheckboxCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
}

/** Multi-select tile with a checkbox (orange border + tint when checked). */
export function ChannelCheckboxCard({ title, description, icon, checked, onToggle }: ChannelCheckboxCardProps) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      onClick={onToggle}
      className={cn(
        "flex min-w-0 items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
        checked ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:border-primary-300/40"
      )}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", checked ? "bg-white text-brand-orange" : "bg-gray-bg text-primary-400")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={cn("block body-sm-medium", checked ? "text-brand-orange" : "text-primary-500")}>{title}</span>
        <span className="mt-0.5 block body-xsm-regular text-primary-300">{description}</span>
      </span>
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-brand-orange bg-brand-orange text-white" : "border-dash bg-white"
        )}
      >
        <AnimatePresence initial={false}>
          {checked && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="flex">
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

export default ChannelCheckboxCard;
