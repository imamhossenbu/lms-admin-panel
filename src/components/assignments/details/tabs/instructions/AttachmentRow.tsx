"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import type { AssignmentAttachment } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { fileVisual, formatBytes } from "./attachmentUtils";

export interface AttachmentRowProps {
  file: AssignmentAttachment;
  index: number;
  disabled?: boolean;
  onRename: () => void;
  onRemove: () => void;
}

/** One attachment: type icon, name, size, download + ⋮ (Rename / Remove). */
export function AttachmentRow({ file, index, disabled, onRename, onRemove }: AttachmentRowProps) {
  const { icon: Icon, tile } = fileVisual(file.format);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.03 }}
      className="flex items-center gap-3 py-2.5"
    >
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tile)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate body-sm-medium text-primary-500" title={file.name}>
          {file.name}
        </p>
        <p className="body-xsm-regular text-primary-300">{formatBytes(file.size)}</p>
      </div>
      <motion.a
        whileTap={{ scale: 0.92 }}
        href={file.url}
        download={file.name}
        target="_blank"
        rel="noreferrer"
        aria-label={`Download ${file.name}`}
        title="Download"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dash bg-white text-blue transition-colors hover:bg-blue-14"
      >
        <Download className="h-4 w-4" />
      </motion.a>
      <AppDropdownMenu
        items={[
          { key: "rename", label: "Rename", icon: <Pencil className="h-4 w-4" />, onClick: onRename, disabled },
          { key: "remove", label: "Remove", icon: <Trash2 className="h-4 w-4" />, onClick: onRemove, danger: true, disabled },
        ]}
        trigger={
          <button
            type="button"
            aria-label={`More actions for ${file.name}`}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:bg-gray-bg"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        }
      />
    </motion.li>
  );
}

export default AttachmentRow;
