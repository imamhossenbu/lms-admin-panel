"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Send, Trash2, X } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface AssignmentBulkBarProps {
  count: number;
  busy: boolean;
  onPublish: () => void;
  onDraft: () => void;
  onDelete: () => void;
  onClear: () => void;
}

/** Slides in above the table while rows are selected: Publish / Move to Draft / Delete. */
export function AssignmentBulkBar({ count, busy, onPublish, onDraft, onDelete, onClear }: AssignmentBulkBarProps) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-orange bg-brand-orange-light px-3.5 py-2.5">
            <ToneBadge tone="orange" variant="pill">
              {count} selected
            </ToneBadge>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <PrimaryButton size="sm" variant="outline" disabled={busy} onClick={onPublish} leftIcon={<Send className="w-3.5 h-3.5" />}>
                Publish
              </PrimaryButton>
              <PrimaryButton size="sm" variant="outline" disabled={busy} onClick={onDraft} leftIcon={<Archive className="w-3.5 h-3.5" />}>
                Move to Draft
              </PrimaryButton>
              <PrimaryButton size="sm" variant="danger" disabled={busy} onClick={onDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                Delete
              </PrimaryButton>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onClear}
                aria-label="Clear selection"
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-primary-400 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AssignmentBulkBar;
