"use client";

import React from "react";
import { motion } from "framer-motion";
import { Archive, ArchiveRestore, Mail, MailOpen, Trash2, type LucideIcon } from "lucide-react";
import type { AdminNotification } from "@/types/notification";
import { cn } from "@/lib/cn";

export interface InboxRowHandlers {
  onToggleRead: (n: AdminNotification) => void;
  onToggleArchive: (n: AdminNotification) => void;
  onDelete: (n: AdminNotification) => void;
}

function ActionIcon({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white transition-colors",
        danger ? "text-red hover:bg-red-14" : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
      )}
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  );
}

/** Hover / focus actions on an inbox row: read ↔ unread, archive ↔ unarchive, delete. */
export function InboxRowActions({ item, handlers, className }: { item: AdminNotification; handlers: InboxRowHandlers; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {!item.isArchived && (
        <ActionIcon icon={item.isRead ? Mail : MailOpen} label={item.isRead ? "Mark as unread" : "Mark as read"} onClick={() => handlers.onToggleRead(item)} />
      )}
      <ActionIcon
        icon={item.isArchived ? ArchiveRestore : Archive}
        label={item.isArchived ? "Move to inbox" : "Archive"}
        onClick={() => handlers.onToggleArchive(item)}
      />
      <ActionIcon icon={Trash2} label="Delete" danger onClick={() => handlers.onDelete(item)} />
    </div>
  );
}

export default InboxRowActions;
