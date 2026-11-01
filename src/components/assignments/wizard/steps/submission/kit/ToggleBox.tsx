"use client";

import React, { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

export interface ToggleBoxProps {
  /** Sized icon, e.g. <Bot className="h-5 w-5" />. */
  icon: React.ReactNode;
  title: string;
  /** Muted suffix after the title, e.g. "(Optional)". */
  hint?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Shown (animated) below the header. */
  children?: React.ReactNode;
  /** Keep children visible when the toggle is off (default: only when on). */
  alwaysShowChildren?: boolean;
}

/** Bordered setting box: icon tile + title/description + blue toggle on the right, optional body. */
export function ToggleBox({ icon, title, hint, description, checked, onChange, children, alwaysShowChildren }: ToggleBoxProps) {
  const id = useId();
  const showBody = !!children && (checked || alwaysShowChildren);
  return (
    <div className="rounded-xl border border-dash bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">{icon}</span>
        <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer select-none">
          <span className="block body-sm-medium font-semibold! text-primary-500">
            {title}
            {hint && <span className="ml-1 body-sm-regular text-primary-300">{hint}</span>}
          </span>
          {description && <span className="mt-0.5 block body-xsm-regular text-primary-300">{description}</span>}
        </label>
        <ToggleSwitch id={id} checked={checked} onChange={onChange} className="mt-1" />
      </div>
      <AnimatePresence initial={false}>
        {showBody && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToggleBox;
