"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ROLE_TONES, type RoleTone } from "@/types/team";
import { cn } from "@/lib/cn";
import { ROLE_TONE_META } from "../shared/roleTone";

export interface ToneSwatchPickerProps {
  value: RoleTone;
  onChange: (tone: RoleTone) => void;
  disabled?: boolean;
}

/** Labelled colour circles (radio group) for the role badge colour. */
export function ToneSwatchPicker({ value, onChange, disabled }: ToneSwatchPickerProps) {
  return (
    <div role="radiogroup" aria-label="Role colour" className="flex flex-wrap items-start gap-3.5">
      {ROLE_TONES.map((tone) => {
        const checked = tone === value;
        const meta = ROLE_TONE_META[tone];
        return (
          <motion.button
            key={tone}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            onClick={() => onChange(tone)}
            className="flex cursor-pointer flex-col items-center gap-1.5 focus:outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-white ring-offset-2 transition-shadow", meta.swatch, checked ? cn("ring-2", meta.ring) : "ring-0")}>
              {checked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </span>
            <span className={cn("body-xsm-medium", checked ? "text-primary-500" : "text-primary-300")}>{meta.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default ToneSwatchPicker;
