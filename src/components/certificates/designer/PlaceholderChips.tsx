"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CERT_PLACEHOLDERS } from "@/validations/certificateSchema";
import { PLACEHOLDER_LABEL } from "./designerUtils";

export interface PlaceholderChipsProps {
  /** Current body text (used chips are highlighted). */
  text: string;
  onInsert: (placeholder: string) => void;
}

/** Row of clickable placeholder chips that insert at the cursor in the body text. */
export function PlaceholderChips({ text, onInsert }: PlaceholderChipsProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Insert a placeholder">
      <span className="body-xsm-regular text-primary-300 mr-1">Insert:</span>
      {CERT_PLACEHOLDERS.map((p) => {
        const used = text.includes(p);
        return (
          <motion.button
            key={p}
            type="button"
            whileTap={{ scale: 0.95 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsert(p)}
            title={`Insert ${PLACEHOLDER_LABEL[p]}`}
            className="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30"
          >
            <ToneBadge tone={used ? "orange" : "gray"} size="sm" icon={<Plus className="h-3 w-3" />}>
              {p}
            </ToneBadge>
          </motion.button>
        );
      })}
    </div>
  );
}

export default PlaceholderChips;
