"use client";

import React from "react";
import { motion } from "framer-motion";
import type { RubricCriterion } from "@/types/assignment";
import { cn } from "@/lib/cn";

export interface RubricLevelPickerProps {
  criterion: RubricCriterion;
  value: number | undefined;
  onChange: (points: number) => void;
  error?: boolean;
}

/** Choose one level (points) for a rubric criterion. */
export function RubricLevelPicker({ criterion, value, onChange, error }: RubricLevelPickerProps) {
  return (
    <fieldset className={cn("rounded-xl border p-3.5", error ? "border-red" : "border-dash")}>
      <legend className="sr-only">{criterion.title}</legend>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="body-sm-medium font-semibold! text-primary-500">{criterion.title}</span>
        <span className="body-xsm-regular text-primary-300">
          {typeof value === "number" ? value : "-"} / {criterion.points} pts
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {criterion.levels.map((level) => {
          const active = value === level.points;
          return (
            <motion.button
              key={level.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              aria-pressed={active}
              onClick={() => onChange(level.points)}
              title={level.description}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors",
                active ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:bg-slate-50"
              )}
            >
              <span className={cn("block body-xsm-medium", active ? "text-brand-orange" : "text-primary-500")}>{level.label}</span>
              <span className="block body-2xsm-regular text-primary-300">{level.points} pts</span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default RubricLevelPicker;
