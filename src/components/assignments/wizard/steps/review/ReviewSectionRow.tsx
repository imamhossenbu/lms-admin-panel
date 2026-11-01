"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { ReviewSection } from "./reviewSummary";

export interface ReviewSectionRowProps {
  index: number;
  section: ReviewSection;
  hasError: boolean;
  onEdit: () => void;
}

/** One numbered review row: title/subtitle | key–value summary | Edit. Red border + badge when it has errors. */
export function ReviewSectionRow({ index, section, hasError, onEdit }: ReviewSectionRowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={cn(
        "grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 md:grid-cols-12 md:items-center",
        hasError ? "border-red bg-red-14" : "border-dash"
      )}
    >
      <div className="flex items-center gap-3.5 md:col-span-5">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full body-sm-medium font-semibold!",
            hasError ? "bg-red text-white" : "bg-blue-14 text-primary-500"
          )}
        >
          {index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="body-md-medium font-semibold! text-primary-500">{section.title}</h4>
            {hasError && (
              <ToneBadge tone="red" size="sm">
                Needs attention
              </ToneBadge>
            )}
          </div>
          <p className="mt-0.5 body-sm-regular text-primary-300">{section.subtitle}</p>
        </div>
      </div>
      <dl className="space-y-1 border-dash md:col-span-5 md:border-l md:pl-4">
        {section.rows.map(([label, value]) => (
          <div key={label} className="flex flex-wrap gap-x-1.5 body-xsm-regular">
            <dt className="text-primary-300">{label}:</dt>
            <dd className="min-w-0 break-words body-xsm-medium text-primary-500">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex md:col-span-2 md:justify-end">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          aria-label={`Edit ${section.title}`}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-dash bg-white px-3.5 body-sm-medium text-blue transition-colors hover:bg-blue-14"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </motion.button>
      </div>
    </motion.li>
  );
}

export default ReviewSectionRow;
