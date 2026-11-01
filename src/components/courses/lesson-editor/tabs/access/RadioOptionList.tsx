"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface RadioOption<T extends string> {
  value: T;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioOptionListProps<T extends string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  className?: string;
  "aria-label"?: string;
}

/** Vertical radio list with a title + helper line per option ("Access Type", "User Groups", "Access Before Release"). */
export function RadioOptionList<T extends string>({ name, value, onChange, options, className, ...rest }: RadioOptionListProps<T>) {
  return (
    <div role="radiogroup" aria-label={rest["aria-label"]} className={cn("space-y-3.5", className)}>
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            name={name}
            aria-checked={checked}
            disabled={option.disabled}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            className="flex w-full cursor-pointer items-start gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-white transition-colors",
                checked ? "border-brand-orange" : "border-dash"
              )}
            >
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-2.5 w-2.5 rounded-full bg-brand-orange"
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block body-sm-medium text-primary-500">{option.title}</span>
              {option.description && <span className="mt-0.5 block body-xsm-regular text-primary-300">{option.description}</span>}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default RadioOptionList;
