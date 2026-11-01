"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT_ORDER, ACCENT_STYLE, type BrandAccent } from "./brandingUtils";

export interface AccentSwatchesProps {
  value: BrandAccent;
  onChange: (accent: BrandAccent) => void;
}

/** Five token swatch tiles with radio behaviour (orange border + tint on the selected one). */
export function AccentSwatches({ value, onChange }: AccentSwatchesProps) {
  return (
    <div role="radiogroup" aria-label="Accent colour" className="grid grid-cols-2 gap-3 @md:grid-cols-3 @2xl:grid-cols-5">
      {ACCENT_ORDER.map((accent) => {
        const a = ACCENT_STYLE[accent];
        const checked = accent === value;
        return (
          <motion.button
            key={accent}
            type="button"
            role="radio"
            aria-checked={checked}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => onChange(accent)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-xl border p-3 text-left transition-colors",
              checked ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:border-slate-300"
            )}
          >
            <span className="flex w-full items-center justify-between">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-white ring-offset-2 transition-shadow", a.solid, checked ? cn("ring-2", a.ring) : "ring-0")}>
                {checked && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                    <Check className="h-4 w-4" />
                  </motion.span>
                )}
              </span>
              <span className="flex gap-1">
                <span className={cn("h-2 w-5 rounded-full", a.solid)} />
                <span className={cn("h-2 w-3 rounded-full border border-dash", a.soft)} />
              </span>
            </span>
            <span className="min-w-0">
              <span className={cn("block body-sm-medium font-semibold!", checked ? "text-brand-orange" : "text-primary-500")}>{a.label}</span>
              <span className="block truncate body-2xsm-regular text-primary-300">{a.hint}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default AccentSwatches;
