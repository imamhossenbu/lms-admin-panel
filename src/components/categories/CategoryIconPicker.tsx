"use client";

import React from "react";
import { motion } from "framer-motion";
import { CATEGORY_ICONS } from "./categoryIcons";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryIconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  error?: string;
}

/** 5-column grid of category icons; the selected one gets the orange ring. */
export function CategoryIconPicker({ value, onChange, error }: CategoryIconPickerProps) {
  return (
    <div>
      <p className="block body-sm-regular text-primary-400 mb-1.5 select-none">
        Icon & Theme <span className="text-red">*</span>
      </p>
      <div role="radiogroup" aria-label="Category icon" className="grid grid-cols-5 gap-2">
        {CATEGORY_ICONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-icon={opt.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(opt.id)}
              className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                selected ? "border-brand-orange bg-brand-orange-light ring-2 ring-brand-orange/20" : "border-dash bg-white hover:bg-slate-50"
              }`}
              title={opt.label}
            >
              <CategoryIconRenderer iconId={opt.id} size="sm" />
              <span className="body-2xsm-regular text-primary-400 truncate max-w-full block">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
      {error && <p className="mt-1 body-2xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default CategoryIconPicker;
