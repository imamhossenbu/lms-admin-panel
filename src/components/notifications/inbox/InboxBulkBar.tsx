"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArchiveRestore, MailCheck, MailOpen, Trash2, X } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface InboxBulkBarProps {
  count: number;
  busy: boolean;
  /** Every selected item is already read → the button marks them unread. */
  allRead: boolean;
  /** Archived view → the button restores instead. */
  archivedView: boolean;
  onToggleRead: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  onClear: () => void;
}

/** Slides in above the feed while notifications are selected: Mark read / Archive / Delete. */
export function InboxBulkBar({ count, busy, allRead, archivedView, onToggleRead, onToggleArchive, onDelete, onClear }: InboxBulkBarProps) {
  const icon = "h-3.5 w-3.5";
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
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {!archivedView && (
                <SecondaryButton size="sm" disabled={busy} onClick={onToggleRead} leftIcon={allRead ? <MailOpen className={icon} /> : <MailCheck className={icon} />}>
                  {allRead ? "Mark unread" : "Mark read"}
                </SecondaryButton>
              )}
              <SecondaryButton size="sm" disabled={busy} onClick={onToggleArchive} leftIcon={archivedView ? <ArchiveRestore className={icon} /> : <Archive className={icon} />}>
                {archivedView ? "Unarchive" : "Archive"}
              </SecondaryButton>
              <PrimaryButton size="sm" variant="danger" disabled={busy} onClick={onDelete} leftIcon={<Trash2 className={icon} />}>
                Delete
              </PrimaryButton>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onClear}
                aria-label="Clear selection"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InboxBulkBar;
