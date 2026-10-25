"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Sparkles, Trash2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AiOutline, formatMinutes, outlineStats } from "../aiOutline";

interface AiOutlineNoticeProps {
  outline: AiOutline;
  onView: () => void;
  onRemove: () => void;
}

/** Banner confirming an accepted AI curriculum that will be saved with the course. */
export function AiOutlineNotice({ outline, onView, onRemove }: AiOutlineNoticeProps) {
  const stats = outlineStats(outline);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-purple/30 bg-purple-14 px-4 py-3">
        <span className="w-9 h-9 rounded-lg bg-white text-purple flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-sm-medium font-semibold text-primary-500">
            AI curriculum ready: {stats.moduleCount} modules · {stats.lessonCount} lessons
          </p>
          <p className="body-xsm-regular text-primary-300 mt-0.5">
            It will be added to the course curriculum when you save.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ToneBadge tone="purple" size="sm" variant="pill">
            {formatMinutes(stats.totalMinutes)}
          </ToneBadge>
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-dash body-xsm-medium text-primary-500 hover:text-purple transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-dash body-xsm-medium text-primary-400 hover:text-red hover:bg-red-14 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AiOutlineNotice;
