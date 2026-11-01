"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { CertificateAccent } from "@/types/certificate";
import { CERT_ACCENT } from "@/components/certificates/shared/certificateAccent";
import { cn } from "@/lib/cn";
import { ACCENT_ORDER, ACCENT_RING } from "./designerUtils";

export interface AccentSwatchPickerProps {
  value: CertificateAccent;
  onChange: (accent: CertificateAccent) => void;
}

/** Labelled, token-coloured circles with radio behaviour. */
export function AccentSwatchPicker({ value, onChange }: AccentSwatchPickerProps) {
  return (
    <div role="radiogroup" aria-label="Accent colour" className="flex flex-wrap items-start gap-4">
      {ACCENT_ORDER.map((accent) => {
        const checked = accent === value;
        const a = CERT_ACCENT[accent];
        return (
          <motion.button
            key={accent}
            type="button"
            role="radio"
            aria-checked={checked}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(accent)}
            className="flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-white ring-offset-2 transition-shadow",
                a.solid,
                checked ? cn("ring-2", ACCENT_RING[accent]) : "ring-0"
              )}
            >
              {checked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </span>
            <span className={cn("body-xsm-medium", checked ? "text-primary-500" : "text-primary-300")}>{a.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default AccentSwatchPicker;
