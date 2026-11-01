"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, LockOpen, Pin, PinOff, Trash2, X } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface CommunityBulkBarProps {
  count: number;
  busy: boolean;
  /** true when every selected thread already has the flag → the button reverses it. */
  allPinned: boolean;
  allLocked: boolean;
  allHidden: boolean;
  onPin: () => void;
  onLock: () => void;
  onHide: () => void;
  onDelete: () => void;
  onClear: () => void;
}

/** Slides in above the table while rows are selected: Pin / Lock / Hide (or their reverse) / Delete. */
export function CommunityBulkBar({ count, busy, allPinned, allLocked, allHidden, onPin, onLock, onHide, onDelete, onClear }: CommunityBulkBarProps) {
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
              <PrimaryButton size="sm" variant="outline" disabled={busy} onClick={onPin} leftIcon={allPinned ? <PinOff className={icon} /> : <Pin className={icon} />}>
                {allPinned ? "Unpin" : "Pin"}
              </PrimaryButton>
              <PrimaryButton size="sm" variant="outline" disabled={busy} onClick={onLock} leftIcon={allLocked ? <LockOpen className={icon} /> : <Lock className={icon} />}>
                {allLocked ? "Unlock" : "Lock"}
              </PrimaryButton>
              <PrimaryButton size="sm" variant="outline" disabled={busy} onClick={onHide} leftIcon={allHidden ? <Eye className={icon} /> : <EyeOff className={icon} />}>
                {allHidden ? "Unhide" : "Hide"}
              </PrimaryButton>
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

export default CommunityBulkBar;
